import React, { useEffect, useState } from 'react';
import {useHttpClient} from '../Backend/hooks/http-hook';

function TerminationItem({item}) {
  const { sendRequest } = useHttpClient();

  // Fetches all the emkployee details for that termination Item
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/users/emp/${item.employee.toString()}`
        );
        setUserData(responseData.employee);
      } catch (err) {
        console.log("Error in fetching all employee details: "+err);
      }
    };
    fetchEmployee();
  }, []);

  // Function to approve employee for termination
  const ApproveTerminationHandler = async event => {
		event.preventDefault();
		try {
			const responseData = await sendRequest(
				import.meta.env.VITE_BACKEND_URL+`/terminations/approve`,
				'PATCH',
				JSON.stringify({
					terminationId: item.id,
          userId: item.employee
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      console.log("Approved employee for termination");

      // Refreshes the page after 1 second
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
      
		} catch (err) {
			console.log('ERROR approving termination for employee!');
		}   
  }; 

  return (
    <>
    {!userData && (<p>Loading Employee...</p>)}
    {userData && (
    <div className="mt-5 bg-white mr-5 rounded-xl">
      <div className="flex items-center ">
        {/* User details */}

        {/* Profile image */}
        <img 
          className="w-12 h-12 rounded-xl bg-gray-200 mt-5 ml-5 mr-3" 
          src={import.meta.env.VITE_ASSETS_URL+`userData.image`}
          alt={userData.firstname}
        >
        </img>
        <div>

        {/* Name */}
          <p className="font-semibold mt-6 text-2xl">{userData.firstname} {userData.lastname}</p>

        {/* Designation   */}
          <p className="text-gray-400 text-0.5x1">{userData.role}</p>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 mt-5 text-gray-400">{userData.bio}</div>

      <div className="flex space-x-40 mt-4">
        {/* Date   */}
        <div className="text-gray-400 ml-5 font-semibold text-0.5x1">
          {`${item.isApproved ? 
            (userData.date.split('T')[0] + '  to  ' + item.date_terminated.split('T')[0]) : 
            (userData.date.split('T')[0])
          }`}  
        </div>

        {/* Button   */}
        {!item.isApproved && (
        <button 
          className="bg-violet-700 p-2 pl-5 pr-5 rounded-lg text-white mb-4"
          onClick={ApproveTerminationHandler}
        >Approve
        </button>
        )}
      </div>
    </div>
    )}</>
  )
}

export default TerminationItem