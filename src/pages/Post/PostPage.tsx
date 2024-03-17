/* 
Author: rsvgsng
Last updated : Sun 10 Mar 20:59
*/

import React, { CSSProperties, ReactNode, useRef, useState } from 'react'
import style from './PostPage.module.css'

// Emojis
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaHeart, FaShare } from "react-icons/fa";
import { MdRemoveRedEye } from 'react-icons/md';
import { IoMdCloseCircle } from "react-icons/io";
import { BsEmojiDizzyFill } from "react-icons/bs";
import { FaAngry } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { IconType } from 'react-icons';
import { FaSurprise } from "react-icons/fa";
import { FaFaceLaughSquint } from "react-icons/fa6";
import { FaFaceSadCry } from "react-icons/fa6";
import { useNavigate, useParams } from 'react-router-dom';
import { apiRoute } from '../../utils/apiRoute';
import { fetchRetry } from '../../utils/retryFetch';
import toast from 'react-hot-toast';
import { categoryFormatter } from '../../utils/categoryFormatter.util';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { ping, setWarning } from '../../Features/mainSlice';
import { RootState } from '../../Features/store';
import H5AudioPlayer from 'react-h5-audio-player';
import PostCardSkeleton from '../../components/Skeletons/PostCardSkeleton';

import { PiSpinner } from "react-icons/pi";



export let categories: Array<{ type: 'crazy' | 'love' | 'haha' | 'wow' | 'sad' | 'angry', emoji: IconType, color: CSSProperties['color'] }> = [
    {
        type: 'love',
        emoji: FaHeart,
        color: 'red'
    },
    {
        type: 'haha',
        emoji: FaFaceLaughSquint,
        color: '#ffc967'
    },
    {
        type: 'wow',
        emoji: FaSurprise,
        color: '#ffe410'
    },
    {
        type: 'crazy',
        emoji: BsEmojiDizzyFill,
        color: '#d6f514'
    },
    {
        type: 'sad',
        emoji: FaFaceSadCry,
        color: '#ffff24'
    },
    {
        type: "angry",
        emoji: FaAngry,
        color: '#ff7171'
    }

]

interface IPostType {
    data: IPost
    error: string
    code: number
}


interface IPost {
    audioLength: any
    _id: string
    title: string
    photoUrl: any
    audioUrl: any
    category: string
    postID: string
    isNSFW: boolean
    content: string
    user: string
    isVisible: boolean
    views: number
    createdAt: string
    reactionCount: number
}

interface IReactionType {
    data: {
        reactions: IReaction
    }
    error: string
    code: number
}

interface IReaction {
    crazy: number
    love: number
    haha: number
    wow: number
    sad: number
    angry: number
}


interface ICommentType {
    data:
    {
        comments: Array<IComment>
    }
    error: string
    code: number
}

interface IComment {
    user: string
    comment: string
    commentID: string
    _id: string
    createdAt: string
    replies: Array<{
        user: string
        comment: string
        _id: string
        createdAt: string
    }>
}



function playPopSound() {
    let audio = new Audio('/pop.mp3')
    audio.play()

}

function playEmojiPopSound() {
    let audio = new Audio('/emojipop.mp3')
    audio.play()
}

