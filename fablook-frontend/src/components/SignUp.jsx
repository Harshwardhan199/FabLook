import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { getAuth, updateProfile, signOut } from "firebase/auth"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import axios from "axios";

import "./Styles.css";

const SignUpForm = () => {
	const navigate = useNavigate();

	const auth = getAuth();
	const provider = new GoogleAuthProvider();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmpassword, setConfirmPassword] = useState("");

	const [passwordRule, setPasswordRules] = useState({
		length: false,
		letter: false,
		number: false,
		specialChar: false
	});

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const [emailIsValid, setEmailIsValid] = useState(false);
	const [passwordNotMatched, setPasswordNotMatched] = useState(true);

	const [isEmailFocused, setIsEmailFocused] = useState(false);
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);
	const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);

	const emailRef = useRef(null);
	const passwordRef = useRef(null);
	const confirmPasswordRef = useRef(null);

	const checkAndSetEmail = (e, emailRef) => {
		e.preventDefault();

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

	const checkAndSetPassword = (e) => {
		e.preventDefault();

		setPassword(e.target.value);

		const passToCheck = e.target.value;

		const newRules = {
			length: passToCheck.length >= 8,
			letter: /[A-Za-z]/.test(passToCheck),
			number: /\d/.test(passToCheck),
			specialChar: /[@_!#$%^&*.,?]/.test(passToCheck)
		}

		setPasswordRules(newRules);

		const allValid = Object.values(newRules).every(Boolean);

		if (allValid || passToCheck.length === 0) {
			passwordRef.current.style.borderColor = "white";
		} else {
			passwordRef.current.style.borderColor = "red";
		}
	};

	const togglePassword = (e, refInput, bool, boolSetter) => {
		e.preventDefault();

		if (refInput.current) {
			const cursorPosition = refInput.current.selectionStart;
			boolSetter(!bool);

			setTimeout(() => {
				refInput.current.focus();
				refInput.current.setSelectionRange(cursorPosition, cursorPosition);
			}, 0);
		}
	};

	const checkAndSetConfirmPassword = (e) => {
		e.preventDefault();

		setConfirmPassword(e.target.value);

		const passTomatch = e.target.value;

		if (password === passTomatch) {
			setPasswordNotMatched(false);
			confirmPasswordRef.current.style.borderColor = "white";
		}
		else {
			setPasswordNotMatched(true);
			confirmPasswordRef.current.style.borderColor = passTomatch.length > 0 ? "red" : "white";
		}
	};

	const Logout = () => {
			const auth = getAuth();
			signOut(auth)
				.then(() => {
					console.log("User logged out successfully.");
				})
				.catch((error) => {
					console.error("Error during sign out:", error.message);
				});
		};

	const handleEmailSignUp = async (e) => {
		e.preventDefault();

		try {
			// Create user
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			// Generate Profile photo
			const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&length=1&background=random&font-size=0.7`;
			await updateProfile(user, {
				photoURL: avatarUrl,
			});

			// Log for successfull user creation
			console.log("User created as:", userCredential.user.email);

			// Send user data to Backend for user registration
			await axios.post("http://localhost:5000/api/users/registerUser", {
				UID: user.uid,
				name,
				email,
				password,
				verified: false
			}, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			// User resistration conformation log
			console.log("User data stored in DB:", email);

			// Configured verification link action
			const actionCodeSettings = {
				url: 'http://localhost:5173/login', //verification?verifiedStatus=true',
				handleCodeInApp: false,
			};

			// Sent verification link
			sendEmailVerification(user, actionCodeSettings).then(() => {
				Logout();
				navigate("/verification");
			});
		}
		catch (error) {
			console.error("SignUp error:", error.message);
		}
	};

	const handleGoogleSignIn = async (e) => {
		e.preventDefault();

		try {
			const result = await signInWithPopup(auth, provider);
			const user = result.user;

			console.log("Google user created/logged in:", user.displayName, user.email, user.photoURL);

			await axios.post("http://localhost:5000/api/users/registerUser", {
				UID: user.uid,
				name: user.displayName,
				email: user.email,
				password: undefined,
				verified: false
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
				<p className="login-text">SignUp</p>
				<p className="login-greeting">Just some details to get you in.!</p>
				<form className="form-container" onSubmit={handleEmailSignUp}>
					<div className="input-container">
						<input
							className="login-input"
							type="text"
							placeholder="Username"
							value={name}
							onChange={e => setName(e.target.value)}
							onFocus={() => {
								setIsConfirmPasswordFocused(false);
								setIsPasswordFocused(false);
							}}
							required />
					</div>
					<div className="input-container">
						<input
							className="login-input"
							type="email"
							placeholder="Email"// / Phone" 
							value={email}
							onChange={(e) => checkAndSetEmail(e, emailRef)}
							onFocus={() => {
								setIsConfirmPasswordFocused(false);
								setIsPasswordFocused(false);
								setIsEmailFocused(true)
							}}
							onBlur={() => setIsEmailFocused(false)}
							ref={emailRef}
							required
						/>
					</div>

					{isEmailFocused && email.length > 0 && !emailIsValid && <p className="errorText">Please enter a valid email address</p>}

					{/* Password */}
					<div className="input-container">
						<input
							className="login-input"
							type={showPassword ? "text" : "password"}
							placeholder="Password"
							value={password}
							onChange={(e) => checkAndSetPassword(e)}
							onFocus={() => {
								setIsConfirmPasswordFocused(false);
								setIsPasswordFocused(true);
							}}
							ref={passwordRef}
							required
						/>
						{password.length > 0 && (
							<button
								type="button"
								className="eye-btn"
								onClick={(e) => togglePassword(e, passwordRef, showPassword, setShowPassword)}
							>
								<img src={showPassword ? "/assets/visible.png" : "/assets/hidden.png"} alt="Toggle Password" />
							</button>
						)}
					</div>

					{isPasswordFocused && password.length > 0 && (
						!passwordRule.length && <p className="errorText">At least 8 characters</p> ||
						!passwordRule.letter && <p className="errorText">Includes a letter</p> ||
						!passwordRule.number && <p className="errorText">Includes a number</p> ||
						!passwordRule.specialChar && <p className="errorText">Includes a special character</p>
					)}

					{/* Confirm Password */}
					<div className="input-container">
						<input
							className="login-input"
							type={showConfirmPassword ? "text" : "password"}
							placeholder="Confirm Password"
							value={confirmpassword}
							onChange={(e) => checkAndSetConfirmPassword(e)}
							onFocus={() => {
								setIsPasswordFocused(false);
								setIsConfirmPasswordFocused(true);
							}}
							ref={confirmPasswordRef}
							required
						/>
						{confirmpassword.length > 0 && (
							<button
								type="button"
								className="eye-btn"
								onClick={(e) => togglePassword(e, confirmPasswordRef, showConfirmPassword, setShowConfirmPassword)}
							>
								<img src={showConfirmPassword ? "/assets/visible.png" : "/assets/hidden.png"} alt="Toggle Password" />
							</button>
						)}
					</div>

					{isConfirmPasswordFocused && confirmpassword.length > 0 && passwordNotMatched && <p className="errorText">Passwords don't match</p>}

					<button className="login-button" type="submit">SignUp</button>
					<div className="or-text-container">
						<hr className='line' />
						<span className="or-text">Or</span>
						<hr className='line' />
					</div>
					<div className='social-login-container'>
						<a onClick={(e) => handleGoogleSignIn(e)}>
							<img src="https://cdn-icons-png.flaticon.com/512/281/281764.png" alt="Google" />
						</a>
						<a href="">
							<img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" />
						</a>
					</div>
					<div className='do-not-text-container'>
						<p className='do-not-text'>Already Registered? <Link to="/login">Login</Link></p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUpForm;
