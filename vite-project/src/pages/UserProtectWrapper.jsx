import React, { useState } from 'react'
import { useContext ,useEffect} from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const UserProtectWrapper = ({children}) => {
    const token=localStorage.getItem('userToken')
    const navigate=useNavigate();
    const {user,setUser}=useContext(UserDataContext)
    const [isLoading,setIsLoading]=useState(true)
    useEffect(()=>{
      if(!token){
        navigate('/login')
      }
      axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      }).then(response=>{
        if(response.status===200){
          setUser(response.data)
          setIsLoading(false)
        }
      })
      .catch(err=>{
        console.log(err)
        localStorage.removeItem('token')
        navigate('/login')
      })
    },[token])

    if(isLoading){
      return (
        <div>Loading..</div>
      )
    
    }
  return (
    <div>
        {children}
    </div>
  )
}

export default UserProtectWrapper
// On first load, it checks if there's a token → if not, redirects to /login.

// If later the token is updated (e.g., user logs out and token is removed from localStorage), this useEffect would re-run and kick the user out if needed.

