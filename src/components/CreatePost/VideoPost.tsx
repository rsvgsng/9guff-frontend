import React from 'react'
import style from './VideoPost.module.css'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { categories } from './TextPost'
import { BiVideoPlus } from 'react-icons/bi'
import { IoCloseCircle, IoCloseCircleSharp } from 'react-icons/io5'
import { fetchRetry } from '../../utils/retryFetch'
import { apiRoute } from '../../utils/apiRoute'
import toast from 'react-hot-toast'
function VideoPost() {
    const navigate = useNavigate()
    const [title, setTitle] = React.useState<string>('')
    const [content, setContent] = React.useState<string>('')
    const [category, setCategory] = React.useState<string>('')
    const [loading, setLoading] = React.useState<boolean>(false)
    const [characters, setCharacters] = React.useState({ title: 0, content: 0 })
    const [isAnonymous, setIsAnonymous] = React.useState<boolean>(false)
    const [video, setVideo] = React.useState<string | null>(null)
    const [file, setFile] = React.useState<File | any>(null)

    async function uploadVideo(file: any) {
        let videoReader = new FileReader()
        videoReader.readAsDataURL(file)
        videoReader.onload = function () {
            setVideo(videoReader.result as string)
            setFile(file)
        }
    }

    async function handlePost() {
        if (loading) return

        if (!video) {
            alert('Please select a video')
            return
        }
        if (!title.trim()) {
            alert('Please enter a title')
            return
        }
        if (!content.trim()) {
            alert('Please enter a content')
            return
        }
        if (content.length > 5000) {
            alert('Content should be less than 5000 characters')
            return
        }
        if (!category) {
            alert('Please select a category')
            return
        }
        setLoading(true)
        let formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('category', category)
        formData.append('file', file)
        formData.append('isAnonymous', isAnonymous.toString())

        let a = await fetchRetry(apiRoute + `/posts/newpost?posttype=video`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData
        })
        let b = await a.json()
        if (b.error) {
            toast.error(b.message)
            setLoading(false)
            return
        }
        setLoading(false)
    }

    return (
        <div className={style.main__wrapper}>

            <div className={style.nav__bar}>
                <IoMdArrowRoundBack onClick={() => navigate('/')} />
                <h3>Create a Video post</h3>
            </div>
            <div className={style.body__main}>
                <div className={style.title__input}>
                    <label htmlFor="">Title*</label>
                    <input
                        onChange={(e) => {
                            setCharacters({ ...characters, title: e.target.value.length })
                            setTitle(e.target.value)
                        }}
                        type="text" placeholder="Title" />
                    <span>{100 - characters.title} characters remaining</span>
                </div>

                <div className={style.image__input}>
                    <label htmlFor="">Video*</label>
                    {
                        video ?
                            <div className={style.temp__image_r}>
                                <div className={style.close__btn}>
                                    <IoCloseCircleSharp onClick={() => {
                                        setVideo(null)
                                    }} />
                                </div>
                                <video
                                    width={'100%'}
                                    height={'100%'}
                                    controls src={video} />
                            </div> :
                            <div className={style.video__input__wrapper} onClick={
                                () => {
                                    let input = document.createElement('input')
                                    input.type = 'file'
                                    input.accept = 'video/*'
                                    input.click()
                                    input.onchange = (e: any) => {
                                        let file = e.target.files[0]
                                        if (file.size > 10000000) {
                                            alert('File size should be less than 10mb')
                                            return
                                        }
                                        if (file.type.split('/')[0] !== 'video') {
                                            alert('Invalid file type')
                                            return
                                        }
                                        uploadVideo(file)
                                    }
                                }
                            }>
                                <div className={style.video__input}>
                                    <span>Upload Video</span>
                                    <BiVideoPlus />
                                </div>


                            </div>
                    }



                </div>


                <div className={style.content__input}>
                    <label htmlFor="">Description*</label>
                    <textarea
                        onChange={(e) => {
                            setCharacters({ ...characters, content: e.target.value.length })
                            setContent(e.target.value)
                        }}
                        placeholder="Content" rows={3} />
                    <span>{5000 - characters.content} characters remaining</span>
                </div>

                <div className={style.category__input}>
                    <label htmlFor="">Category*</label>
                    <select
                        onChange={(e) => setCategory(e.target.value)}
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
                        <input
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                            type="checkbox" name="" id="anon" />
                        <label htmlFor="anon">Post anonymously</label>
                    </div>
                    {/* 
                    <div className={style.content__check}>
                        <input
                            type="checkbox" name="" id="comment" />
                        <label htmlFor="comment">Disable Comments</label>
                    </div> */}


                </div>
                <div className={style.post__btn}>
                    <button
                        style={{
                            backgroundColor: loading ? '#0ba37333' : '#0ba373',
                            color: loading ? '#ffffff91' : 'white'
                        }}
                        onClick={() => { handlePost() }}
                    >{loading ? "Uploading...." : " POST IT!"}</button>
                </div>
            </div>
        </div>
    )
}

export default VideoPost