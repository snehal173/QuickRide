import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import axios from 'axios';
import {UserDataContext} from '../context/UserContext';
const UserSignup = () => {

  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const[firstName,setFirstName]=useState('');
  const[lastName,setLastName]=useState('');
 // const[userData,setUserData]=useState({});
  const navigate=useNavigate();
  const { user, setUser } = useContext(UserDataContext)
  const submitHandler=async(e)=>{
    e.preventDefault()
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }
    
    const response =await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`,newUser)
    if(response.status===200){
      const data=response.data
      setUser(data.user)
      localStorage.setItem('token',data.token);
    }

    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
    navigate('/start')
  }
  return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between'>
        <div>

          <form onSubmit={submitHandler}>
            <h3 className='text-lg w-1/2 font-medium mb-2'>What's your Name</h3>
            <div className='flex gap-4 mb-7'>
              <input 
              required 
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e)=>{
                setFirstName(e.target.value)
              }}
              />
              <input
               required 
               className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
               type="text"
               placeholder="Last Name"
               value={lastName}
               onChange={(e)=>{
                 setLastName(e.target.value)
               }}
               />

            </div>

            <h3 className='text-lg w-1/2 font-medium mb-2'>What's your email</h3>
            <input
            required
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            value={email}
            placeholder='Enter the email'
            onChange={(e)=>{
              setEmail(e.target.value)
            }}/>

            <h3 className='text-lg w-1/2 font-medium mb-2'>Enter Password</h3>
            <input
            required
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="password"
            value={password}
            placeholder='password'
            onChange={(e)=>{
              setPassword(e.target.value)
            }}/>

            <button  className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'>Create Account</button>
          </form>
          <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
        </div>
         <div>
         <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
         Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
         </div>
      </div>
    </div>
  )
}

export default UserSignup