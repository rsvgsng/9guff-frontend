import React from 'react'
import style from './User.module.css'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import PostCardSkeleton from "../../components/Skeletons/PostCardSkeleton.tsx";
import { CardCompAudio, CardCompImage, CardCompText } from "../../components/Home/CardComp.tsx";
import { apiRoute } from '../../utils/apiRoute.ts';
import { IUserProfileData, IUserProfilePosts } from '../Profile/Profile.tsx';
import moment from 'moment';
function UserPage() {
    const navigate = useNavigate();
    let { id } = useParams()
    const [loading, setLoading] = React.useState(true)
    const [userProfileData, setUserProfileData] = React.useState<IUserProfileData>({
        code: 0,
        data: {
            joinedDate: 'Loading...',
            recentlyActive: '',
            totalPostCount: '',
            userName: ''
        },
        msg: ''
    })

    const [userPosts, setUserPosts] = React.useState<IUserProfilePosts>({
        code: 0,
        data: [],
        msg: ''
    })

    async function fetchProfilePageData() {
        let a = await fetch(apiRoute + `/main/user/${id}?type=details`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        let b: IUserProfileData = await a.json()
        setUserProfileData(b)
        setLoading(false)
    }

    async function fetchUserPosts() {
        setLoading(true)
        let a = await fetch(apiRoute + `/main/user/${id}?type=posts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        let b: IUserProfilePosts = await a.json()
        setUserPosts(b)
        setLoading(false)
    }

    React.useEffect(() => {
        fetchProfilePageData().then(() => {
            fetchUserPosts()
        })
    }, [id])

    return (
        <div className={style.body}>
            <div className={style.nav__bar}>
                <div className={style.back__btn} onClick={() => navigate(-1)}>
                    <IoMdArrowRoundBack />
                </div>
            </div>


            <div className={style.profile}>
                <div className={style.image__wrapper}>
                    <img className={style.profile__img}
                        src={apiRoute + `/storage/dp/` + `${userProfileData?.data?.userName}`}
                        alt="" />
                </div>
                <p className={style.profile__name}>
                    {userProfileData.data.userName}

                </p>

            </div>
            <div className={style.grid}>
                <div className={style.user__details}>
                    <p className={style.user__details__title}>Joined</p>
                    <p className={style.user__details__desc}>
                        {
                            moment(userProfileData?.data?.joinedDate).fromNow()
                        }
                    </p>
                </div>
                <div className={style.user__details}>
                    <p className={style.user__details__title}>Last active</p>
                    <p className={style.user__details__desc}>
                        {
                            moment(userProfileData?.data?.recentlyActive).fromNow() == 'a few seconds ago' ? 'Online' : moment(userProfileData?.data?.recentlyActive).fromNow()
                        }
                    </p>
                </div>
                <div className={style.user__details}>
                    <p className={style.user__details__title}>Posts</p>
                    <p className={style.user__details__desc}>
                        {
                            userProfileData?.data?.totalPostCount

                        }</p>
                </div>
            </div>
            <div>
                <div className={style.user__posts}>

                    {
                        loading ?
                            Array(5).fill(0).map((_, i) => <PostCardSkeleton key={i} />)
                            :
                            userPosts?.data?.map((post: any, i: number) => {
                                return (
                                    post.photoUrl ?
                                        <CardCompImage key={i} post={post} />
                                        :
                                        post.audioUrl ?
                                            <CardCompAudio key={i} post={post} />
                                            :
                                            <CardCompText key={i} post={post} />
                                )
                            })

                    }
                </div>
            </div>

        </div>
    )
}

export default UserPage