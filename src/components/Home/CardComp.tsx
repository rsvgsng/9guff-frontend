import React from 'react'
import style from './CardComp.module.css'
import { MdRemoveRedEye } from "react-icons/md";
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

                className={style.card__comp__text}>
                <div className={style.upper__meta}>
                    <div className={style.left__item}>
                        <div className={style.thumb__}>
                            <img src={apiRoute + '/storage/dp/' + post.user} />
                        </div>
                        <div className={style.name__user}>

                            <div className={style.name__main}>
                                <h4>{post.user}</h4>
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
                <div className={style.main__content}>
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

                            {moment(post.createdAt).fromNow()}
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
                background: "#0a364b"
            }}>

            <div className={style.upper__meta}>
                <div className={style.left__item}>
                    <div className={style.thumb__}>
                        <img src={apiRoute + '/storage/dp/' + post.user} />

                    </div>
                    <div className={style.name__user}>

                        <div className={style.name__main}>
                            <h4>{post.user}</h4>
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
            <div className={style.main__content}>
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
                        {moment(post.createdAt).fromNow()}

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
            <div className={style.card__comp__text} onClick={() => {
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
                                <h4>{post.user}</h4>
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
                <div className={style.main__content}>

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
                            {moment(post.createdAt).fromNow()}
                        </span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export { CardCompText, CardCompImage, CardCompAudio }