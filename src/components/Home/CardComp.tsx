import React from 'react'
import style from './CardComp.module.css'
import { MdOutlineSlowMotionVideo, MdRemoveRedEye } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { IoPlayCircleSharp } from "react-icons/io5";
import { IPostType } from '../../pages/Home/HomePage';
import { apiRoute } from '../../utils/apiRoute';
import moment from 'moment';
import { categoryFormatter } from '../../utils/categoryFormatter.util';
import { useNavigate } from 'react-router-dom';
import LoginModelWarning from './LoginModelWarning';
import { useDispatch, useSelector } from 'react-redux';
import { setWarning } from '../../Features/mainSlice';
import { RootState } from '../../Features/store';

function CardCompText({ post }: { post: IPostType }) {
    const navigate = useNavigate()
    const dispatch = useDispatch<any>()
    const isLogged = useSelector((state: RootState) => state.factory.isLoggedIn)
    return (
        <React.Fragment>
            <div
                onClick={() => {
                    isLogged ?
                        navigate('/c/' + post.postID) : dispatch(setWarning(true))

                }}
                className={style.card__comp__text}
                style={{
                    background: post.isAnonymous ? '#181817' : "transparent"
                }}

            >
                <div className={style.upper__meta}>
                    <div className={style.left__item}>
                        <div className={style.thumb__}>
                            <img src={apiRoute + '/storage/dp/' + post.user} />
                            <div className={style.category__}>
                                <span>{categoryFormatter(post.category)}</span>
                            </div>
                        </div>
                        <div className={style.name__user}>


                            <div className={style.category__}>
                                <span>{categoryFormatter(post.category)}</span>
                            </div>


                            <div className={style.name__main}>
                                <h4
                                    style={{
                                        color: post.isAnonymous ? '#03a9f4' : 'unset',
                                        textTransform: post.isAnonymous ? 'uppercase' : 'unset'

                                    }}
                                >{post.user}</h4>

                            </div>
                            <div className={style.posted__on}>
                                <span>{moment(post.createdAt).fromNow()}</span>
                            </div>

                        </div>
                    </div>
                    <div className={style.right__item}>
                        <MdRemoveRedEye />
                        <span>{post.views}</span>

                    </div>
                </div>

                <div className={style.main__content} style={{
                    padding: post.isNSFW ? '12px' : '0px',
                    borderRadius: post.isNSFW ? '10px' : '0px'
                }}>
                    {
                        post.isNSFW ?
                            <div className={style.nsfw__wrapper}>
                                <span>
                                    This post contains NSFW content
                                </span>
                                <br />

                            </div> : null
                    }


                    <div className={style.title__content}>
                        <h4>
                            {post.title}
                        </h4>
                    </div>
                    <div className={style.text__content}>
                        <p>
                            {post.content}
                        </p>
                    </div>
                </div>


                <div className={style.bottom__meta}>
                    <div className={style.left__bottom}>
                        <FaHeart />
                        <span>{post.reactionCount} {post.reactionCount > 1 ? "reactions" : "reaction"} </span>
                    </div>
                    <div className={style.right__bottom}>
                        <span>
                            {
                                post.disableComments ? "Comments disabled" : post.commentCount > 0 ? post.commentCount + " comments" : "No comments"
                            }
                        </span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}


function CardCompAudio({ post }: { post: IPostType }) {
    const navigate = useNavigate()
    const isLogged = useSelector((state: RootState) => state.factory.isLoggedIn)
    let dispatch = useDispatch<any>()
    return (

        <div
            onClick={() => {
                isLogged ?
                    navigate('/c/' + post.postID) : dispatch(setWarning(true))

            }}
            className={style.card__comp__text} style={{
                background:
                    post.isAnonymous ? "rgb(24 24 23)" :
                        post.isNSFW ? 'unset' : "#0a364b",

            }}>

            <div className={style.upper__meta}>
                <div className={style.left__item}>
                    <div className={style.thumb__}>
                        <img src={apiRoute + '/storage/dp/' + post.user} />

                    </div>
                    <div className={style.name__user}>

                        <div className={style.name__main}>
                            <h4
                                style={{
                                    color: post.isAnonymous ? '#03a9f4' : 'unset',
                                    textTransform: post.isAnonymous ? 'uppercase' : 'unset',


                                }}
                            >{post.user}</h4>
                        </div>
                        <div className={style.posted__on}>
                            <span>{moment(post.createdAt).fromNow()}</span>
                        </div>
                        <div className={style.category__}>
                            <span>{categoryFormatter(post.category)}</span>
                        </div>


                    </div>
                </div>
                <div className={style.right__item}>
                    <MdRemoveRedEye />
                    <span>{post.views}</span>

                </div>
            </div>
            <div className={style.main__content}
                style={{
                    padding: post.isNSFW ? '12px' : '0px',
                    borderRadius: post.isNSFW ? '10px' : '0px'
                }}
            >
                {
                    post.isNSFW ?
                        <div className={style.nsfw__wrapper}>
                            <span>
                                This post contains NSFW content
                            </span>
                            <br />

                        </div> : null
                }
                <div className={style.title__content}>
                    <h4>
                        {post.title}
                    </h4>
                </div>
                <div className={style.text__content}>
                    <p>
                        {post.content}
                    </p>
                </div>
                <div className={style.audio__component}>

                    <div className={style.pos__}>
                        <div id={style.play__btn}>
                            <IoPlayCircleSharp />
                            <span>Play Audio</span>
                        </div>
                    </div>

                </div>

            </div>
            <div className={style.bottom__meta}>
                <div className={style.left__bottom}>
                    <FaHeart />

                    <span>{post.reactionCount} {post.reactionCount > 1 ? "reactions" : "reaction"} </span>

                </div>
                <div className={style.right__bottom}>
                    <span>
                        {
                            post.disableComments ? "Comments disabled" : post.commentCount > 0 ? post.commentCount + " comments" : "No comments"
                        }
                    </span>
                </div>
            </div>
        </div>

    )
}


function CardCompVideo({ post }: { post: IPostType }) {
    const navigate = useNavigate()
    const isLogged = useSelector((state: RootState) => state.factory.isLoggedIn)
    let dispatch = useDispatch<any>()
    return (

        <div
            onClick={() => {
                isLogged ?
                    navigate('/c/' + post.postID) : dispatch(setWarning(true))

            }}
            className={style.card__comp__text} style={{
                background:
                    post.isAnonymous ? "rgb(24 24 23)" : post.videoUrl ? 'rgb(124 16 82 / 55%)' :
                        post.isNSFW ? 'unset' : "#0a364b",


            }}>

            <div className={style.upper__meta}>
                <div className={style.left__item}>
                    <div className={style.thumb__}>
                        <img src={apiRoute + '/storage/dp/' + post.user} />

                    </div>
                    <div className={style.name__user}>

                        <div className={style.name__main}>
                            <h4
                                style={{
                                    color: post.isAnonymous ? '#03a9f4' : 'unset',
                                    textTransform: post.isAnonymous ? 'uppercase' : 'unset',


                                }}
                            >{post.user}</h4>
                        </div>
                        <div className={style.posted__on}>
                            <span>{moment(post.createdAt).fromNow()}</span>
                        </div>
                        <div className={style.category__}>
                            <span>{categoryFormatter(post.category)}</span>
                        </div>


                    </div>
                </div>
                <div className={style.right__item}>
                    <MdRemoveRedEye />
                    <span>{post.views}</span>

                </div>
            </div>
            <div className={style.main__content}
                style={{
                    padding: post.isNSFW ? '12px' : '0px',
                    borderRadius: post.isNSFW ? '10px' : '0px'
                }}
            >
                {
                    post.isNSFW ?
                        <div className={style.nsfw__wrapper}>
                            <span>
                                This post contains NSFW content
                            </span>
                            <br />

                        </div> : null
                }
                <div className={style.title__content}>
                    <h4>
                        {post.title}
                    </h4>
                </div>
                <div className={style.text__content}>
                    <p>
                        {post.content}
                    </p>
                </div>
                <div className={style.audio__component}>

                    <div className={style.pos__}>
                        <div id={style.play__btn}>
                            <MdOutlineSlowMotionVideo />
                            <span>Play Video</span>
                        </div>
                    </div>

                </div>

            </div>
            <div className={style.bottom__meta}>
                <div className={style.left__bottom}>
                    <FaHeart />

                    <span>{post.reactionCount} {post.reactionCount > 1 ? "reactions" : "reaction"} </span>

                </div>
                <div className={style.right__bottom}>
                    <span>
                        {
                            post.disableComments ? "Comments disabled" : post.commentCount > 0 ? post.commentCount + " comments" : "No comments"
                        }
                    </span>
                </div>
            </div>
        </div>

    )
}

function CardCompImage({ post }: { post: IPostType }) {
    const isLogged = useSelector((state: RootState) => state.factory.isLoggedIn)
    const dispatch = useDispatch<any>()
    const navigate = useNavigate()
    return (
        <React.Fragment>
            <div className={style.card__comp__text}
                style={{
                    background: post.isAnonymous ? 'rgb(24, 24, 23)' : "transparent"
                }}
                onClick={() => {
                    isLogged ?
                        navigate('/c/' + post.postID) : dispatch(setWarning(true))

                }}>
                <div className={style.upper__meta}>
                    <div className={style.left__item}>
                        <div className={style.thumb__}>
                            <img src={apiRoute + '/storage/dp/' + post.user} />

                        </div>
                        <div className={style.name__user}>

                            <div className={style.name__main}>
                                <h4
                                    style={{
                                        color: post.isAnonymous ? '#03a9f4' : 'unset',

                                        textTransform: post.isAnonymous ? 'uppercase' : 'unset'
                                    }}

                                >{post.user}</h4>
                            </div>
                            <div className={style.posted__on}>
                                <span>{moment(post.createdAt).fromNow()}</span>
                            </div>
                            <div className={style.category__}>
                                <span>{categoryFormatter(post.category)}</span>
                            </div>
                        </div>
                    </div>
                    <div className={style.right__item}>
                        <MdRemoveRedEye />
                        <span>{post.views}</span>

                    </div>
                </div>
                <div className={style.main__content}
                    style={{
                        padding: post.isNSFW ? '12px' : '0px',
                        borderRadius: post.isNSFW ? '10px' : '0px'
                    }}
                >
                    {
                        post.isNSFW ?
                            <div className={style.nsfw__wrapper}>
                                <span>
                                    This post contains NSFW content
                                </span>
                                <br />

                            </div> : null
                    }

                    <div className={style.title__content}>
                        <h4>
                            {post.title}
                        </h4>
                    </div>
                    <div className={style.image__content}>
                        <img src={apiRoute + "/storage/" + post.photoUrl} alt="" />
                    </div>
                    <div className={style.text__content}>
                        <p>
                            {post.content}
                        </p>
                    </div>
                </div>
                <div className={style.bottom__meta}>
                    <div className={style.left__bottom}>
                        <FaHeart />
                        <span>{post.reactionCount} {post.reactionCount > 1 ? "reactions" : "reaction"} </span>
                    </div>
                    <div className={style.right__bottom}>
                        <span>
                            {
                                post.disableComments ? "Comments disabled" : post.commentCount > 0 ? post.commentCount + " comments" : "No comments"
                            }
                        </span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export { CardCompText, CardCompImage, CardCompAudio, CardCompVideo }