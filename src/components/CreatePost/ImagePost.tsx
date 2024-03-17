import React, {useEffect, useState} from 'react'
import style from './ImagePost.module.css'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import { GrCloudUpload } from "react-icons/gr";
import { IoCloseCircleSharp } from "react-icons/io5";

import { categories } from './TextPost'
import toast from 'react-hot-toast';
import { apiRoute } from '../../utils/apiRoute';
import { fetchRetry } from '../../utils/retryFetch';
function ImagePost() {
    const navigate = useNavigate()
    const [image, setImage] = React.useState<string | null>(null)
    const [file, setFile] = React.useState<File | null>(null)
    const [title, setTitle] = React.useState<string>('')
    const [content, setContent] = React.useState<string>('')
    const [category, setCategory] = React.useState<string>('')
    const [loading, setLoading] = useState(false)
    const [characters, setCharacters] = useState({title:0, content: 0})

    async function handleUpload(e: any) {
        let imageReader = new FileReader()
        imageReader.readAsDataURL(e.target.files[0])
        imageReader.onload = function () {
            setImage(imageReader.result as string)
        }
        setFile(e.target.files[0])
    }

    async function handlePost() {
        if (loading) return

        if (!file) {
            toast.error('Please select an image')
            return
        }
        if (!file.type.includes('image')) {
            toast.error('Please select an image')
            return
        }
        if (file.size > 5000000) {
            toast.error('File size should be less than 5MB')
            return
        }
        if (!file.name.includes('.png') && !file.name.includes('.jpg') && !file.name.includes('.jpeg')) {
            toast.error('Please select a valid image')
            return
        }
        if (!title.trim()) {
            toast.error('Please enter a title')
            return
        }
        if (!content.trim()) {
            toast.error('Please enter a content')
            return
        }
        if (content.length > 5000) {
            toast.error('Content should be less than 5000 characters')
            return
        }
        if (content.length < 10) {
            toast.error('Content should be more than 10 characters')
            return
        }
        if (!category) {
            toast.error('Please select a category')
            return
        }
        let formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('category', category)
        formData.append('file', file)
        setLoading(true)
        let a = await fetchRetry(apiRoute + `/posts/newpost?posttype=image`, {
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
        return window.location.href = '/'
    }
    useEffect(() => {
        setCategory(categories[0].id)
    }, []);
    return (
        <div className={style.main__wrapper}>

            <div className={style.nav__bar}>
                <IoMdArrowRoundBack onClick={() => navigate('/')} />
                <h3>Create a image post</h3>
            </div>
            <div className={style.body__main}>
                <div className={style.title__input}>
                    <label htmlFor="">Title*</label>
                    <input
                        onChange={(e) => {
                            setCharacters({...characters, title: e.target.value.length})
                            setTitle(e.target.value)
                        }}
                        type="text" placeholder="Title" />
                    <span>{100-characters.title} characters remaining</span>
                </div>

                <div className={style.image__input}>
                    <label htmlFor="">Image*</label>

                    {
                        image ?
                            <div className={style.temp__image_r}>
                                <div className={style.close__btn}>
                                    <IoCloseCircleSharp onClick={() => setImage(null)} />
                                </div>
                                <img src={image} alt="image" />
                            </div>
                            :
                            <div className={style.upload__area} >
                                <div className={style.info__i}>
                                    <GrCloudUpload />
                                    <span>Click to upload</span>
                                </div>
                                <input type="file"
                                    accept="image/*"
                                    onChange={(e) => handleUpload(e)} />
                            </div>
                    }


                </div>


                <div className={style.content__input}>
                    <label htmlFor="">Description*</label>
                    <textarea
                        onChange={(e) => {
                            setCharacters({...characters, content: e.target.value.length})
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
                <div className={style.post__btn}>
                    <button
                        style={{
                            backgroundColor: loading ? '#0ba37333' : '#0ba373',
                            color: loading ? '#ffffff91' : 'white'
                        }}
                        onClick={handlePost}
                    >{loading ? "Uploading...." : " POST IT!"}</button>
                </div>
            </div>
        </div>
    )
}

export default ImagePost