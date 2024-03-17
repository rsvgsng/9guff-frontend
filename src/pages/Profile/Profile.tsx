import React from 'react'
import style from './Profile.module.css'
import { IoMdArrowRoundBack } from 'react-icons/io';
import { MdUpload } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CardCompImage, CardCompAudio, CardCompText } from '../../components/Home/CardComp';
import PostCardSkeleton from '../../components/Skeletons/PostCardSkeleton';
import { apiRoute } from '../../utils/apiRoute';
import moment from 'moment';
import { IoLogOut } from "react-icons/io5";
import toast from 'react-hot-toast';
import { RootState } from '../../Features/store';
import { CgSpinnerTwoAlt } from "react-icons/cg";

export interface IUserProfileData {
    code: number,
    data: {
        joinedDate: string,
        recentlyActive: string,
        totalPostCount: string,
        userName: string
    },
    msg: string,
    error?: string
}

export interface IUserProfilePosts {
    code: number,
    data: Array<{
        _id: string
        title: string
        photoUrl: any
        audioLength: any
        audioUrl: any
        category: string
        reactionCount: number
        postID: string
        user: string
        views: number
        createdAt: string
        __v: number
    }>,
    msg: string,
    error?: string

}

function Profile() {
    const navigate = useNavigate();
    let userName = useSelector((state: RootState) => state?.factory?.userName)
    const [loading, setLoading] = React.useState(true)
    const [uploading, setUploading] = React.useState(false)
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

    function handleLogout() {
        let a = confirm('Are you sure you want to logout?')
        if (!a) return

        localStorage.removeItem('token')
        return window.location.href = '/'
    }
    async function fetchProfilePageData() {
        let a = await fetch(apiRoute + `/main/user/${userName}?type=details`, {
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

    async function handleUploadDP() {
        let fileInput = document.createElement('input')
        fileInput.type = 'file'
        fileInput.accept = 'image/*'
        fileInput.click()

        fileInput.onchange = async (e: any) => {
            let file = e.target.files[0]
            if (file.size > 2000000) {
                return toast.error('File size should not be greater than 2mb')
            }
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                return toast.error('Only jpeg and png files are allowed')
            }
            let formData = new FormData()
            formData.append('file', file)
            setUploading(true)

            let a = await fetch(apiRoute + `/main/changedp`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: formData
            })

            let b = await a.json()
            if (b.code === 200) {
                toast.success(b.msg)
                setUploading(false)
                window.location.reload()
            } else {
                toast.error(b.message)
                setUploading(false)
            }
        }
    }

    async function fetchUserPosts() {
        setLoading(true)
        let a = await fetch(apiRoute + `/main/user/${userName}?type=posts`, {
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
    }, [userName])
    return (
        <div className={style.body}>
            <div className={style.nav__bar}>
                <div className={style.back__btn} onClick={() => navigate(-1)}>
                    <IoMdArrowRoundBack />
                </div>
                <div
                    onClick={handleLogout}
                    className={style.logout__btn}>
                    <IoLogOut />
                </div>
            </div>


            <div className={style.profile}>
                <div className={style.image__wrapper} onClick={handleUploadDP}>
                    {
                        uploading &&
                        <div className={style.uploading__indicator}>
                            <CgSpinnerTwoAlt />
                        </div>
                    }

                    <img className={style.profile__img}
                        src={apiRoute + `/storage/dp/` + `${userProfileData.data.userName}`}
                        alt="" />
                    <div className={style.edit__btn__upload}>
                        <MdUpload />
                    </div>
                </div>
                <p className={style.profile__name}>
                    {userProfileData.data.userName}
                </p>

            </div>
            <div className={style.grid}>
                <div className={style.user__details}>
                    <p className={style.user__details__title}>Joined</p>
                    <p className={style.user__details__desc}>
                        {moment(userProfileData?.data?.joinedDate).fromNow()}
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
                    <p className={style.user__details__desc}>{
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

export default Profile