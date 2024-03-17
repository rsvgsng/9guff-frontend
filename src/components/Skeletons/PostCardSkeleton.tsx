import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import style from './PostCardSkeleton.module.css'
import React from 'react'
import { MdRemoveRedEye } from 'react-icons/md'
import { FaHeart } from 'react-icons/fa'
function PostCardSkeleton() {
    return (
        <React.Fragment>
            <SkeletonTheme baseColor="white" highlightColor="#444">
                <div className={style.card__comp__text}>
                    <div className={style.upper__meta}>
                        <div className={style.left__item}>
                            <div className={style.thumb__} style={{ backgroundColor: 'white' }}>
                            </div>
                            <div className={style.name__user}>

                                <div className={style.name__main}>
                                    <h4>
                                        <Skeleton width={80} />
                                    </h4>
                                </div>
                                <div className={style.category__} style={{ padding: 0 }}>
                                    <Skeleton width={90} />
                                </div>
                            </div>
                        </div>
                        <div className={style.right__item}>
                            <MdRemoveRedEye />
                            <span>
                                <Skeleton width={70} />
                            </span>

                        </div>
                    </div>
                    <div className={style.main__content}>
                        <div className={style.title__content}>
                            <h4>
                                <Skeleton width={200} />
                            </h4>
                        </div>
                        <div className={style.text__content}>
                            <p>
                                <Skeleton count={5} />
                            </p>
                        </div>
                    </div>
                    <div className={style.bottom__meta}>
                        <div className={style.left__bottom}>
                            <FaHeart />
                            <span>
                                <Skeleton width={70} />
                            </span>
                        </div>
                        <div className={style.right__bottom}>
                            <span>
                                <Skeleton width={70} />
                            </span>
                        </div>
                    </div>
                </div>
            </SkeletonTheme>
        </React.Fragment>
    )
}

export default PostCardSkeleton