import React, {useEffect, useState} from 'react';
import { useHttpClient } from '../Backend/hooks/http-hook';

function ApplicationCard({isJob, data}) {
	const { sendRequest } = useHttpClient();

  // fetching all the user details from the mongoDB database
  const [userData, setUserData] = useState();
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/users/user/id/${data.user}`
        );
        if (responseData.ok === 1){
          setUserData(responseData.user);
          console.log(`Successful in fetching user details for ID: ${data.user}`);
        }
        else {
          console.log("Error in getting user details!");
        }
      } catch (err) {
        console.log("Error in fetching user data: "+err);
      }
    };
    fetchApplications();
  }, [sendRequest]);

  // Function to approve the current user for the offer
  const approveUserHandler = async () => {
    try {
      const responseData1 = await sendRequest(
        import.meta.env.VITE_BACKEND_URL+`/users/edit/usertoemp`,
        'PATCH',
        JSON.stringify({
					userId: data.user
				}),
				{
					'Content-Type': 'application/json'
				}
      );
      const responseData2 = await sendRequest(
        import.meta.env.VITE_BACKEND_URL+`/applied/patch/approve`,
        'PATCH',
        JSON.stringify({
					oid: data.offer,
					uid: data.user
				}),
				{
					'Content-Type': 'application/json'
				}
      );
      if (responseData1.ok === 1 && responseData2.ok === 1){
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
        console.log("User is now an Employee!");
      }
      else {
        console.log("Some error occurred!");
      }
    } catch (err) {
      console.log("Error in response!"+err);
    }
  }

  // Function to approve the current user for the offer
  const viewResumeHandler = async () => {
    console.log("Admin can view User's Resume!")
  }

  return (
    <div className='flex flex-col space-x-2'>
      {userData && (
        <div 
          className='flex text-center'
          id={userData.id}
        >

          {/* User Details */}
          <p className='mr-4'>Approved: {data.isApproved ? 'TRUE' : 'FALSE'}</p>
          <p className='mr-4'>Name: {userData.firstname + ' ' + userData.lastname}</p>
          <p className='mr-4'>Phone: {userData.phone}</p>
          <p className='mr-4'>Email: {userData.email}</p>

          {/* Buttons */}
          <div className='mt-5 flex ml-auto'>
            {/* Approve Button */}
            {!data.isApproved && (<button 
              type='button'
              className="mr-2 px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-gray-600"
              onClick={approveUserHandler}
            >
              Approve
            </button>
            )}
            {/* View Resume */}
            <button 
              type='button'
              className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-gray-600"
              onClick={viewResumeHandler}
            >
              View Resume
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default ApplicationCard;