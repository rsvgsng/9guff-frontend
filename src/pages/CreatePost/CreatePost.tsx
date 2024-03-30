import React from 'react'
import { useParams } from 'react-router-dom'
import TextPost from '../../components/CreatePost/TextPost'
import ImagePost from '../../components/CreatePost/ImagePost'
import AudioPost from '../../components/CreatePost/AudioPost'
import VideoPost from '../../components/CreatePost/VideoPost'

function CreatePost() {

    let param = useParams()
    let postType = param.id as string
    const [loading, setLoading] = React.useState<boolean>(true)
    React.useEffect(() => {
        let posttypes: Array<string> = ['image', 'audio', 'text', 'video']
        if (!posttypes.includes(postType)) {
            window.location.href = '/'
        }
        return setLoading(false)
    }, [])

    if (loading) return null

    if (postType === 'text') {
        return <TextPost />
    }
    if (postType === 'image') {
        return <ImagePost />
    }
    if (postType === 'video') {
        return <VideoPost />
    }
    if (postType === 'audio') {
        return <AudioPost />
    }
}

export default CreatePost


