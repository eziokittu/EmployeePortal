import React, { useState, useEffect } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';

function EmployeeOfTheMonth() {
  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-300 bg-slate-100 rounded-lg ">
        {/* Certificates Heading Section */}
        <div className="bg-white rounded-lg mb-4 text-center">
          <p>Employee Of The Month</p>
          <p>{`For the month of 'April'`}</p>
        </div>
      </div>
    </div>
  )
}

export default EmployeeOfTheMonth