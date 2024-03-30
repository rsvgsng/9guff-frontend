import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import PostPage from './pages/Post/PostPage'
import Login from './pages/Login/Login'
import Signup from './pages/Signup/Signup'
import Notifications from './pages/Notifications/Notifications'
import React from 'react'

import { CgSpinnerTwo } from "react-icons/cg";

import 'react-loading-skeleton/dist/skeleton.css'
import Profile from './pages/Profile/Profile'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNotifications, fetchRecentUsers, ping, setIsLoggedIn, setIsPremium, setShowChat, setUserBanned, setUserName, setUserOnCooldown, setUserType } from './Features/mainSlice'
import LoginModelWarning from './components/Home/LoginModelWarning'
import CreatePost from './pages/CreatePost/CreatePost'
import { RootState } from './Features/store'
import UserPage from './pages/User/User'
import CategoryPage from './pages/Category/CategoryPage'
import { Toaster } from 'react-hot-toast'
import { AiOutlineClose } from 'react-icons/ai'


let htmlString = `
  <style type="text/css">
 #yellbox { width: 100%; height: 100%; text-align: center; }
 #yellbox iframe { width: 100%; height: 90%; min-height: 200px; border: 1px solid #6297BC; margin: 0px; border-radius: 4px; padding: 10px 0px; }
 #yellbox button { height: 25px; }
 #saybutton { width: 100%;height:50px;margin-top:10px; padding: 5px; background-color: #6297BC; color: white; border: none; border-radius: 4px; cursor: pointer; }
 
  input[type=text] {
  border: none; /*1px solid #6297BC;*/
  border-radius: 4px;
  background-color: #F0F0F0;
  padding: 4px;
  margin: 2px 0px;
  box-sizing: border-box;
  width: 100%;
 }



 /* Popup container */
 .emoji-window {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  
  /* The actual popup (appears on top) */
  .emoji-window .emoji-window-content {
    visibility: hidden;
    width: 160px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 8px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -80px;
  }
  
  /* Popup arrow */
  .emoji-window .emoji-window-content::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }
  
  /* Toggle this class when clicking on the popup container (hide and show the popup) */
  .emoji-window .show {
    visibility: visible;
    -webkit-animation: fadeIn 1s;
    animation: fadeIn 1s
  }
  
  /* Add animation (fade in the popup) */
  @-webkit-keyframes fadeIn {
    from {opacity: 0;}
    to {opacity: 1;}
  }
  
  @keyframes fadeIn {
    from {opacity: 0;}
    to {opacity:1 ;}
  } 
</style>

  <iframe id="ybframe" name="ybframe" frameborder="0" allowtransparency="true" height="449px" src="https://yellbox.com/yellbox.php?name=kamal"></iframe>

  <form 
  action="https://yellbox.com/addmessage.php" method="post" target="ybframe" name="yellform" style="margin: 1px;" accept-charset="UTF-8"> 
  <input type="hidden" name="sub_username" value="kamal">
  <input style="display:none" type="text" name="sub_name" value="Anonymous" maxlength="15" onfocus="if(this.value == \'Name\')this.value = \'\';">
 
  <input
    style="
      height: 60px;
      width: 100%;
      border: none;
      background-color: #F0F0F0;
      padding: 4px;
      margin: 2px 0px;
    "
    placeholder="Type Message"
  type="text" name="sub_message" value="" maxlength="255" onfocus="if(this.value == 'Message')this.value = '';"><br>
  <button id="saybutton" onclick="set_cookie(); return clearMessageBox();">Send</button>	  

    <script>
   

function clear_message2() { document.yellform.sub_message.value=""; document.yellform.sub_message.focus(); }

function clearMessageBox() {
document.yellform.submit();
setTimeout("clear_message2()",200); return false;
}

function insertsmiley(smiley)
{
    if(document.yellform.sub_message.value == "Message") document.yellform.sub_message.value = " "+smiley+" ";
    else document.yellform.sub_message.value += " "+smiley+" ";
}
function reloadIframe() {
  var iframe = document.getElementById('ybframe');
  iframe.src = iframe.src; // Reload the iframe by setting its src attribute again
}
setInterval(reloadIframe, 4000);

</script>



</form>

  `


