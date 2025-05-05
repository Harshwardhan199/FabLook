import React from "react";
import { Link } from "react-router-dom";
import "./Styles.css";

const ForgetPasswordForm = () => {
    return (
        <div className="lsf-container">
            <div className="login-container">
                <p className="login-text">Forgot Password ?</p>
                <p className="login-greeting">Please enter you’re email</p>
                <form className="form-container" action="">
                    <div className="input-container">
                        <input className="login-input" type="email" id="email" placeholder="Email" required />
                    </div>
                    <button className="login-button" type="submit">Reset Password</button>
                    <div className='do-not-text-container'>
                        <p className='do-not-text'>Don't have an account? <Link to="/signup">Sign up</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgetPasswordForm;
