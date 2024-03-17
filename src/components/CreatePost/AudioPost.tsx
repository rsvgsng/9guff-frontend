import React, {useEffect, useState} from 'react'
import style from './AudioPost.module.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { categories } from './TextPost'
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AudioRecorder } from 'react-audio-voice-recorder';
import { VscDebugRestart } from "react-icons/vsc";
import toast from 'react-hot-toast'
import { apiRoute } from '../../utils/apiRoute'
import { FFmpeg } from '@ffmpeg/ffmpeg'
function AudioPost() {
    const [characters, setCharacters] = useState({title:0, content: 0})

    const [loading, setLoading] = useState(false)


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



    const [hasAudio, setHasAudio] = useState(false)
    const [audio, setAudio] = useState<Blob | any>(null)

    const addAudioElement = (blob: Blob) => {
        const url = URL.createObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        setAudio(blob)
        setHasAudio(true)
    };

    async function postAudio() {
        if (loading) return
        if (post.content.trim().length < 5) toast.error('Content should be atleast 5 characters long')
        if (post.category.trim().length < 1) toast.error('Please select a category')
        if (post.title.trim().length < 1) toast.error('Please enter a title')
        if (post.content.trim().length < 5 || post.category.trim().length < 1 || post.title.trim().length < 1) return
        if (!hasAudio) {
            toast.error('Please record an audio')
            return
        }
        let formData = new FormData()
        formData.append('title', post.title)
        formData.append('content', post.content)
        formData.append('category', post.category)
        formData.append('file', audio)
        setLoading(true)
        let res = await fetch(apiRoute + '/posts/newpost?posttype=audio', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        })
        let data = await res.json()
        if (data.error) {
            toast.error(data.message)
            setLoading(false)
        } else {
            window.location.href = '/'
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
                    <h3>Create a Audio post</h3>
                </div>
                <div className={style.body__main}>
                    <div className={style.title__input}>
                        <label htmlFor="">Title </label>
                        <input
                            onChange={(e) => {
                                setCharacters({...characters, title: e.target.value.length})
                                setPost({...post, title: e.target.value})
                            }}
                            type="text" placeholder="Title" />
                        <span>{100 - characters.title} characters remaining</span>
                    </div>
                    <div className={style.content__input}>
                        <label htmlFor="">Content*</label>
                        <textarea
                            onChange={(e) => {
                                setCharacters({...characters, content: e.target.value.length})
                                setPost({...post, content: e.target.value})
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
                                    return <option key={index} defaultChecked value={item.id}>{item.name}</option>
                                })
                            }
                        </select>

                    </div>

                    <div className={style.audio__section}>
                        <div className={style.lable__top}>
                            <label htmlFor="">{hasAudio ? "Play" : "Record"} your audio:    </label>
                            {
                                hasAudio ?
                                    <VscDebugRestart onClick={() => {
                                        setHasAudio(false)
                                        setAudio(null)
                                    }} />
                                    : null
                            }
                        </div>

                        {
                            hasAudio ?
                                <React.Fragment>
                                    <div className={style.audio__post__record} >
                                        <AudioPlayer
                                            autoPlay
                                            src={
                                                URL.createObjectURL(audio)
                                            }
                                            onPlay={e => console.log("onPlay")}

                                        />
                                    </div>
                                </React.Fragment>
                                :
                                <React.Fragment>
                                    <AudioRecorder
                                        onRecordingComplete={addAudioElement}
                                        showVisualizer={true}
                                        audioTrackConstraints={{
                                            echoCancellation: true,
                                            noiseSuppression: true,
                                            autoGainControl: true

                                        }}
                                    />
                                </React.Fragment>



                        }


                    </div>


                    <div className={style.post__btn}>
                        <button
                            style={{
                                backgroundColor: loading ? '#0ba37333' : '#0ba373',
                                color: loading ? '#ffffff91' : 'white'
                            }}
                            onClick={() => postAudio()}>{loading ? "Uploading...." : " POST IT!"}</button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default AudioPost