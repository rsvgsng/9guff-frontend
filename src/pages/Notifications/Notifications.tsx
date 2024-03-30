import React from 'react'
import style from './Notifications.module.css'
import NavbarCompNoti from '../../components/Notifications/NavbarCompNoti'
import { useSelector } from 'react-redux'
import { NotiCommentCard } from '../../components/Notifications/NotiCard'
import { RootState } from '../../Features/store'
import { FaRegCommentAlt } from "react-icons/fa";
import { IoHeartSharp } from "react-icons/io5";

function Notifications() {
    let notiData: any = useSelector((state: RootState) => state?.factory?.notifications)
    const [activeTab, setActiveTab] = React.useState<string>('reactions')
    return (
        <React.Fragment>
            <div className={style.home__wrapper}>
                <NavbarCompNoti />
                <div className={style.noti__wrapper}>

                    <div className={style.tabs__reaction}>


                        <div className={style.tab__item}
                            onClick={() => setActiveTab('reactions')}
                            style={{
                                backgroundColor: activeTab === 'reactions' ? '#f0f0f0' : '#ffffff26',
                                color: activeTab === 'reactions' ? 'black' : '#fefefe96'
                            }}>
                            <h3>Reactions</h3>
                            <IoHeartSharp />
                        </div>
                        <div className={style.tab__item}
                            onClick={() => setActiveTab('comments')}

                            style={{
                                backgroundColor: activeTab === 'comments' ? '#f0f0f0' : '#ffffff26',
                                color: activeTab === 'comments' ? 'black' : '#fefefe96'
                            }}
                        >
                            <h3>Comments</h3>
                            <FaRegCommentAlt />
                        </div>

                    </div>
                    {
                        activeTab === 'reactions' ?
                            notiData?.data?.liked?.map((noti: any) => {
                                return <NotiCommentCard noti={noti} key={noti._id} />
                            })
                            :
                            notiData?.data?.commented?.

                                map((noti: any) => {
                                    return <NotiCommentCard noti={noti} key={noti._id} />
                                })
                    }


                </div>
            </div>

        </React.Fragment>
    )
}

export default Notifications