function PostPage() {
    const [trackHeight, setTrackHeight] = React.useState<string>('50px')
    const { id } = useParams<{ id: string }>()
    const [comment, setComment] = useState<{
        comment: string,
        isReply: boolean,
        replyId?: string
    }>({ comment: '', isReply: false })


    const navigate = useNavigate()
    let textboxRef = useRef<HTMLTextAreaElement>(null)

    const clearText = () => {
        if (textboxRef.current) {
            textboxRef.current.value = ''
        }
    }

    const [reply, setReply] = React.useState<{
        isActive: boolean,
        replyTo: string,
        showReply: boolean,
        comment?: string,
        type?: 'comment' | 'reply'
    }>({ isActive: false, replyTo: '', showReply: false })

    const [post, setPost] = useState<IPostType>();
    const [reactions, setReactions] = useState<IReactionType>();
    const [comments, setComments] = useState<ICommentType>();
    const [loading, setLoading] = useState<boolean>(true);
    const dispatch = useDispatch<any>()
    const isLoggedIn = useSelector((e: RootState) => e?.factory?.isLoggedIn)
    let isUserBanned = useSelector((e: RootState) => e?.factory?.isUserBanned)
    let isCooldown = useSelector((e: RootState) => e.factory?.isUseronCooldown);
    let userType = useSelector((e: RootState) => e.factory?.userType)

    const [commntpostingLoading, setCommentPostingLoading] = useState<boolean>(false)

    const [isNSFW, setIsNSFW] = useState<boolean>(false)

    async function getPost() {
        let p = await fetchRetry(apiRoute + `/posts/singlePost/${id}?type=post`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        let data: IPostType = await p.json()
        if (data.error) {
            toast.error("An error occured ")
            navigate('/')
            return

        }
        setPost(data)
        setLoading(false)
    }

    async function getReactions() {
        let p = await fetchRetry(apiRoute + `/posts/singlePost/${id}?type=reactions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        let data: IReactionType = await p.json()
        if (data.error) {
            return toast.error("An error occured ")
        }
        setReactions(data)
    }
    async function getComments() {
        let p = await fetchRetry(apiRoute + `/posts/singlePost/${id}?type=comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        let data: ICommentType = await p.json()
        if (data.error) {
            return toast.error("An error occured ")
        }
        setComments(data)
    }

    async function handleComment() {
        if (commntpostingLoading) return toast.error('Please wait')
        if (comment.comment.trim() === '') return toast.error('Comment cannot be empty')
        if (comment.isReply) {
            setCommentPostingLoading(true)
            let p = await fetchRetry(apiRoute + `/posts/comment/reply/${comment.replyId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    comment: comment.comment
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            })
            let data: any = await p.json()
            if (data.error) {
                return toast.error(data.message)
            }
            clearText()
            setTrackHeight('50px')
            playPopSound()
            setComment({
                ...comment,
                comment: ''
            })
            setReply({
                isActive: false,
                replyTo: '',
                showReply: false,
                comment: '',
            })
            getComments().then(() => {
                setCommentPostingLoading(false)
            })

        }
        else {

            setCommentPostingLoading(true)

            let p = await fetchRetry(apiRoute + `/posts/comment/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    comment: comment.comment
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            })
            let data: any = await p.json()
            if (data.error) {
                return toast.error(data.message)
            }
            clearText()
            setComment({
                ...comment,
                comment: ''
            })
            setReply({
                isActive: false,
                replyTo: '',
                showReply: false,
                comment: '',
            })
            playPopSound()

            setTrackHeight('50px')
            getComments().then(() => {
                setCommentPostingLoading(false)
            })

        }
    }

    React.useEffect(() => {
        if (isLoggedIn) {
            getPost()
            getReactions()
            getComments()
            dispatch(setWarning(false))
            return
        } else {
            dispatch(setWarning(true));
        }
    }, [isLoggedIn])

    async function handleLike(type: any) {
        playEmojiPopSound()
        let p = await fetchRetry(apiRoute + `/posts/reactPost/${id}/${type}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        let data: any = await p.json()
        if (data.error) {
            return toast.error("An error occured")
        }
        getReactions()
    }



    async function hidePost(type: 'hide' | 'delete' | 'isnsfw') {

        let x = confirm(`Are you sure you want to ${type} this post?`)
        if (!x) return
        let a = await fetch(apiRoute + `/posts/deletePost/${id}?action=${type}`, {
            method: 'DELETE',
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

    async function giveCooldown(type: 'ban' | 'cooldown') {
        let x = confirm(`Are you sure you want to ${type} this user?`)
        if (!x) return
        let a = await fetch(apiRoute + `/posts/coolDown/${post?.data.user}?action=${type}`, {
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




    return (
        <React.Fragment>
            <div className={style.nav__bar}>
                <div className={style.back__btn} onClick={() => navigate(-1)}>
                    <IoMdArrowRoundBack />
                </div>
                <div className="meta__info">
                    <span> {
                        loading ?
                            "fetching...." : categoryFormatter(post?.data.category)
                    }
                    </span>
                </div>
                <div className={style.share__btn}>
                    <FaShare />
                    <span>Share</span>
                </div>
            </div>

            {
                userType === 'Admin' ?
                    <React.Fragment>
                        <div className={style.admin__tools}>
                            <div className={style.admin__tool__item} onClick={() => hidePost('hide')}>
                                <span>Hide Post ({post?.data.isVisible ? "Not hidden" : "hidden"})</span>
                            </div>
                            <div className={style.admin__tool__item} onClick={() => hidePost('isnsfw')}>
                                <span>Censor Post ({post?.data.isNSFW ? "Chada Post" : "NORMAL POST"})</span>
                            </div>
                            <div className={style.admin__tool__item} onClick={() => hidePost('delete')}>
                                <span>Delete Post</span>
                            </div>
                            <div className={style.admin__tool__item} onClick={() => giveCooldown('cooldown')}>
                                <span>Give Cooldown (1 hr)</span>
                            </div>
                            <div className={style.admin__tool__item} onClick={() => giveCooldown('ban')}>
                                <span>Ban User</span>
                            </div>

                        </div>


                    </React.Fragment>

                    : null
            }




            <div className={style.main__content__wrapper}>

                {
                    loading ?
                        <PostCardSkeleton /> :
                        <div className={style.card__comp__text}>
                            <div className={style.upper__meta}>
                                <div className={style.left__item}
                                    onClick={() => {
                                        navigate('/u/' + post?.data.user)
                                    }}>
                                    <div className={style.thumb__}>
                                        <img src={apiRoute + '/storage/dp/' + post?.data.user} />

                                    </div>
                                    <div className={style.name__user}>
                                        <div className={style.name__main}>
                                            <h4>{post?.data.user}</h4>
                                        </div>
                                        <div className={style.category__}>
                                            <span>
                                                {moment(post?.data.createdAt).fromNow()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={style.right__item}>
                                    <MdRemoveRedEye />
                                    <span>{post?.data.views}</span>

                                </div>
                            </div>
                            <div className={style.main__content}>
                                {
                                    !isNSFW ?
                                        post?.data.isNSFW ?
                                            <div className={style.nsfw__wrapper} onClick={() => setIsNSFW(true)}>
                                                <span>
                                                    This post contains NSFW content.<br />Click to anywhere view at your own risk.
                                                </span>
                                                <br />
                                            </div> : null : null
                                }

                                <div className={style.title__content}>
                                    <h4>
                                        {post?.data.title}
                                    </h4>
                                </div>
                                {
                                    post?.data.photoUrl ? <div className={style.image__content}>
                                        <img src={apiRoute + "/storage/" + post?.data.photoUrl} alt="" />
                                    </div> : null
                                }
                                {
                                    post?.data.audioUrl ? (
                                        <div className={style.audio__content}>
                                            <H5AudioPlayer src={apiRoute + '/storage/' + post?.data.audioUrl} />

                                        </div>
                                    ) : null
                                }

                                <div className={style.text__content}
                                >

                                    {post?.data.content.split('\n').map((e, i) => {
                                        if (e.trim() === '') return <br key={i} />
                                        return (
                                            <React.Fragment key={i}>

                                                <p key={i}>{e}</p>
                                            </React.Fragment>
                                        )

                                    })}


                                </div>



                            </div>

                            <div className={style.bottom__meta}>
                                <div className={style.left__bottom}>
                                    <span> {post?.data.reactionCount} reactions</span>
                                </div>
                                <div className={style.right__bottom}>
                                    <span> {comments?.data.comments.length} comments</span>
                                </div>
                            </div>
                        </div>
                }



                {/* Reactions */}
                {
                    isUserBanned || isCooldown ? null :
                        <div className={style.reation__container}>
                            {

                                categories.map((_, i) => {
                                    return (
                                        <div className={style.reaction__item} onClick={() => handleLike(_.type)} key={i} >
                                            <_.emoji color={_.color} />
                                            <span>
                                                {reactions?.data.reactions[_.type]}
                                            </span>
                                        </div>
                                    )
                                })

                            }
                        </div>

                }

                {/* Comments */}
                <div
                    style={{
                        marginBottom: trackHeight === '50px' ?
                            '60px' : '230px'
                    }}
                    className={style.comment__section__container}>
                    {
                        comments?.data.comments
                            .sort((a, b) => {
                                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                            })
                            .map((e, i) => {
                                console.log(e)
                                return (
                                    <React.Fragment key={i}>
                                        <div className={style.Comment__item}>
                                            <div className={style.comment__item__main__container}>
                                                <div className={style.comment__item}>
                                                    <div className={style.left__comment__thumb}
                                                        onClick={() => {
                                                            navigate('/u/' + e.user)
                                                        }}
                                                    >
                                                        <img src={apiRoute + '/storage/dp/' + e.user} />

                                                    </div>

                                                </div>

                                                <div className={style.right___kera}>
                                                    <div className={style.right__comment__content}>
                                                        <div className={style.user__name__cmt}>
                                                            <h4 style={{ wordBreak: 'break-word' }}>{e.user} </h4>
                                                            <span className={style.side__time}>
                                                                {moment(e.createdAt).fromNow()}
                                                            </span>
                                                        </div>
                                                        <p className={style.comment__text}>
                                                            {e.comment}
                                                        </p>
                                                    </div>
                                                    {
                                                        e.replies.length > 0 ? (
                                                            <React.Fragment>
                                                                {
                                                                    e?.replies?.map((e, i) => {
                                                                        return (
                                                                            <React.Fragment>

                                                                                <div className={style.replies__comment}>
                                                                                    <div className={style.left__reply}

                                                                                        onClick={() => {
                                                                                            navigate('/u/' + e.user)
                                                                                        }}>
                                                                                        <img src={apiRoute + '/storage/dp/' + e.user} />
                                                                                    </div>
                                                                                    <div className={style.right__reply}>
                                                                                        <div className={style.comment__list}>
                                                                                            <span key={i} > <span style={{ fontWeight: 800, fontSize: '13px', marginRight: '5px' }}>{e.user}</span><span className={style.comment__text}> {e.comment} </span></span>
                                                                                        </div>
                                                                                        <div className={style.time__reply}>
                                                                                            <span>
                                                                                                {moment(e.createdAt).fromNow()}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </React.Fragment>
                                                                        )
                                                                    })
                                                                }
                                                            </React.Fragment>
                                                        )

                                                            : (
                                                                <span></span>
                                                            )
                                                    }
                                                </div>
                                            </div>
                                            {
                                                isUserBanned || isCooldown ? null :
                                                    <div className={style.reply__time}>
                                                        <span
                                                            onClick={() => {
                                                                setTrackHeight('200px')
                                                                setComment({
                                                                    ...comment,
                                                                    isReply: true,
                                                                    replyId: e._id
                                                                })
                                                                setReply({
                                                                    isActive: true,
                                                                    replyTo: e.user,
                                                                    showReply: true
                                                                });
                                                            }}
                                                            style={{
                                                                marginRight: '10px',
                                                                fontWeight: 'bold'
                                                            }}>Reply</span>
                                                    </div>
                                            }



                                        </div>

                                    </React.Fragment>
                                )
                            })
                    }


                </div>


            </div>

            {
                isUserBanned || isCooldown ? null :
                    <div
                        className={`${style.add__comment__section} container`} style={{
                            height: trackHeight
                        }}>
                        {
                            reply.isActive && (
                                <div className={style.reply__place__holder}>
                                    <span>Reply to : <span style={{ fontWeight: 800, margin: 0, paddingLeft: 1, color: '#00c7ff' }}>
                                        {reply.replyTo}
                                    </span></span>
                                    <IoMdCloseCircle onClick={() => {
                                        setComment({
                                            ...comment,
                                            isReply: false

                                        })
                                        setReply({
                                            isActive: false,
                                            replyTo: '',
                                            showReply: false
                                        })
                                    }} />
                                </div>
                            )
                        }

                        {
                            trackHeight === '200px' && !reply.isActive && (
                                <div className={style.close__btn__main}>
                                    <span>Add a comment</span>
                                    <IoMdCloseCircle onClick={() => {
                                        setTrackHeight('50px')
                                    }} />
                                </div>
                            )
                        }


                        <textarea
                            ref={textboxRef}
                            placeholder={reply.isActive ? `Reply to ${reply.replyTo}` : 'Add a comment'}
                            style={{
                                width: '100%',
                                transition: " 0.5s all ease-in-out",
                                color: 'white',
                                fontFamily: 'inherit',
                                paddingLeft: '10px',
                                border: 'none',
                                paddingTop: trackHeight === '200px' ? "50px" : '10px',
                                height: '100%',
                                backdropFilter: 'blur(10px)',
                                backgroundColor: 'rgb(0 ,0 ,0)',
                            }}
                            onClick={(e) => { setTrackHeight('200px'); }}
                            onChange={(e) => {
                                setComment({
                                    ...comment,
                                    comment: e.target.value,
                                    isReply: reply.isActive,
                                })

                            }}
                            name="" id="" className={style.input__cmt}></textarea>
                        {
                            commntpostingLoading ? <PiSpinner
                                className={style.spin}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    bottom: '12px',
                                    fontSize: '1.5rem',
                                    color: 'white'
                                }}

                            /> : <IoSend
                                onClick={() => {
                                    handleComment()
                                }}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    bottom: '12px',
                                    fontSize: '1.5rem',
                                    color: 'white'
                                }} />
                        }


                    </div>

            }


        </React.Fragment >
    )
}

export default PostPage