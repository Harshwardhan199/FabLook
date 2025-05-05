import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './components/Home.jsx';
import LoginForm from './components/Login.jsx';
import SignUpForm from './components/SignUp.jsx';
import Verification from "./components/verification.jsx";
import ForgetPasswordForm from './components/ForgetPassword.jsx'

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<LoginForm />} />
				<Route path="/signup" element={<SignUpForm />} />
				<Route path="/verification" element={<Verification />} />
				<Route path="/forgot-password" element={<ForgetPasswordForm />} />
			</Routes>
		</Router>
	);
}

export default App;