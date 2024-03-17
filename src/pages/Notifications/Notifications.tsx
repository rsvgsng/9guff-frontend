import React from 'react'
import style from './Notifications.module.css'
import NavbarCompNoti from '../../components/Notifications/NavbarCompNoti'
import { useSelector } from 'react-redux'
import { NotiCommentCard } from '../../components/Notifications/NotiCard'
import { RootState } from '../../Features/store'
function Notifications() {
    let notiData: any = useSelector((state: RootState) => state?.factory?.notifications)
    return (
        <React.Fragment>
            <div className={style.home__wrapper}>
                <NavbarCompNoti />
                <div className={style.noti__wrapper}>
                    {
                        notiData?.data?.map((noti: any, index: number) => {
                            return <NotiCommentCard noti={noti} key={index} />
                        })
                    }

                </div>

            </div>

        </React.Fragment>
    )
}

export default Notifications