import React from 'react'
import style from './User.module.css'
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import PostCardSkeleton from "../../components/Skeletons/PostCardSkeleton.tsx";
import { CardCompAudio, CardCompImage, CardCompText } from "../../components/Home/CardComp.tsx";
import { apiRoute } from '../../utils/apiRoute.ts';
import { IUserProfileData, IUserProfilePosts } from '../Profile/Profile.tsx';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { RootState } from '../../Features/store.ts';


function UserPage() {
    const navigate = useNavigate();
    let { id } = useParams()
    const [loading, setLoading] = React.useState(true)
    const [userProfileData, setUserProfileData] = React.useState<IUserProfileData>({
        code: 0,
        data: {
            joinedDate: 'Loading...',
            isUserBanned: false,
            recentlyActive: '',
            bio: '',
            totalPostCount: '',
            coverPic: '',
            isUserCoolDown: false,
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


    async function giveCooldown(type: 'ban' | 'cooldown') {
        let x = confirm(`Are you sure you want to ${type} this user?`)
        if (!x) return
        let a = await fetch(apiRoute + `/posts/coolDown/${id}?action=${type}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        let b = await a.json()
        if (b.error) {
            return toast.error(b.message)
        }
        toast.success(b.message)
    }

    async function removeCooldown() {
        let x = confirm('Are you sure you want to remove/give cooldown?')
        if (!x) return
        let a = await fetch(apiRoute + `/posts/removeCoolDown/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        let b = await a.json()
        if (b.error) {
            return toast.error(b.message)
        }
        toast.success(b.msg)
    }


    const isUserAdmin = useSelector((state: RootState) => state.factory.userType)

    React.useEffect(() => {
        fetchProfilePageData().then(() => {
            fetchUserPosts()
        })
    }, [id])

    return (
        <div className={style.body}>

            <div className={style.top__section__}>
                <div className={style.cover__pic}>
                    <img src={apiRoute + "/storage/cp/" + userProfileData.data.coverPic} alt="" />
                </div>

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

                        {
                            isUserAdmin === 'Admin' ?
                                <React.Fragment>
                                    <br />
                                    <br />
                                    <button
                                        onClick={() => giveCooldown('ban')}
                                    >{userProfileData.data.isUserBanned ? 'unban' : 'ban'} User?</button> <br /><br />
                                    <button
                                        onClick={() => giveCooldown('cooldown')}
                                    >Cooldown User?</button>
                                    <br />
                                    <br />
                                    <button
                                        onClick={() => removeCooldown()}
                                    >Remove Cooldown?</button>
                                </React.Fragment> : null
                        }



                    </p>
                    {
                        userProfileData.data.bio ?
                            <p className={style.bio__section}>
                                {userProfileData.data.bio}
                            </p> : null
                    }

                    {

                        userProfileData.data.isUserBanned ?
                            <p className={style.cool__down__msg}>The user is permanently banned! </p> :
                            userProfileData?.data?.isUserCoolDown ? <p className={style.cool__down__msg}>This user received cool down for {Math.floor(userProfileData?.data?.isUserCoolDown / 60000)} minutes</p> : null
                    }

                </div>

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