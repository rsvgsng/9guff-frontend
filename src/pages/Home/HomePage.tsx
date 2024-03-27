import style from './HomePage.module.css'
import NavbarComp from "../../components/Home/NavbarComp"
import CategoryComp from "../../components/Home/CategoryComp"
import { CardCompAudio, CardCompImage, CardCompText } from "../../components/Home/CardComp"
import PostCardSkeleton from '../../components/Skeletons/PostCardSkeleton'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Features/store'
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { IoIosCreate } from "react-icons/io";
import { MdOutlineTextFields } from "react-icons/md";
import { FaImages } from "react-icons/fa";
import { AiTwotoneAudio } from "react-icons/ai";
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import { fetchRetry } from '../../utils/retryFetch'
import { apiRoute } from '../../utils/apiRoute'
import React, { useEffect } from 'react'
import { addItem, setHasMore, setHomeItemsLoading, setPage } from '../../Features/mainSlice'
import RecentActiveUsers from '../../components/Home/RecentActiveUsers'

export interface IPostType {
    _id: string
    title: string
    photoUrl: any
    commentCount: number
    audioUrl: any
    category: string
    postID: string
    isAnonymous: boolean
    isNSFW: boolean
    reactionCount: number
    disableComments: boolean
    audioLength: string
    content: string
    user: string
    views: number
    createdAt: string
    __v: number
}

function HomePage() {
    let isLoggedIn = useSelector((state: RootState) => state.factory.isLoggedIn)
    let navigate = useNavigate()
    const dispatch = useDispatch<any>()
    let items = useSelector((e: RootState) => e.factory.items);
    let hasMore = useSelector((e: RootState) => e.factory.hasMore);
    let page = useSelector((e: RootState) => e.factory.page);
    let loading = useSelector((e: RootState) => e.factory.homeItemsLoading);
    let isUserBanned = useSelector((e: RootState) => e.factory.isUserBanned);
    let isCooldown = useSelector((e: RootState) => e.factory.isUseronCooldown);



    async function fetchData() {
        if (hasMore === false) return
        if (page > 1) {
            dispatch(setHomeItemsLoading(false))
        } else {
            dispatch(setHomeItemsLoading(true))
        }
        const response = await fetchRetry(`${apiRoute}/posts/feed?page=${page}&limit=${10}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });
        const data = await response.json();
        if (data?.data?.posts?.length === 0) {
            dispatch(setHasMore(false))
        }
        dispatch(addItem(data?.data?.posts))
        dispatch(setPage(page + 1));
        dispatch(setHomeItemsLoading(false))
    }



    React.useEffect(() => {
        fetchData()
    }, [])

    return (
        <React.Fragment>
            {
                isLoggedIn ?
                    isUserBanned || isCooldown ? null :
                        <Fab
                            mainButtonStyles={{ backgroundColor: "#f50057" }}
                            icon={<IoIosCreate />}
                            event="click"
                        >
                            <Action
                                text="Create Text Post"
                                onClick={() => {

                                    navigate("/cp/text")
                                }}
                            >
                                <MdOutlineTextFields />
                            </Action>
                            <Action
                                text="Create Image Post"
                                onClick={() => {
                                    navigate("/cp/image")
                                }}
                            >
                                <FaImages />
                            </Action>

                            <Action
                                text="Create Audio Post"
                                onClick={() => {
                                    navigate("/cp/audio")
                                }}
                            >
                                <AiTwotoneAudio />
                            </Action>
                        </Fab> : null
            }
            <NavbarComp />

            <div className={style.home__wrapper}>
                <CategoryComp />
                <RecentActiveUsers />
                {
                    loading ?
                        Array(5).fill(0).map((_, i) => <PostCardSkeleton key={i} />)
                        :

                        <div className={style.post__home__wrapper}>

                            <InfiniteScroll
                                dataLength={items.length}
                                next={() => {
                                    dispatch(setPage(page + 1))
                                    fetchData()
                                }}
                                hasMore={hasMore}
                                loader={<h4>Loading...</h4>}
                            >
                                {
                                    items.map((e: IPostType, i: number) => {
                                        if (e.photoUrl) {
                                            return <CardCompImage key={i} post={e} />
                                        } else if (e.audioUrl) {
                                            return <CardCompAudio key={i} post={e} />
                                        } else {
                                            return <CardCompText key={i} post={e} />
                                        }
                                    })
                                }
                            </InfiniteScroll>
                        </div>

                }


            </div>
        </React.Fragment>

    )
}

export default HomePage