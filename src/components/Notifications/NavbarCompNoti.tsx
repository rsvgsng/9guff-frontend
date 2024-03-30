import React from 'react'
import style from './NavbarCompNoti.module.css'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { apiRoute } from '../../utils/apiRoute'
import { useDispatch } from 'react-redux'
import { fetchNotifications } from '../../Features/mainSlice'
import toast from 'react-hot-toast'

function NavbarCompNoti() {
  const dispatch = useDispatch<any>()

  async function markSeen() {
    let x = confirm('Mark all as read?')
    if (!x) return
    let p = await fetch(apiRoute + '/main/markAllAsRead', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    let data = await p.json()
    if (data.code == 200) {
      dispatch(fetchNotifications())
      toast.success('Marked all as read')
    }

  }

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
          </div>
        </div>
        <div className={style.right__item} onClick={markSeen}>
          <span>Mark all as read</span>
        </div>
      </div>

    </React.Fragment>
  )
}

export default NavbarCompNoti