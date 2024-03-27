import React, { useCallback, useEffect, useMemo, useState } from 'react'
import style from './TextPost.module.css'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { apiRoute } from '../../utils/apiRoute'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { addItem, setHasMore, setPage } from '../../Features/mainSlice'


export const categories = [
    {
        id: 'a_feeling',
        name: 'A Feeling'
    },
    {
        id: 'a_confusion',
        name: 'A Confusion'
    },
    {
        id: 'a_problem',
        name: 'A Problem'
    },
    {
        id: 'a_pain',
        name: 'A Pain'
    },
    {
        id: 'an_experience',
        name: 'An Experience'
    },
    {
        id: 'a_habit',
        name: 'A Habit'
    },
    {
        id: 'others',
        name: 'Others'
    }
]
function TextPost() {

    const dispatch = useDispatch<any>()
    const [loading, setLoading] = useState(false)
    const [characters, setCharacters] = useState({ title: 0, content: 0 })
    const navigate = useNavigate()
    const [post, setPost] = React.useState<{
        title: string,
        content: string,
        category: string
    }>({
        title: '',
        content: '',
        category: ''
    })
    async function postText() {
        if (loading) return

        if (post.title.length <= 0 && post.content.length <= 0) {
            return toast.error('Title and Content are required')
        }
        if (post.title.length > 100) {
            return toast.error('Title should not exceed 100 characters')
        }
        if (post.content.length > 5000) {
            return toast.error('Content should not exceed 5000 characters')
        }
        if (post.category.length <= 0) {
            return toast.error('Category is required')
        }
        setLoading(true)

        const a = await fetch(apiRoute + `/posts/newpost?posttype=text`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                title: post.title,
                content: post.content,
                category: post.category
            })
        })
        const b = await a.json()
        if (b.code === 200) {
            toast.success('Post created successfully')
            return window.location.href = '/'

        } else {
            toast.error(b.message)
            setLoading(false)

        }

    }
    useEffect(() => {
        setPost({ ...post, category: categories[0].id })
    }, []);

    return (
        <React.Fragment>
            <div className={style.main__wrapper}>

                <div className={style.nav__bar}>
                    <IoMdArrowRoundBack onClick={() => navigate('/')} />
                    <h3>Create a text post</h3>
                </div>
                <div className={style.body__main}>
                    <div className={style.title__input}>
                        <label htmlFor="">Title </label>
                        <input
                            onChange={(e) => {
                                setPost({ ...post, title: e.target.value });
                                setCharacters({ ...characters, title: e.target.value.length });
                            }}
                            type="text" placeholder="Title" />
                        <span>{100 - characters.title} characters remaining</span>
                    </div>
                    <div className={style.content__input}>
                        <label htmlFor="">Content*</label>
                        <textarea
                            onChange={(e) => {
                                setPost({ ...post, content: e.target.value });
                                setCharacters({ ...characters, content: e.target.value.length });
                            }}

                            placeholder="Content" rows={10} />


                        <span>{5000 - characters.content} characters remaining</span>
                    </div>
                    <div className={style.category__input}>
                        <label htmlFor="">Category*</label>
                        <select
                            onChange={(e) => setPost({ ...post, category: e.target.value })}
                            name="" id="">
                            {
                                categories.map((item, index) => {
                                    return <option key={index} value={item.id}>{item.name}</option>
                                })
                            }
                        </select>

                    </div>

                    <div className={style.content__check__wrapper}>
                        <label htmlFor="">Post options</label>

                        <div className={style.content__check}>
                            <input type="checkbox" name="" id="anon" />
                            <label htmlFor="anon">Post anonymously</label>
                        </div>

                        <div className={style.content__check}>
                            <input type="checkbox" name="" id="comment" />
                            <label htmlFor="comment">Disable Comments</label>
                        </div>


                    </div>
                    <div className={style.post__btn}>
                        <button
                            style={{
                                backgroundColor: loading ? '#0ba37333' : '#0ba373',
                                color: loading ? '#ffffff91' : 'white'
                            }}
                            onClick={() => postText()}>{
                                loading ? "Uploading...." : " POST IT!"}</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default TextPost