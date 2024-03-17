import React, { CSSProperties, useEffect, useState } from 'react'
import style from './Login.module.css'
import { useNavigate } from 'react-router-dom';
import { loginFunc } from '../../fetchers/Auth.fetcher';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, ping, setIsLoggedIn } from '../../Features/mainSlice';

interface ResponseLogin {
    status: string;
    data: {
        token: string;
    }
}

function Login() {
    const navigate = useNavigate()
    const genders = ['Ladies', 'Gentleman', 'Daju', 'Bhai', 'Dude', 'Bro', 'Sis', 'Babe', 'Boss', 'Chick'];
    const [currentGender, setCurrentGender] = useState(genders[0]);
    const [crediantials, setCrediantials] = useState<{ username: string, pincode: string, isLoading?: boolean }>({ username: '', pincode: '', isLoading: false })
    const dispatch = useDispatch<any>()

    useEffect(() => {
        const intervalId = setInterval(() => {
            changeTextWithFade();
        }, 3000);
        return () => clearInterval(intervalId);
    }, [currentGender]);

    const changeTextWithFade = () => {
        const genderTextElement:any = document.querySelector('.gender___lol') ;
        genderTextElement.style.opacity = 0;
        setTimeout(() => {
            setCurrentGender(getNextGender());
            genderTextElement.style.opacity = 1;
        }, 600); // Adjust the timeout based on the transition duration
    };

    const getNextGender = () => {
        const currentIndex = genders.indexOf(currentGender);
        const nextIndex = (currentIndex + 1) % genders.length;
        return genders[nextIndex];
    };
    async function handleLogin() {
        if (crediantials.isLoading) return
        if (crediantials.pincode.length <4 && crediantials.pincode.length > 10) return toast.error('Pincode must be greater than 3 and less than 10');
        if (crediantials.username === '' || crediantials.pincode === '') return

        setCrediantials({ ...crediantials, isLoading: true })
        toast.promise(loginFunc(crediantials.username, crediantials.pincode), {
            loading: 'Logging in...',
            success: (data: ResponseLogin) => {
                setCrediantials({ ...crediantials, isLoading: false })
                localStorage.setItem('token', data.data.token);
                window.location.reload();
                return 'Logged in successfully';
            },
            error: (err:any) => {
                setCrediantials({ ...crediantials, isLoading: false })
                return 'Invalid username or pincode';
            }
        });
    }

    return (
        <React.Fragment>
            <div className={style.section__}>
                <div className={style.top__section}>
                    <h2><span style={{ color: '#00ff6b' }}>CONFESS</span>24 </h2>

                    <div className={style.welcome__text}>
                        <p className={style.welcome__text__single} >Welcome,</p>
                        <p className="gender___lol">{currentGender}</p>
                        <p className={style.login__dex}>Login your account</p>
                    </div>
                </div>

                <div className={style.bottom__section}>
                    <label htmlFor="username">Username</label>
                    <input onChange={(e) => {
                        setCrediantials({ ...crediantials, username: e.target.value })
                    }} type="text" name='username' />

                    <label htmlFor="pincode">Pincode</label>
                    <input onChange={(e) => {
                        setCrediantials({ ...crediantials, pincode: e.target.value })
                    }} type="number" name='pincode' />
                    <div className={style.action__btn}>
                        <button style={{
                            backgroundColor: crediantials.isLoading ? '#0e926a45' : '#0E926A',
                            color: crediantials.isLoading ? '#ffffff5c' : '#ffffff'
                        }} onClick={handleLogin}>{crediantials.isLoading?"Processing...":"Login"}</button>
                    </div>
                </div>
                <div className={style.account__actioncl} onClick={() => navigate('/auth/signup')}>
                    <p>Don't have an account? <span>Sign up</span></p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Login
