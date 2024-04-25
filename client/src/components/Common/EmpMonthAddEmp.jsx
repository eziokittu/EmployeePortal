import React, { useState, useContext, useEffect } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

function EmpMonthAddEmp({monthYear}) {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const [newEmployeeEmail, setNewEmployeeEmail] = useState();
  const [newEmployeeRef, setNewEmployeeRef] = useState();
  const [searchedEmployee, setSearchedEmployee] = useState();
  const [searchedEmployeeDomain, setSearchedEmployeeDomain] = useState();
  
  // function to fetch employee details by searching with Email
  const searchEmployeeByEmail = async (newEmployeeEmail) => {
    try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/emp/search/email/${newEmployeeEmail}`
			);
      if (responseData.ok===1){
        console.log("Successfully fetched employee details with search email");
        setSearchedEmployee(responseData.employee);
      }
		} catch (err) {
      alert("No match found for any employee!")
			console.log('ERROR in searching employee with email');
		} 
  }

  // function to fetch employee details by searching with Ref ID
  const searchEmployeeByRef = async (newEmployeeRef) => {
    try {
      let modifiedRefID = newEmployeeRef.replace(/\//g, ':');
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/emp/search/ref/${modifiedRefID}`
			);
      if (responseData.ok===1){
        console.log("Successfully fetched employee details with search ref ID");
        setSearchedEmployee(responseData.employee);
      }
		} catch (err) {
      alert("No match found for any employee!")
			console.log('ERROR in searching employee with Ref ID');
		} 
  }

  // function to clear the assign employee form
  const clearAssignHandler = async () => {
    setSearchedEmployee();
  }
  
  // function to assign employee with emp id
  const submitAssignHandler = async () => {
    try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/empmonth/post`,
				'POST',
				JSON.stringify({
					"employee": searchedEmployee,
          "amount": "Rs 1000",
          "monthYear": monthYear
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      if (responseData.ok===1){
        console.log("Added searched employee to Employee of the month list!");
        setTimeout(() => {
          window.location.reload(false);
        }, 700);
      }
		} catch (err) {
			console.log('ERROR adding employee to project');
		}
  }

  // Function to fetch searched employee domain 
  useEffect(() => {
    const fetchSearchedEmployeeDomain = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/domains/get/${searchedEmployee.domain}`
        );
        if (responseData.ok === 1) {
          setSearchedEmployeeDomain(responseData.domain);
        }
        else {
          console.log("Error in setting domain name for searched employee");
        }
      } catch (err) {
        console.log("Error in fetching domain " + err);
      }
    };
    fetchSearchedEmployeeDomain();
  }, [searchedEmployee]);

  return (
    <div>
      {/* Assign new Employee */}
      {auth.isAdmin && (
      <div className={`grid grid-cols-10 bg-white drop-shadow-lg rounded-lg p-6 w-full mb-4`}>

        {/* Employee Details */}
        <div className='col-span-2 flex flex-col justify-center items-center bg-gray-100 rounded-lg p-2 border-2 border-gray-300'>
          <h2 className="text-lg text-black underline underline-offset-4">Details</h2>
          {!!searchedEmployee && searchedEmployeeDomain && (
          <div className='text-black text-sm text-center'>
            <p className=" ">{`${searchedEmployee.firstname} ${searchedEmployee.lastname}`}</p>
            <p className=" ">{`${searchedEmployee.phone}`}</p>
            <p className=" ">{`${searchedEmployeeDomain.name}`}</p>
            <p className=" ">{`${searchedEmployee.ref}`}</p>
          </div>
          )}
          {!searchedEmployee && (
          <div className='text-black text-sm text-center'>
            <p className=" ">Search an employee</p>
            <p className=" ">using Reference ID</p>
            <p className=" ">or Email and <span className='font-bold'>Select!</span></p>
          </div>
          )}
        </div>

        {/* Employee Ref ID */}
        <div className='mx-2 col-span-3 flex flex-col justify-center items-center border-2 border-gray-100 bg-gray-50 rounded-lg p-2'>
          <label htmlFor="search_ref">Search by Ref ID</label>
          <input
            onChange={(event) => setNewEmployeeRef(event.target.value)}
            type="text"
            id="search_ref"
            value={newEmployeeRef}
            placeholder={'Enter Reference ID'}
            className="block w-full h-8 my-1 px-2 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button 
            onClick={()=>(searchEmployeeByRef(newEmployeeRef))}
            className='bg-green-500 hover:bg-green-800 text-white px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-gray-600'
          >Search</button>
        </div>

        {/* Employee Email */}
        <div className='mx-2 col-span-3 flex flex-col justify-center items-center border-2 border-gray-100 bg-gray-50 rounded-lg p-2'>
          <label htmlFor="search_email">Search by Email</label>
          <input
            onChange={(event) => setNewEmployeeEmail(event.target.value)}
            type="text"
            id="search_email"
            value={newEmployeeEmail}
            placeholder={'Enter Email'}
            className="block w-full h-8 my-1 px-2 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button 
            onClick={()=>(searchEmployeeByEmail(newEmployeeEmail))}
            className='bg-green-500 hover:bg-green-800 text-white px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-gray-600'
          >Search</button>
        </div>

        {/* Buttons */}
        <div className='col-span-2 flex flex-col justify-around items-center border-2 border-gray-100 bg-gray-50 rounded-lg p-2 '>
          <button 
            disabled={!searchedEmployee}
            onClick={submitAssignHandler}
            className={` w-full px-3 py-1 rounded-xl ${searchedEmployee ? 'bg-green-500 hover:bg-green-800' : 'bg-gray-400'} text-white font-bold`}
          >Select Employee</button>
          <button 
            onClick={clearAssignHandler}
            className=" w-full px-3 py-1 rounded-xl bg-gray-400 hover:bg-gray-600 text-white font-bold"
          >Clear</button>
        </div>
        
      </div>
      )}
    </div>
  )
}

export default EmpMonthAddEmp