
import React, { useEffect, useRef, useState } from 'react'
import style from './Signup.module.css'
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
import { apiRoute } from '../../utils/apiRoute';
function Signup() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [pincode, setPincode] = useState('')
    const [clientToken, setClientToken] = useState('')
    const [loading,setLoading] =useState(false)
    async function handleVerificationSuccess() {

        if(loading) return
        if (!username || !pincode) return toast.error('Please fill all fields')
        if (!clientToken) return toast.error('Please verify you are not a robot')
        let htoken = clientToken
        setLoading(true)
        let a = await fetch(apiRoute + '/auth/signup', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                pincode,
                htoken
            })
        })
        let res = await a.json()
        if (res.error){
            setLoading(false)
            return toast.error(res.message)
        }
        setLoading(false)
        toast.success('Account created successfully')
        navigate('/auth/login')
    }

    return (
        <React.Fragment>
            <div className={style.section__}>
                <div className={style.top__section}>
                    <h2><span style={{ color: '#00ff6b' }}>CONFESS</span>24 </h2>
                    <div className={style.welcome__text}>
                        <p className={style.welcome__text__single} >Signup</p>
                        <p className={style.login__dex}>Create an account.</p>

                    </div>
                </div>

                <div className={style.bottom__section}>
                    <label htmlFor="username">Username (afno naam chai na halnu ni lol)</label>
                    <input
                        onChange={(e) => setUsername(e.target.value)}
                        type="text" name='username' />

                    <label htmlFor="pincode">Pincode</label>
                    <input
                        onChange={(e) => setPincode(e.target.value)}
                        type="number" name='pincode' />

                    <div className={style.captcha__}>
                        <HCaptcha
                            sitekey="a4f56182-aa2b-4eb9-acfa-25ee9fb2d6b5"
                            onVerify={(token, ekey) => setClientToken(token)}
                        />
                    </div>
                    <div className={style.action__btn}>
                        <button
                            style={{
                                backgroundColor:loading?'#0e926a47':'#0e926a'
                            }}

                            onClick={handleVerificationSuccess}>{loading?'Processing...':'Signup'}</button>
                    </div>
                </div>
                <div className={style.account__actioncl} onClick={() => navigate('/auth/login')}>
                    <p>Already have an account ? <span >Login</span></p>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Signup