import React from 'react'
import style from './LoginModelWarning.module.css'
import { useNavigate } from 'react-router-dom'
import { MdLock } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Features/store';
import { setWarning } from '../../Features/mainSlice';

function LoginModelWarning() {
    let navigate = useNavigate()
    let showModel = useSelector((state: RootState) => state.factory.showWarning)
    let dispatch = useDispatch<any>()
    if (!showModel) return null
    return (
        <React.Fragment>
            <div className={style.main__model__warining}>
                <div className={style.model__warning__content}>
                    <MdLock />
                    <div className={style.warning__text}>
                        <p>You need to login to view the content</p>
                        <button onClick={() => { navigate('auth/login'); dispatch(setWarning(false)) }}>Login</button>
                        <button onClick={() => { navigate('auth/signup'); dispatch(setWarning(false)) }}>Signup</button>
                    </div>
                </div>
            </div>


        </React.Fragment>
    )
}

export default LoginModelWarning