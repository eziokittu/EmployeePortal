import React from 'react'

const TerminationCard = ({ terminationData }) => {
  return (
    <div className="flex flex-col gap-0">
      <div className="text-sm grid grid-cols-12 gap-2 bg-white drop-shadow-lg rounded-lg p-2 mb-4 w-full">
        {/* Employee Name */}
        <button className='flex flex-col justify-center items-center col-span-2'>
          <h2 className="text-md font-normal text-black">{terminationData.firstname}</h2>
          <h2 className="text-md font-normal text-black">{terminationData.lastname}</h2>
        </button>
        {/* Employee Email */}
        <div className={`flex text-center justify-center items-center col-span-2`}>
          <p className=" text-black font-normal">{terminationData.email}</p>
        </div>
        {/* Employee ID */}
        <div className={`flex text-center justify-center items-center col-span-3`}>
          <p className=" text-black font-normal">{terminationData.ref}</p>
        </div>
        {/* Termination Reason */}
        <div className={`flex text-center justify-center items-center col-span-5`}>
          <p className=" text-black font-bold">
            {terminationData.terminationReason.length<=3 ? 'No Reason provided by ADMIN' : terminationData.terminationReason}
          </p>
        </div>
      </div>
    </div>
  )
}

export default TerminationCard