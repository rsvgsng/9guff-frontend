// Created on 3 Mar 2024 16:15
// rsvgsng
import style from './NavbarComp.module.css'
import { MdNotifications } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FaCircleUser } from "react-icons/fa6";
import { RiLoginCircleFill } from "react-icons/ri";
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Features/store';
import { IoChatboxSharp, IoChatbubblesOutline } from 'react-icons/io5';
import { BsChatSquareDots } from 'react-icons/bs';
import { setShowChat } from '../../Features/mainSlice';
function NavbarComp() {
    const navigate = useNavigate()
    const isLogged = useSelector((state: RootState) => state.factory.isLoggedIn)
    const notification: any = useSelector((state: RootState) => state?.factory?.notifications)
    let notiCount = notification?.data?.unseenNotiCount
    const dispatch = useDispatch()
    return (
        <React.Fragment>

            <div className={style.nav__main}>
                <div className={style.left__}>
                    <h5 style={{ fontWeight: 700 }}>CONFESS24 <small style={{ fontWeight: 400, fontSize: '12px', fontStyle: 'italic' }}>Beta</small></h5>
                </div>
                <div className={style.right__}>
                    {
                        isLogged ?
                            <React.Fragment>
                                <div className={style.noti__btn} onClick={() => dispatch(setShowChat(true))}>
                                    <IoChatbubblesOutline />
                                </div>
                                <div className={style.noti__btn} onClick={() => navigate('/notifications')}>
                                    {
                                        notiCount > 0 ? <div className={style.badge__noti}>{notiCount}</div> : null
                                    }

                                    <MdNotifications />
                                </div>
                                <div className={style.noti__btn} onClick={() => navigate('/profile')}>
                                    <FaCircleUser />
                                </div>

                            </React.Fragment>
                            :
                            <div className={style.login__btn} onClick={() => navigate('/auth/signup')}>
                                <span>Signup</span>
                                <RiLoginCircleFill />
                            </div>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default NavbarComp

