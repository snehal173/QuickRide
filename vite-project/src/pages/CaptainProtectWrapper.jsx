import React, { useState } from 'react'
import { useContext ,useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'


const CaptainProtectWrapper = ({children}) => {
    const token=localStorage.getItem('captainToken')
    console.log("the captain token",token);
    const navigate=useNavigate();
    const {captain,setCaptain}=useContext(CaptainDataContext)
    const [isLoading,setIsLoading]=useState(true)
   
    useEffect(() => {
        if (!token) {
            navigate('/captain-login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setCaptain(response.data)
                setIsLoading(false)
            }
        })
            .catch(err => {

                localStorage.removeItem('token')
                navigate('/captain-login')
            })
    }, [ token ])


    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }


  return (
    <div>
        {children}
    </div>
  )
}

export default CaptainProtectWrapper

