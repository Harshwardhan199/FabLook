import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import axios from "axios";

import { auth } from "../firebase.js";
import useCurrentUser from "./currentUser";

import "./Styles.css";

const LoginForm = () => {
	const navigate = useNavigate();

	const auth = getAuth();
	const user = useCurrentUser();
	const provider = new GoogleAuthProvider();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const [emailIsValid, setEmailIsValid] = useState(false);
	const [isEmailFocused, setIsEmailFocused] = useState(false);

	const emailRef = useRef(null);
	const passwordRef = useRef(null);

	const togglePassword = () => {
		if (passwordRef.current) {
			const cursorPosition = passwordRef.current.selectionStart;
			setShowPassword(!showPassword);

			setTimeout(() => {
				passwordRef.current.focus();
				passwordRef.current.setSelectionRange(cursorPosition, cursorPosition);
			}, 0);
		}
	};

	const checkAndSetEmail = (e, emailRef) => {
		setEmail(e.target.value);

		const emailToCheck = e.target.value;
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const testEmail = emailPattern.test(emailToCheck);

		setEmailIsValid(testEmail);

		if (testEmail) {
			emailRef.current.style.borderColor = "white";
		}
		else {
			emailRef.current.style.borderColor = emailToCheck.length > 0 ? "red" : "white";
		}
	};

	const afterLogin = async (user) => {
		console.log(user);
		if (user) {
			console.log("User is signed in.");

			//Get latest user data
			await user.reload();

			// Check if verified then store user dat in DB
			if (user.emailVerified) {
				console.log("Email is verified!");

				try {
					// Mark user verified:true in DB
					await axios.post("https://fablook.onrender.com/api/users/verifyUser", {
						UID: user.uid,
					}, {
						headers: {
							"Content-Type": "application/json",
						},
					});

					// navigate to home
					navigate("/");
				} catch (error) {
					console.error("Error while saving user to DB:", error);
				}
			}
			// if not verified then keep showing the verification sent message
			else {
				console.log("Email not verified yet.");
			}
		}
		// if user is not signed display form 
		else {
			console.log("User is signed out.");
		}
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password);

			console.log("Logged in as:", userCredential.user.email);

			const signedInUser = userCredential.user;
			await afterLogin(signedInUser);
		} catch (error) {
			console.error("Login error:", error.message);
		}
	};

	const handleGoogleSignIn = async (e) => {
		e.preventDefault();

		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			await axios.post("https://fablook.onrender.com/api/users/registerUser", {
				UID: user.uid,
				name: user.displayName,
				email: user.email,
				password: undefined,
				verified: true
			}, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			// User resistration conformation log
			console.log("User data stored in DB:", user.email);

			navigate("/");

		} catch (error) {
			console.error("Google Sign-Up error:", error.message);
		}
	};

	return (
		<div className="lsf-container">
			<div className="login-container">
				<p className="login-text">Login</p>
				<p className="login-greeting">Glad you're back!</p>
				<form className="form-container" onSubmit={handleLogin}>
					<div className="input-container">
						<input
							className="login-input"
							type="text"
							placeholder="Email"
							value={email}
							onChange={(e) => checkAndSetEmail(e, emailRef)}
							onFocus={() => setIsEmailFocused(true)}
							onBlur={() => setIsEmailFocused(false)}
							ref={emailRef}
							required />
					</div>
					{isEmailFocused && email.length > 0 && !emailIsValid && <p className="errorText">Please enter a valid email address</p>}
					<div className="input-container">
						<input
							className="login-input"
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							ref={passwordRef}
							required
						/>
						{password.length > 0 && (
							<button type="button" className="eye-btn" onClick={togglePassword}>
								<img src={showPassword ? "/assets/visible.png" : "/assets/hidden.png"} alt="Toggle Password" />
							</button>
						)}
					</div>
					<div className='input-checkbox'>
						<input className="login-input" type="checkbox" id="remember-me" />
						<label htmlFor="remember-me">Remember me</label>
					</div>
					<button className="login-button" type="submit">Login</button>
					<p className="forgot-password"><Link to="/forgot-password">Forgot password?</Link></p>
					<div className="or-text-container">
						<hr className='line' />
						<span className="or-text">Or</span>
						<hr className='line' />
					</div>
					<div className='social-login-container'>
						<a onClick={(e) => handleGoogleSignIn(e)}>
							<img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google" />
						</a>
						<a >
							<img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" />
						</a>
					</div>
					<div className='do-not-text-container'>
						<p className='do-not-text'>Don't have an account? <Link to="/signup">SignUp</Link></p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
