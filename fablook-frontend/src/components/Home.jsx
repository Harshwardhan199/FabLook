import React, { useState, useRef, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import useCurrentUser from "./currentUser";

import "./Home.css";

const Home = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [userMenuEnter, setUserMenuEnter] = useState(false);

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
			const response = await axios.post("https://fablook.onrender.com/api/users/userDataDB", {
				UID: user.uid
			}, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			let formattedName = response.data.name.split(" ")[0].charAt(0).toUpperCase() + response.data.name.split(" ")[0].slice(1).toLowerCase();

			setUserName(formattedName);
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

	const checkMouseEnterWhenLeavingAccountBtn = () => {

		if (userMenuEnter) {
			setIsOpen(true);
		}
		else {
			setIsOpen(false);
		}
	}

	return (
		<div className="home-container">
			{/* Navigation Bar */}
			<div className="navigation-bar">
				<div className="logo">FabLook</div>
				<div className="search-bar-container">
					<button className="category-Selector">Fablook Fashion ⏷</button>
					<input type="text" placeholder="Search Fablook.in" />
					<button className="search-btn">
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black" viewBox="0 0 16 16">
							<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.156a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
						</svg>

					</button>
				</div>
				<div className="nav-links">
					<div className="accounts-btn" onMouseEnter={() => setIsOpen(true)} onMouseLeave={checkMouseEnterWhenLeavingAccountBtn}>
						<img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/profile-52e0dc.svg" alt="Profile" className="profile-img" referrerPolicy="no-referrer" />
						<p>Account</p>
						<img src="https://img.icons8.com/?size=100&id=89230&format=png&color=ffffff" alt="Arrow icon" className="arrow-img" />
					</div>

					{isOpen &&
						<div className="userMenu" onMouseEnter={() => setUserMenuEnter(true)} onMouseLeave={() => { setUserMenuEnter(false); setIsOpen(false); }} >
							<a href="#">Profile</a>
							<hr style={{ width: "100%", height: "1px", backgroundColor: "black", border: "none", margin: "5px 0" }} />
							<a href="#">Settings</a>
							<hr style={{ width: "100%", height: "1px", backgroundColor: "black", border: "none", margin: "4px 0" }} />
							<a onClick={Logout}>Logout</a>
						</div>
					}

					<div className="cart-btn">
						<img src="https://img.icons8.com/?size=100&id=43866&format=png&color=FFFFFF" alt="Cart icon" />
						<p>Cart</p>
					</div>

				</div>
			</div>

			{/* Categories */}
			<div className="category-icon-container">
				<div className="categories" ref={catContRef}>
					<a href="#category">
						<img src="/assets/categories/mens.png" alt="Men" className="category-img" />
						<p className="category-icon-name">Men</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/womens.png" alt="Women" className="category-img" />
						<p className="category-icon-name">Women</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/kids.png" alt="Kids" className="category-img" />
						<p className="category-icon-name">Kids</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/footwear.png" alt="Footwear" className="category-img" />
						<p className="category-icon-name">Footwear</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/luggage__bags.png" alt="Luggage & Bags" className="category-img" />
						<p className="category-icon-name">Luggage & Bags</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/jewellery.png" alt="Jewellery" className="category-img" />
						<p className="category-icon-name">Jewellery</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/watches.png" alt="Watches" className="category-img" />
						<p className="category-icon-name">Watches</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/beauty.png" alt="Beauty" className="category-img" />
						<p className="category-icon-name">Beauty</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/handbags.png" alt="Handbags" className="category-img" />
						<p className="category-icon-name">Handbags</p>
					</a>
					<a href="#category">
						<img src="/assets/categories/eyewear.png" alt="eyewear" className="category-img" />
						<p className="category-icon-name">Eyewear</p>
					</a>
				</div>
				<button className="pre-category-btn" onClick={scrollLeft}>&lt;</button>
				<button className="next-category-btn" onClick={scrollRight}>&gt;</button>
			</div>

			{/* Best Deals */}
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

			{/* Important News */}
			<div className="sale">
				<img src="/assets/sale.jpg" alt="Deal" className="deal-img" />
			</div>

			{/* Category 1 */}
			<div className="category">
				<p className="category-title"><b>Shop Women</b></p>
				<div className="top-deals">
					<div className="deals">
						<a href="#deal">
							<img src="/assets/deals/3.jpg" alt="Deal" className="deal-img" />
						</a>
					</div>
				</div>
			</div>
			<div className="scrollDotContainer">
				<div className="scrollDot" id="dot-1"></div>
				<div className="scrollDot" id="dot-2"></div>
				<div className="scrollDot" id="dot-3"></div>
			</div>
			<div className="sub-category-container">
				<div className="sub-categories">
					<div className="sub-category">
						<img src="/assets/women.png" alt="" className="sub-category-img" />
					</div>
					<div className="sub-category">
						<img src="/assets/women.png" alt="" className="sub-category-img" />
					</div>
					<div className="sub-category">
						<img src="/assets/women.png" alt="" className="sub-category-img" />
					</div>
					<div className="sub-category">
						<img src="/assets/women.png" alt="" className="sub-category-img" />
					</div>
					<div className="sub-category">
						<img src="/assets/women.png" alt="" className="sub-category-img" />
					</div>
					<div className="sub-category">
						<img src="/assets/women.png" alt="" className="sub-category-img" />
					</div>
				</div>
			</div>

			{/* Category 2 */}
			<div className="category">
				<p className="category-title"><b>Shop Men</b></p>
				<div className="top-deals">
					<div className="deals">
						<a href="#deal">
							<img src="/assets/men1.jpg" alt="Deal" className="deal-img" />
						</a>
					</div>
				</div>
			</div>
			<div className="scrollDotContainer">
				<div className="scrollDot" id="dot-1"></div>
				<div className="scrollDot" id="dot-2"></div>
				<div className="scrollDot" id="dot-3"></div>
			</div>
			<div className="sub-category-container">
				<div className="sub-categories">
					<div className="sub-category">
						<img src="/assets/men.png" alt="" className="sub-category-img" />
					</div>
					<div className="sub-category">
						<img src="/assets/men.png" alt="" className="sub-category-img" />
					</div>
					<div className="sub-category">
						<img src="/assets/men.png" alt="" className="sub-category-img" />
					</div>
					<div className="sub-category">
						<img src="/assets/men.png" alt="" className="sub-category-img" />
					</div>
					<div className="sub-category">
						<img src="/assets/men.png" alt="" className="sub-category-img" />
					</div>
					<div className="sub-category">
						<img src="/assets/men.png" alt="" className="sub-category-img" />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
