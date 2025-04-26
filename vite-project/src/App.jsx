import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import CaptainLogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Start from './pages/Start'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
const App = () => {
  return (
   <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/login' element={<UserLogin/>}/>
    <Route path='/riding' element={<Riding />} />
    <Route path='/captain-riding' element={<CaptainRiding/>}/>
    <Route path='/signup' element={<UserSignup/>}/>
    <Route path='/captain-login' element={<CaptainLogin/>}/>
    <Route path='/captain-signup' element={<CaptainSignup/>}/>
    <Route path='/start' element={<UserProtectWrapper><Start/></UserProtectWrapper>}/>
    <Route path='/logout' element={<UserProtectWrapper><UserLogout/></UserProtectWrapper>}/>
    <Route path='/captain-home' element={<CaptainProtectWrapper><CaptainHome/></CaptainProtectWrapper>}/>
    <Route path='/captain-logout' element={<CaptainProtectWrapper><CaptainLogout/></CaptainProtectWrapper>}/>
   </Routes>
  )
}

export default App
