import React from 'react'
import style from './CategoryComp.module.css'
import { apiRoute } from '../../utils/apiRoute'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../Features/store'
import { setWarning } from '../../Features/mainSlice'


function CategoryComp() {

    let navigate = useNavigate()
    let isLogged = useSelector((state: RootState) => state.factory.isLoggedIn)
    let dispatch = useDispatch()

    let cats: Array<{
        name: string,
        type: 'a_feeling' | 'a_confusion' | 'a_problem' | 'a_pain' | 'an_experience' | 'a_habit' | 'others',
        image: string
    }> = [
            {
                type: 'a_feeling',
                name: 'feeling',
                image: apiRoute + '/storage/feeling.png'
            },

            {
                type: 'a_confusion',
                name: 'confusion',
                image: apiRoute + '/storage/confusion.png'
            },
            {
                type: 'a_problem',
                name: 'problem',
                image: apiRoute + '/storage/problem.png'
            },
            {
                type: 'a_pain',
                name: 'pain',
                image: apiRoute + '/storage/pain.png'
            },
            {
                type: 'an_experience',
                name: 'experience',
                image: apiRoute + '/storage/experience.png'
            },
            {
                type: 'a_habit',
                name: 'habit',
                image: apiRoute + '/storage/habit.png'
            },
            {
                type: 'others',
                name: 'others',
                image: apiRoute + '/storage/others.png'
            }
        ]

    return (
        <React.Fragment>
            <div className={style.cat__main} >
                {
                    cats.map((_, i) => {
                        return (
                            <div className={style.cat__item} key={i} onClick={() => {
                                isLogged ?
                                    navigate('/cat/' + _.type) : dispatch(setWarning(true))
                            }}>
                                <div className={style.image__cat__item}>
                                    <img src={_.image} alt="" />
                                </div>
                                <div className={style.text__cat__item}>
                                    <h3>{_.name} </h3>
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </React.Fragment>
    )
}

export default CategoryComp