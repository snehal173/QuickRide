import React, { useRef, useState,useContext, useEffect } from 'react';
import axios from 'axios'
import { useGSAP } from '@gsap/react';
import 'remixicon/fonts/remixicon.css';
import gsap from 'gsap';
import LocationPanel from '../components/LocationPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import WaitingForDriver from '../components/WaitingForDriver';
import LookingForDriver from '../components/LookingForDriver';
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';
import {  useNavigate } from 'react-router-dom';
const Start = () => {
  
 
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef=useRef(null);
  const confirmRidePanelRef=useRef(null);
  const vehicleFoundRef = useRef(null)
  const waitingForDriverRef=useRef(null)

  const [vehiclePanel,setVehiclePanel]=useState(false);
  const [confirmRidePanel,setConfirmRidePanel]=useState(false);
  const [vehicleFound,setVehicleFound]=useState(false);
  const [waitingForDriver,setWaitingForDriver]=useState(false);

  const [pickup,setPickup]=useState('');
  const [destination,setDestination]=useState('');
  const [pickupSuggestions,setPickupSuggestions]=useState([])
  const [destinationSuggestions,setDestinationSuggestions]=useState([])
  const [activeField,setActiveField]=useState(null);
  const [ fare, setFare ] = useState({})
  const [vehicleType,setVehicleType]=useState('');
  const [ride,setRide]=useState(null);
  const { socket } = useContext(SocketContext)
  const { user } = useContext(UserDataContext)
  const navigate=useNavigate();
  useEffect(() => {
    if (user) {
      socket.emit("join", { userType: "user", userId: user._id });
    }
  }, [user]);

  socket.on('ride-confirmed',ride=>{
    setVehicleFound(false)
    setWaitingForDriver(true)
    setRide(ride)
  })

  socket.on('ride-started',ride=>{
    console.log("ride")
    setWaitingForDriver(false)
    navigate('/riding',{state:{ride}})
  })

  const handlePickupChange=async(e)=>{
     setPickup(e.target.value)
     try{
       const response=await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,{
        params:{input:e.target.value},
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
       })
       setPickupSuggestions(response.data)
     }catch(error){
       console.log(error);
       console.error("Maps Suggestion Error:", error.response?.data || error.message);
     }
  }
  const handleDestinationChange=async(e)=>{
    setDestination(e.target.value)
    try{
      const response=await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,{
       params:{input:e.target.value},
       headers:{
         Authorization:`Bearer ${localStorage.getItem('token')}`
       }
      })
      setDestinationSuggestions(response.data)
    }catch(error){
      console.log(error);
      
    }
 }
  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '70%',
        padding: 24,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: '0%',
        padding: 24,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 0,
      });
    }
  }, [panelOpen]);
   
  useGSAP(function () {
    if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
            transform: 'translateY(0)'
        })
    } else {
        gsap.to(vehiclePanelRef.current, {
            transform: 'translateY(100%)'
        })
    }
}, [ vehiclePanel ])

useGSAP(function () {
  if (confirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
          transform: 'translateY(0)'
      })
  } else {
      gsap.to(confirmRidePanelRef.current, {
          transform: 'translateY(100%)'
      })
  }
}, [ confirmRidePanel ])

useGSAP(function () {
  if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
          transform: 'translateY(0)'
      })
  } else {
      gsap.to(vehicleFoundRef.current, {
          transform: 'translateY(100%)'
      })
  }
}, [ vehicleFound ])

useGSAP(function () {
  if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
          transform: 'translateY(0)'
      })
  } else {
      gsap.to(waitingForDriverRef.current, {
          transform: 'translateY(100%)'
      })
  }
}, [ waitingForDriver ])

async function findTrip() {
  setVehiclePanel(true)
  setPanelOpen(false)
  const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
    params: { pickup, destination },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  setFare(response.data)  
}

async function createRide(){
  try{
    const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`,{
      pickup,destination,vehicleType
    },{
      headers:{
        Authorization:`Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(response)
  }catch(error){
    console.error("🚨 Ride creation failed:", error.response?.data || error.message);
  }
}

  return (
    <div className='h-screen relative overflow-hidden'>
      <img
        className='w-16 absolute left-5 top-5'
        src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
        alt='logo'
      />
      <div className='h-screen w-screen'>
        {/* Temporary background image */}
        <img
          className='object-cover w-full h-full'
          src='https://miro.medium.com/v2/resize:fit:720/format:webp/0*gwMx05pqII5hbfmX.gif'
          alt='background'
        />
        <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
          <div className='h-[30%] p-6 bg-white relative'>
            <h5
              ref={panelCloseRef}
              onClick={() => {
                setPanelOpen(false);
              }}
              className='absolute opacity-0 right-6 top-6 text-2xl cursor-pointer transition-opacity duration-300'
            >
              <i className='ri-arrow-down-wide-line'></i>
            </h5>
            <h4 className='text-2xl font-semibold'>Find a trip</h4>
            <form className='relative py-3' onSubmit={submitHandler}>
              <div className='line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full'></div>
              <input
                type='text'
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField('pickup');
                }}
                value={pickup}
                onChange={handlePickupChange}
                className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
                placeholder='Add a pick-up location'
              />
              <input
                type='text'
                onClick={() => {
                  setPanelOpen(true);
                  setActiveField('destination');
                }}
                value={destination}
                onChange={handleDestinationChange}
                className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
                placeholder='Enter your destination'
              />
            </form>
            <button
              onClick={findTrip}
              className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
              Find Trip
            </button>
          </div>
          <div
            ref={panelRef}
            className='bg-white h-0 transition-all duration-500 overflow-hidden shadow-xl rounded-t-3xl'
          >
            <LocationPanel 
            setPickup={setPickup}
            setDestination={setDestination}
            suggestions={activeField==='pickup' ? pickupSuggestions : destinationSuggestions}
            setPanelOpen={setPanelOpen} 
            activeField={activeField}
            setVehiclePanel={setVehiclePanel}/>
          </div>
        </div>

        <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
          <VehiclePanel setVehicleType={setVehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel}  fare={fare} />
        </div>
 
        <div ref={confirmRidePanelRef}  className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
          <ConfirmRide
           createRide={createRide} 
           pickup={pickup}
           destination={destination}
           fare={fare}
           vehicleType={vehicleType}
          setConfirmRidePanel={setConfirmRidePanel} 
          setVehicleFound={setVehicleFound}
          />
        </div>

        <div ref={vehicleFoundRef}  className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
          <LookingForDriver 
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setVehicleFound={setVehicleFound}/>
          
        </div>
        
        <div ref={waitingForDriverRef}  className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
          <WaitingForDriver 
          ride={ride}
          setVehicleFound={setVehicleFound}
          waitingForDriver={waitingForDriver}
          setWaitingForDriver={setWaitingForDriver} />
          
        </div>

      </div>
    </div>
  );
};

export default Start;
