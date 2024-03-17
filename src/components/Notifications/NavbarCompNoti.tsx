import React from 'react'
import style from './NavbarCompNoti.module.css'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'

function NavbarCompNoti() {
  const navigate = useNavigate()
  return (
    <React.Fragment>
      <div className={style.nav__main}>
        <div className={style.left__item}>
          <div className={style.back__btn} onClick={() => navigate('/')}>
            <IoMdArrowRoundBack />
          </div>
          <div className={style.noti__text}>
            <h3>Notifications </h3>
            <small>contains bugs</small>
          </div>
        </div>
        <div className={style.right__item}>
          {/* <span>Mark all as read</span> */}
        </div>
      </div>
    </React.Fragment>
  )
}

export default NavbarCompNoti