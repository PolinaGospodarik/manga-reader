import React, {useEffect, useState} from 'react';
import styles from "./Login.module.css"
import { useAppDispatch, useAppSelector } from "@/hooks";
import {login} from '@/redux/slice/users';
import {useNavigate} from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading, error, user } = useAppSelector((state) => state.users);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(login({ username, password }));
    };

    useEffect(() => {
        if(user){
            navigate("/")
        }
    }, [user, navigate]);

    return (
        <div className={`${styles.form}`}>
            <h2>Sign in to your account</h2>
            <form onSubmit={handleSubmit}>
                <div className={`${styles["form__login"]}`}>
                    <label className={`${styles["form__title"]}`}>Username or email</label>
                    <input
                        className={`${styles["form__text"]}`}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className={`${styles["form__password"]}`}>
                    <label className={`${styles["form__title"]}`}>Password</label>
                    <input
                        className={`${styles["form__text"]}`}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className={`${styles["form__button"]}`} type="submit" disabled={loading}>Sign in</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Login;
