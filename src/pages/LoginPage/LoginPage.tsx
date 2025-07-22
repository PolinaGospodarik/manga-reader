import React from 'react';
import "./LoginPage.css"
import Login from "@/components/Login/Login"
import logoImg from "@/img/mangadex-logo.svg"
import logoText from "@/img/mangadex-wordmark-white.svg"
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };
    return (
        <>
            <div className="login">
                <div className="container">
                    <div className="login-wrapper">
                        <a href="#" className="logo" onClick={handleClick}>
                            <img src={logoImg} alt="img-logo"/>
                            <img src={logoText} alt="text-logo"/>
                        </a>
                        <Login></Login>
                        <span style={{ color: "white",  marginTop: "20px"}}>
                            username: Polinaaaa
                            password: Slojnijparol
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;