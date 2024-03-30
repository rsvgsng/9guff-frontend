import React from 'react'
import style from './NotiCard.module.css'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { apiRoute } from '../../utils/apiRoute'
import { useDispatch } from 'react-redux'
import { fetchNotifications } from '../../Features/mainSlice'
import toast from 'react-hot-toast'


interface NotiCardProps {
    _id: string
    NotificationType: string
    owner: string
    postID: string
    actionBy: ActionBy[]
    isSeen: boolean
    __v: number
}


export interface ActionBy {
    user: string
    action: string
    _id: string
    actionAt: string
}


function NotiCommentCard({ noti }: { noti: NotiCardProps }): React.JSX.Element {
    const dispatch = useDispatch<any>()

    async function markAsRead(id: string, isSeen: boolean) {
        if (isSeen) {
            return navigate('/c/' + noti.postID)
        }
        let p = await fetch(apiRoute + `/main/markAsRead/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        let data = await p.json()
        if (data.code == 200) {
            navigate('/c/' + noti.postID)
            return dispatch(fetchNotifications())
        }
        toast.error('Something went wrong!')

    }
    const navigate = useNavigate()
    return (
        <React.Fragment>
            <div
                style={{
                    backgroundColor: noti.isSeen ? 'unset' : '#4a4e5285',
                    border: noti.isSeen ? 'unset' : '1px solid #4a4e5285'

                }}
                className={style.noti__card__main} onClick={() => {
                    markAsRead(noti._id, noti.isSeen)
                }}>
                <div className={style.top__content}>
                    <div className={style.avatar__main}>
                        <img src={apiRoute + "/storage/dp/" + noti.actionBy[0].user} alt="" />
                    </div>
                    <div className={style.right__main__content}>
                        <span>
                            <strong>{noti.actionBy[0].user}</strong> {noti.actionBy[0].action} on your post
                        </span>
                    </div>
                </div>
                <div className={style.noti__meta}>
                    <span>
                        {moment(noti.actionBy[0].actionAt).fromNow()}
                    </span>
                </div>

            </div>
        </React.Fragment>
    )
}



export {
    NotiCommentCard
} 