function App() {
  let dispatch = useDispatch<any>()
  const [loading, setLoading] = React.useState(true)
  let isLogged = useSelector((e: RootState) => e.factory.isLoggedIn)
  let isUserBanned = useSelector((state: RootState) => state.factory.isUserBanned)

  let isUserCooldown: any = useSelector((state: RootState) => state.factory.isUseronCooldown)
  let showChat = useSelector((state: RootState) => state.factory.showChat)
  React.useEffect(() => {
    dispatch(ping()).then((res: any) => {
      let payload = res.payload
      if (payload.code == 200) {
        dispatch(setUserName(payload.data['id']))
        dispatch(setIsLoggedIn(true))
        dispatch(setUserBanned(payload.data['userBan']))
        dispatch(setIsPremium(payload.data['userPremium']))
        dispatch(setUserOnCooldown(payload.data['userCoolDown']))
        dispatch(setUserType(payload.data['userType']))
        dispatch(fetchRecentUsers())
        dispatch(fetchNotifications())
        setLoading(false)
        setInterval(() => {
          dispatch(fetchRecentUsers())
          dispatch(fetchNotifications())
        }, 40000)
      } else {
        setLoading(false)
      }
    }
    )
  }, [])
  if (loading) return (
    // hot toast loading spinner
    <div className="auth__spinner">
      <CgSpinnerTwo className="spinner" />
      <span>
        Authenticating Session... Hold on
      </span>
    </div>
  )

  if (isLogged) {
    return (
      <React.Fragment>

        <Toaster />
        <div className={`popup_shoutbox ${showChat ? 'visible' : 'invisible'}`}>
          <div className={`container`}>
            <div className={`shoutbox__header`}>
              <p>Live Chat</p>
              <div onClick={() => {
                dispatch(setShowChat(false))
              }}>
                <AiOutlineClose size={`1.3em`} />
              </div>

            </div>
            <div className="shoutbox__iframe"
              dangerouslySetInnerHTML={{ __html: htmlString }}
            />
          </div>
        </div>
        {
          isUserBanned ? <div className='notice____'>You are banned from using this platform</div> :
            isUserCooldown ? <div className='notice____'>You are on cooldown, you can't post or comment for the {
              Math.floor(isUserCooldown / 60000) + ' minutes'
            }</div> : null

        }
        <div className="versioning">
          <span>Confess24 (Beta)</span>
        </div>
        <Toaster />

        <div className={`container`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/terms" element={<Terms />} />
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
          <Route path="/terms" element={<Terms />} />
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


function Terms() {
  return (
    <React.Fragment>
      <div className="main__terms">
        <h1>Terms and Conditions for Confess24</h1>
        <p>Welcome to Confess24, a platform designed to enable users to post content anonymously. Before using our services, please read and understand the following terms and conditions:</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By using Confess24, you agree to abide by these terms and conditions. If you do not agree with any part of these terms, you may not use our services.</p>

        <h2>2. Anonymous Posting</h2>
        <p>Confess24 allows users to post content anonymously. Users must refrain from disclosing personally identifiable information about themselves or others. Do not mention someone's name or any other identifying information in your posts.</p>

        <h2>3. Prohibited Content</h2>
        <ol>
          <li>Contains explicit pornography or sexually explicit material.</li>
          <li>Infringes upon the copyrights, trademarks, or intellectual property rights of others.</li>
          <li>Promotes or facilitates piracy, including but not limited to sharing pirated software, movies, music, or any other copyrighted material.</li>
          <li>Encourages or promotes illegal activities.</li>
          <li>Contains hate speech, discriminatory remarks, or incites violence against individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or any other characteristic.</li>
          <li>Defames, harasses, or threatens individuals or groups.</li>
        </ol>

        <h2>4. Responsible Posting</h2>
        <p>Users are responsible for the content they post on Confess24. Any content posted is the sole responsibility of the user, and Confess24 does not endorse or guarantee the accuracy, completeness, or reliability of any content posted by users.</p>

        <h2>5. Moderation and Removal of Content</h2>
        <p>Confess24 reserves the right to moderate, remove, or edit any content that violates these terms and conditions or is deemed inappropriate at our discretion. We may suspend or terminate the accounts of users who repeatedly violate these terms.</p>

        <h2>6. Intellectual Property</h2>
        <p>Users retain ownership of the content they post on Confess24. By posting content, users grant Confess24 a non-exclusive, royalty-free, perpetual, and worldwide license to use, reproduce, modify, adapt, publish, translate, distribute, and display the content in connection with the operation of the Confess24 platform.</p>

        <h2>7. Privacy</h2>
        <p>Confess24 respects user privacy. We collect and process personal data in accordance with our Privacy Policy. By using Confess24, you consent to the collection and use of your personal data as described in the Privacy Policy.</p>

        <h2>8. Limitation of Liability</h2>
        <p>Confess24 shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of Confess24, including but not limited to lost profits, loss of data, or loss of goodwill.</p>

        <h2>9. Changes to Terms</h2>
        <p>Confess24 reserves the right to update or modify these terms and conditions at any time without prior notice. It is your responsibility to review these terms periodically for any changes. Your continued use of Confess24 after any modifications indicates your acceptance of the updated terms.</p>

        <p>By using Confess24, you agree to comply with these terms and conditions.</p>

        <p>Last updated: Sun 17 March 2024</p>
      </div>
    </React.Fragment >

  )
}
