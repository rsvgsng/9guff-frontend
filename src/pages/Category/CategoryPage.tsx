import React from 'react'
import style from './CategoryPage.module.css'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'
import { categoryFormatter } from '../../utils/categoryFormatter.util'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCategoryData, setCategoryData } from '../../Features/mainSlice'
import { RootState } from '../../Features/store'
import PostCardSkeleton from '../../components/Skeletons/PostCardSkeleton'
import { CardCompAudio, CardCompImage, CardCompText } from '../../components/Home/CardComp'
import { IPostType } from '../Home/HomePage'
function CategoryPage() {
    let { id } = useParams<any>()
    let navigate = useNavigate()
    let cats: Array<string> = ['a_feeling', 'a_confusion', 'a_problem', 'a_pain', 'an_experience', 'a_habit', 'others']

    let catDatas = useSelector((e: RootState) => e.factory.categoryData)
    let dispatch = useDispatch<any>()
    const [data, setData] = React.useState<any>([])
    const [loading, setLoading] = React.useState<boolean>(true)
    React.useEffect(() => {
        if (!cats.includes(id as any)) {
            return navigate('/')
        }
        if (catDatas.find((e: any) => e.category === id)) {

            setData(catDatas.find((e: any) => e.category === id).data)
            return setLoading(false)
        } else {
            dispatch(fetchCategoryData(id)).then((e: any) => {
                let data = (e.payload.data);
                let category = id;
                dispatch(setCategoryData({ category, data }))
                setData(data)
                setLoading(false)
            })
        }
    }, [])

    return (
        <React.Fragment>
            <div className={style.cat__main}>
                <div className={style.nav__cat}>
                    <IoMdArrowRoundBack onClick={() => {
                        navigate(-1)
                    }} />
                    <span>{categoryFormatter(id)}</span>
                </div>

                {
                    loading ?
                        Array(5).fill(0).map((_, i) => <PostCardSkeleton key={i} />)
                        :

                        data.map((e: IPostType, i: number) => {
                            if (e.photoUrl) {
                                return <CardCompImage key={i} post={e} />
                            } else if (e.audioUrl) {
                                return <CardCompAudio key={i} post={e} />
                            } else {
                                return <CardCompText key={i} post={e} />
                            }
                        })



                }
            </div>
        </React.Fragment >
    )
}

export default CategoryPage