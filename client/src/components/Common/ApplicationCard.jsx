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

  return (
    <div className='flex flex-col space-x-2'>
      {userData && (
        <div id={userData.id}>
          <p>Name: {userData.firstname + ' ' + userData.lastname}</p>
          <p>Phone: {userData.phone}</p>
          <p>Email: {userData.email}</p>
        </div>
      )}
    </div>
  )
}

export default ApplicationCard;