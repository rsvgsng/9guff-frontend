import React from 'react'
import style from './RecentActiveUsers.module.css'
import { useSelector } from 'react-redux'
import { RootState } from '../../Features/store'
import { apiRoute } from '../../utils/apiRoute'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
interface IUserType {
    username: string
    lastActive: string
    profileImageUrl: string
}


function RecentActiveUsers() {
    const recentActiveUsers: any = useSelector((state: RootState) => state?.factory?.recentUsersActiveData)
    let user: IUserType[] = recentActiveUsers?.data
    const isLogged = useSelector((state: RootState) => state?.factory?.isLoggedIn)
    if (!isLogged) return null
    if (user?.length < 1) return null

    const navigate = useNavigate()
    return (
        <React.Fragment>

            <div className={style.recent__users__wrapper}>
                <div className={style.users__list}>
                    {
                        user?.map((e, key) => {

                            return (
                                <div className={style.active__item} key={key} onClick={() => navigate('/u/' + e.username)}>
                                    <div className={style.image__profile} >

                                        <img src={apiRoute + '/storage/dp/' + e.username} />
                                        <div className={style.recent__active}>
                                            <span
                                                style={{
                                                    backgroundColor: moment(e.lastActive).fromNow(true)
                                                        === "a few seconds" ? "green" : "#752e15"
                                                }}
                                            >
                                                {
                                                    moment(e.lastActive).fromNow(true)
                                                        === "a few seconds" ? "Online" : moment(e.lastActive).fromNow(true)
                                                }
                                            </span>
                                        </div>

                                    </div>
                                    <div className={style.user__name}>
                                        <span>
                                            {e.username.length > 9 ? e.username.slice(0, 9) + '...' : e.username}
                                        </span>
                                    </div>

                                </div>
                            )
                        })
                    }

                </div>

            </div>
        </React.Fragment>

    )
}

export default RecentActiveUsers