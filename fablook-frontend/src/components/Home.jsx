import React, { useState, useRef, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import useCurrentUser from "./currentUser";

import "./Home.css";

const Home = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolling, setIsScrolling] = useState(false);

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userName, setUserName] = useState("");
	const [profileImageUrl, setProfileImageUrl] = useState("");

	const catContRef = useRef(null);

	const dealContRef = useRef(null);
	const dealImgRef = useRef(null);

	const userNameRef = useRef(null);

	const user = useCurrentUser();

	const navigate = useNavigate();

	const retrieveUserData = async () => {
		try {
			const response = await axios.post("http://localhost:5000/api/users/userDataDB", {
				UID: user.uid
			}, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			setUserName(response.data.name);
		}
		catch (error) {
			console.error("Error Fetching User Data:", error.message);
		}
	};

	const LoginUser = () => {
		if (!isLoggedIn) {
			navigate("/login");
		}
	};

	const Logout = () => {
		const auth = getAuth();
		signOut(auth)
			.then(() => {
				console.log("User logged out successfully.");
				setIsLoggedIn(false);

				navigate("/login");
			})
			.catch((error) => {
				console.error("Error during sign out:", error.message);
			});
	};

	useEffect(() => {
		const imgEl = dealImgRef.current;
		const scrollCont = dealContRef.current;

		const handleImageLoad = () => {
			const scrollValue = imgEl.clientWidth;
			scrollCont.scrollLeft = scrollValue;
		};

		if (imgEl.complete) {
			handleImageLoad();
		} else {
			imgEl.addEventListener("load", handleImageLoad);
		}

		return () => imgEl.removeEventListener("load", handleImageLoad);
	}, []);

	useEffect(() => {
		if (user) {
			if (user.emailVerified) {
				setIsLoggedIn(true);

				retrieveUserData();
				console.log("Logged in user:", user.email);

				if (user.photoURL) {
					// console.log("Photo Found");
					setProfileImageUrl(user.photoURL);
				} else {
					console.log("Photo not found");
				}
			}
			else {
				const auth = getAuth();
				signOut(auth)
					.then(() => {
						console.log("User logged out successfully.");
						setIsLoggedIn(false);
					})
					.catch((error) => {
						console.error("Error during sign out:", error.message);
					});
			}
		} else {
			console.log("No user is currently logged in.");
		}
	}, [user]);

	const scrollLeft = () => {
		const scrollCont = catContRef.current;
		scrollCont.scrollTo({
			left: scrollCont.scrollLeft - scrollCont.clientWidth, //scrollCont.scrollLeft +,- value, scrollCont.scrollWidth
			behavior: "smooth"
		});
	}

	const scrollRight = () => {
		const scrollCont = catContRef.current;
		scrollCont.scrollTo({
			left: scrollCont.scrollLeft + scrollCont.clientWidth,
			behavior: "smooth"
		});
	}

	const handleScroll = () => {
		const scrollCont = dealContRef.current;
		const scrollValue = dealImgRef.current.clientWidth;
		const maxScrollLeft = scrollValue * 4;
		const minScrollLeft = 0;

		if (scrollCont.scrollLeft <= minScrollLeft) {
			scrollCont.scrollLeft = scrollValue * 3;
		}
		else if (scrollCont.scrollLeft >= maxScrollLeft) {
			scrollCont.scrollLeft = scrollValue;
		}

		const currentScroll = scrollCont.scrollLeft;

		const dot1 = document.getElementById("dot-1");
		const dot2 = document.getElementById("dot-2");
		const dot3 = document.getElementById("dot-3");

		if (currentScroll === scrollValue) {
			dot2.style.backgroundColor = "#595959";
			dot3.style.backgroundColor = "#595959";

			dot1.style.backgroundColor = "#000000";
		}
		else if (currentScroll === scrollValue * 2) {
			dot1.style.backgroundColor = "#595959";
			dot3.style.backgroundColor = "#595959";

			dot2.style.backgroundColor = "#000000";
		}
		else if (currentScroll === scrollValue * 3) {
			dot1.style.backgroundColor = "#595959";
			dot2.style.backgroundColor = "#595959";

			dot3.style.backgroundColor = "#000000";
		}
	};

	const scrollLeftDeal = () => {
		const scrollCont = dealContRef.current;
		const scrollValue = dealImgRef.current.clientWidth;

		console.log("Before: ", scrollCont.scrollLeft);

		scrollCont.scrollTo({
			left: scrollCont.scrollLeft - scrollValue,
			behavior: "smooth"
		});
		setTimeout(() => {
			console.log("After (delayed): ", scrollCont.scrollLeft);
		}, 800);
	}

	const scrollRightDeal = () => {
		if (isScrolling) return;

		setIsScrolling(true);

		const scrollCont = dealContRef.current;
		const scrollValue = dealImgRef.current.clientWidth;

		console.log("Before: ", scrollCont.scrollLeft);

		scrollCont.scrollTo({
			left: scrollCont.scrollLeft + scrollValue,
			behavior: "smooth"
		});
		setTimeout(() => {
			console.log("After (delayed): ", scrollCont.scrollLeft);
			setIsScrolling(false);
		}, 800);
	}

	return (
		<div className="home-container">
			<div className="navigation-bar">
				<div className="logo">FabLook</div>
				<div className="nav-links">
					<a href="#home">Home</a>
					<a href="#cart">Cart</a>
					<a onClick={LoginUser} ref={userNameRef}>{isLoggedIn ? userName : "Login"}</a>
					<a href="#profile">
						<img src={profileImageUrl || "/assets/OIP.jpeg"} alt="Profile" className="profile-img" onClick={() => setIsOpen(!isOpen)} referrerPolicy="no-referrer"/>
					</a>

					{isOpen &&
						<div className="userMenu" >
							<a href="#">Profile</a>
							<hr style={{ width: "100%", height: "1px", backgroundColor: "black", border: "none", margin: "5px 0" }} />
							<a href="#">Settings</a>
							<hr style={{ width: "100%", height: "1px", backgroundColor: "black", border: "none", margin: "4px 0" }} />
							<a onClick={Logout}>Logout</a>
						</div>
					}

				</div>
			</div>

			<div className="category-container">
				<div className="categories" ref={catContRef}>
					<a href="#category">
						<img src="/assets/categories/mens.png" alt="Men" className="category-img" />
						<p className="categoryName">Men</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/womens.png" alt="Women" className="category-img" />
						<p className="categoryName">Women</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/kids.png" alt="Kids" className="category-img" />
						<p className="categoryName">Kids</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/footwear.png" alt="Footwear" className="category-img" />
						<p className="categoryName">Footwear</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/luggage__bags.png" alt="Luggage & Bags" className="category-img" />
						<p className="categoryName">Luggage & Bags</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/jewellery.png" alt="Jewellery" className="category-img" />
						<p className="categoryName">Jewellery</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/watches.png" alt="Watches" className="category-img" />
						<p className="categoryName">Watches</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/beauty.png" alt="Beauty" className="category-img" />
						<p className="categoryName">Beauty</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/handbags.png" alt="Handbags" className="category-img" />
						<p className="categoryName">Handbags</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/eyewear.png" alt="eyewear" className="category-img" />
						<p className="categoryName">Eyewear</p>
					</a>
				</div>
				<button className="pre-category-btn" onClick={scrollLeft}>&lt;</button>
				<button className="next-category-btn" onClick={scrollRight}>&gt;</button>
			</div>

			<div className="deal-container">
				<div className="deals" ref={dealContRef} onScroll={handleScroll}>
					{/*  */}

					{/* Clone of last image */}
					<a href="#deal">
						<img src="/assets/deals/3.jpg" alt="Deal" className="deal-img" />
					</a>

					{/* Actual images */}
					<a href="#deal">
						<img src="/assets/deals/1.png" alt="Deal" className="deal-img" ref={dealImgRef} />
					</a>
					<a href="#deal">
						<img src="/assets/deals/2.jpg" alt="Deal" className="deal-img" />
					</a>
					<a href="#deal">
						<img src="/assets/deals/3.jpg" alt="Deal" className="deal-img" />
					</a>

					{/* Clone of first image */}
					<a href="#deal">
						<img src="/assets/deals/1.png" alt="Deal" className="deal-img" />
					</a>

				</div>
				<button className="pre-deal-btn" onClick={scrollLeftDeal}>&lt;</button>
				<button className="next-deal-btn" onClick={scrollRightDeal}>&gt;</button>
			</div>
			<div className="scrollDotContainer">
				<div className="scrollDot" id="dot-1"></div>
				<div className="scrollDot" id="dot-2"></div>
				<div className="scrollDot" id="dot-3"></div>
			</div>

		</div>
	);
};

export default Home;
