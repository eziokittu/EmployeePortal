import React, { useEffect, useContext, useState } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from "../Backend/context/auth-context";

const EmpMonthCard = ({ empMonthData }) => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const removeEmployeeHandler = async () => {
    try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/empmonth/delete`,
				'DELETE',
				JSON.stringify({
					employee: empMonthData.employee,
          monthYear: empMonthData.monthYear
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      if (responseData.ok===1){
        console.log("removed employee from employee of the month list");
        setTimeout(() => {
          window.location.reload(false);
        }, 700);
      }
		} catch (err) {
			console.log('ERROR removing employee from employee of the month list');
		} 
  }

  const [loadedEmployee, setLoadedEmployee] = useState();
  // Function to fetch employee details
  useEffect(() => {
    const fetchEmployeeDetais = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/users/emp/id/${empMonthData.employee}`
        );
        if (responseData.ok === 1) {
          setLoadedEmployee(responseData.employee);
          console.log("Successful in fetching employee details!");
        }
        else {
          console.log("Error in fetching employee details!");
        }
      } catch (err) {
        console.log("Some error occured: " + err);
      }
    };
    fetchEmployeeDetais();
  }, []);

  const [loadedDomain, setLoadedDomain] = useState();
  // Function to fetch employee domain
  useEffect(() => {
    const fetchEmployeeDomainName = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/domains/get/${loadedEmployee.domain}`
        );
        if (responseData.ok === 1) {
          setLoadedDomain(responseData.domain);
        }
        else {
          console.log("Error in setting domain");
        }
      } catch (err) {
        console.log("Error in fetching domain " + err);
      }
    };
    fetchEmployeeDomainName();
  }, [loadedEmployee]);

  return (
    <div className=''>
      {loadedEmployee && (
        <div className="text-sm grid grid-cols-12 gap-2 bg-white drop-shadow-lg rounded-lg p-2 mb-4 w-full">

          {/* Employee Image */}
          <div className={`flex flex-col items-center w-full col-span-2 mr-4 bg-white border border-gray-200 rounded-lg shadow justify-between text-center`}>
            <div className='text-center min-w-16 max-w-28'>
              <img className="w-full h-full rounded-lg shadow-lg" src={`${import.meta.env.VITE_ASSETS_URL}/${loadedEmployee.image}`} alt="employee image" />
            </div>
          </div>

          {/* Employee Name */}
          <button
            className='flex flex-col justify-center items-center col-span-2 '
          >
            <h2 className="text-md font-bold text-black">{loadedEmployee.firstname}</h2>
            <h2 className="text-md font-bold text-black">{loadedEmployee.lastname}</h2>
          </button>

          {/* Employee ID */}
          <div className={`flex text-center justify-center items-center ${auth.isAdmin ? 'col-span-3' : 'col-span-4'}`}>
            <p className=" text-black font-bold">{loadedEmployee.ref}</p>
          </div>

          {/* Employee Domain */}
          {loadedDomain && (
            <div className={`flex text-center justify-center items-center ${auth.isAdmin ? 'col-span-3' : 'col-span-4'}`}>
              {loadedDomain.name}
            </div>
          )}

          {/* Buttons for ADMIN */}
          {auth.isAdmin && (
            <div className={`flex flex-col justify-center items-center col-span-2 gap-1`}>
              <button
                onClick={() => (removeEmployeeHandler(loadedEmployee._id))}
                className='bg-red-500 hover:bg-red-800 text-white text-center px-2 py-1 border border-gray-900 hover:border-gray-100 rounded-lg w-full'
              >Remove</button>
              <button
                onClick={() => (console.log("Uploading the stipend"))}
                className='bg-blue-500 hover:bg-blue-800 text-white text-center px-2 py-1 border border-gray-900 hover:border-gray-100 rounded-lg w-full'
              >Upload Stipend</button>
              <p className='text-[11px]'>stipend not uploaded</p>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

export default EmpMonthCard