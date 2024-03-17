import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import PostPage from './pages/Post/PostPage'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Notifications from './pages/Notifications/Notifications'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import 'react-loading-skeleton/dist/skeleton.css'
import Profile from './pages/Profile/Profile'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, ping, setIsLoggedIn, setUserBanned, setUserName, setUserOnCooldown, setUserType } from './Features/mainSlice'
import LoginModelWarning from './components/Home/LoginModelWarning'
import CreatePost from './pages/CreatePost/CreatePost'
import { RootState } from './Features/store'
import UserPage from './pages/User/User'
import CategoryPage from './pages/Category/CategoryPage'
function App() {
  let dispatch = useDispatch<any>()
  const [loading, setLoading] = React.useState(true)
  let isLogged = useSelector((e: RootState) => e.factory.isLoggedIn)
  let isUserBanned = useSelector((state: RootState) => state.factory.isUserBanned)
  let isUserCooldown: any = useSelector((state: RootState) => state.factory.isUseronCooldown)

  React.useEffect(() => {
    dispatch(ping()).then((res: any) => {
      let payload = res.payload
      if (payload.code == 200) {
        dispatch(setUserName(payload.data['id']))
        dispatch(setIsLoggedIn(true))
        dispatch(setUserBanned(payload.data['userBan']))
        dispatch(setUserOnCooldown(payload.data['userCoolDown']))
        dispatch(setUserType(payload.data['userType']))
        dispatch(fetchNotifications())
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    )
  }, [])
  if (loading) return ''

  if (isLogged) {
    return (
      <React.Fragment>
        {
          isUserBanned ? <div className='notice____'>You are banned from using this platform</div> :
            isUserCooldown ? <div className='notice____'>You are on cooldown, you can't post or comment for the {
              Math.floor(isUserCooldown / 60000) + ' minutes'
            }</div> : null

        }
        <div className="versioning">
          <span>Confess24 (Alpha)</span>
        </div>
        <Toaster />
        <div className={`container`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="c/:id" element={<PostPage />} />
            <Route path="profile" element={<Profile />} />
            <Route path="u/:id" element={<UserPage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/cat/:id" element={<CategoryPage />} />
            <Route path="/cp/:id" element={<CreatePost />} />
            <Route path="*" element={<Navigate to={'/'} />} />

          </Routes>
        </div>
      </React.Fragment>

    )
  }
  return (
    <React.Fragment>
      <LoginModelWarning />
      <Toaster />

      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="c/:id" element={<PostPage />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to={'/'} />} />
        </Routes>
      </div>
    </React.Fragment>
  )
}

export default App
