import React from 'react'

const ConfirmRide = (props) => {
  return (
    <div>
    <button className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        console.log('Close clicked');
       props.setConfirmRidePanel(false)
       
    }}>
   <i className='text-3xl text-gray-200 ri-arrow-down-wide-line'></i>
   
   </button>
   <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>
   

   <div className='flex gap-2 justify-between flex-col items-center'>
   <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
    <div className='w-ful mt-5'>
        <div className='flex items-center gap-5 p-3 border-b-2'>
           <i className='ri-map-pin-2-fill'></i>
           <h3 className='text-lg font-medium'>562/11-A</h3>
           <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
        </div>
        <div className='flex items-center gap-5 p-3 border-b-2'>
           <i className='ri-map-pin-2-fill'></i>
           <h3 className='text-lg font-medium'>562/11-A</h3>
           <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
        </div>
        <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-currency-line"></i>
            <div>
                <h3 className='text-lg font-medium'>₹ {props.fare[ props.vehicleType ]}</h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
            </div>
        </div>
    </div>

   </div>
   <button onClick={() => {
                    props.setVehicleFound(true)
                    props.setConfirmRidePanel(false)
                    props.createRide()

    }} className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Confirm</button>

</div>
  )
}

export default ConfirmRide