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
          console.log(`DEBUG: [${responseData.user.firstname} ${responseData.user.lastname}]-[${!data.isApproved}]-[${responseData.user.ref}]`);
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
        import.meta.env.VITE_BACKEND_URL+`/applied/patch/approve/offers`,
        'PATCH',
        JSON.stringify({
					oid: data.offer,
					alluid: [data.user]
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
    <div className='mt-4 rounded-xl border-2 border-gray-300'>
      {userData && data && (
        <div 
          className='grid grid-cols-12 bg-blue-100 justify-center rounded-xl p-2 text-sm items-center'
          id={userData.id}
        >

          {/* User Details */}
          <p className='col-span-1 font-bold'>{data.isApproved ? 'APPROVED' : 'NOT APPROVED'}</p>
          <p className='col-span-2 flex flex-col'><p>{userData.firstname}</p><p>{userData.lastname}</p></p>
          <p className='col-span-1'>{userData.phone}</p>
          <p className='col-span-2'>{userData.email}</p>
          <p className='col-span-2'>{userData.ref}</p>

          {/* Buttons */}
          <div className='col-span-4 flex justify-around'>
            {/* Approve Button */}
            {(!data.isApproved && userData.ref === "-") && (
              <button 
                type='button'
                className="mr-2 px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-800"
                onClick={approveUserHandler}
              >
                Approve
              </button>
            )}
            {(!data.isApproved && userData.ref !== "-") && (
              <div 
                className="mr-2 px-6 py-2 bg-green-500 text-white rounded-md shadow cursor-default"
              >
                Already an Employee
              </div>
            )}
            {(data.isApproved) && (
              <div 
                className="mr-2 px-6 py-2 bg-green-500 text-white rounded-md shadow cursor-default"
              >
                Already approved
              </div>
            )}
            {/* View Resume */}
            <a 
              type='button'
              className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-800"
              href={`${import.meta.env.VITE_ASSETS_URL}/${data.resume}`} target="_blank" rel="noopener noreferrer"
            >
              View Resume
            </a>
          </div>

        </div>
      )}
    </div>
  )
}

export default ApplicationCard;