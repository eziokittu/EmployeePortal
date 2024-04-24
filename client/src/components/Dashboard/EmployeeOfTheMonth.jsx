import React, { useState, useEffect, useContext } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const EmployeeOfTheMonth = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();

  const months1 = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const months2 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function getFormattedDate (dateString, months, view) {
    const [day, month, year] = dateString.split('/');
    const monthName = months[parseInt(month, 10)-1];
    if (view='month-year')
      return `${monthName}-${year}`;
    else if (view='month')
      return `${monthName}`
    else{
      return `${monthName}-${year}`
    }
  }
  const currentDate = new Date();
  const formattedDate = getFormattedDate(`${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`, months1, 'month-year');
  const currentMonth = getFormattedDate(`${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`, months2, 'month');
  const currentMonthFull = getFormattedDate(`${currentDate.getDate()}/${currentDate.getMonth()+1}/${currentDate.getFullYear()}`, months2, 'month-year-full');

  const [loadedEmpMonth, setLoadedEmpMonth] = useState();
  const [loadedEmployees, setLoadedEmployees] = useState();
  useEffect(() => {
    const fetchEmpMonth = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/empmonth/get/${formattedDate}`
        );
        if (responseData.ok === 1) {
          setLoadedEmpMonth(responseData.empMonth);
          setLoadedEmployees(responseData.employees);
        }
        else {
          console.log(responseData.message);
        }
      } catch (err) {
        console.log("Error in fetching employees " + err);
      }
    };
    fetchEmpMonth();
  }, []);

  const fetchDomainByEmpId = async (uid) => {
    let empDomain = 'Not Available';
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/users/emp/id/${uid}`
      );
      if (responseData.ok === 1) {
        empDomain = responseData.employee;
      }
      else {
        console.log(responseData.message);
      }
    } catch (err) {
      console.log("Error in fetching employees " + err);
    }
    
    return empDomain;
  };

  const [empDomains, setEmpDomains] = useState([]);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-300 bg-slate-100 rounded-lg ">

        {/* Heading */}
        <div>Employee of the month</div>
        <div>{`${currentMonth}`}</div>

        {/* Buttons for ADMIN */}
        {auth.isAdmin && (
          <div>
            <button>{`Add Employee of the month for ${currentMonthFull}`}</button>
          </div>
        )}

        {/* Employee of the month view list */}
        <div>
          {loadedEmployees && loadedEmployees.map((emp) => {
            return (
            // Employee card
            <div className="text-sm grid grid-cols-12 gap-5 bg-white drop-shadow-lg rounded-lg p-4 w-full mb-4">

              {/* Employee Image */}
              <div className="col-span-2 flex items-start  mr-4 bg-white border border-gray-200 rounded-lg shadow justify-between text-cente">
                <div className="w-full max-w-sm ">
                  <div className="flex flex-col items-center justify-center ">
                    <img className="w-full h-full rounded-full shadow-lg" src={`${import.meta.env.VITE_ASSETS_URL}/${emp.image}`} alt="employee image" />
                  </div>
                </div>
              </div>

              {/* Employee Name */}
              <div 
                // onClick={clickEmployeeHandler} 
                className='flex flex-col justify-center items-center col-span-2 border-2 hover:border-gray-100 border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100'
              >
                <h2 className="text-md font-bold text-black">{emp.firstname}</h2>
                <h2 className="text-md font-bold text-black">{emp.lastname}</h2>
              </div>

              {/* Employee ID */}
              <div className='flex justify-center items-center col-span-3'>
                <p className=" text-black font-bold">{emp.ref}</p>
              </div>

              {/* Employee Domain */}
              <div className='col-span-3 items-center justify-around'> 
                <div>{()=>{
                  
                  console.log("User ID DEBUG"+emp._id);
                }}
                </div>
              </div>
            </div>
            )
          })}
          {!loadedEmpMonth && (
            <div>{`The list for Employee of the month for ${currentMonthFull} has not been added by ADMIN!`}</div>
          )}
        </div>

        {/* Buttons to view Employee of the month for other months */}
        <div>
          All the month buttons to be displayed here!
        </div>
      </div>
    </div>
  )
}

export default EmployeeOfTheMonth;