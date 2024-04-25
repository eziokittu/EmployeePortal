import React, { useState, useEffect, useContext } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';
import { useParams, useNavigate } from "react-router-dom";

import EmpMonthCard from '../Common/EmpMonthCard';
import EmpMonthAddEmp from '../Common/EmpMonthAddEmp';
import Error from '../Error/Error';
import EmpMonthListByYear from '../Common/EmpMonthListByYear';

const EmployeeOfTheMonth = () => {
  const auth = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const navigate = useNavigate();
  const { monthYear } = useParams();

  const months1 = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const months2 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  function getFormattedDate(dateString, months, view) {
    const [day, month, year] = dateString.split('/');
    const monthName = months[parseInt(month, 10) - 1];
    if (view = 'month-year')
      return `${monthName}-${year}`;
    else if (view = 'month')
      return `${monthName}`
    else {
      return `${monthName}-${year}`
    }
  }

  const [foundMonth, setFoundMonth] = useState('');
  const monthYearFull = `${months2[months1.indexOf(monthYear.toString().split('-')[0])]} of ${monthYear.split('-')[1]}`

  const [loadedEmpMonth, setLoadedEmpMonth] = useState();
  useEffect(() => {
    const fetchEmpMonth = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/empmonth/get/${monthYear}`
        );
        if (responseData.ok === 1) {
          setLoadedEmpMonth(responseData.empMonth);
        }
        else {
          console.log(responseData.message);
        }
      } catch (err) {
        console.log("Error in fetching employees " + err);
      }
    };
    fetchEmpMonth();
    setFoundMonth(
      (months1.indexOf(monthYear.toString().split('-')[0]) !== -1)
      &&
      (monthYear.toString().split('-').length === 2)
      &&
      (monthYear.toString().split('-')[1].length === 4)
      &&
      Number.isInteger(parseFloat(monthYear.toString().split('-')[1]))
    );
  }, []);


  return (
    <>
      {foundMonth != '' && (
        <div className="p-4 sm:ml-64">
          <div className="p-4 border-2 border-gray-300 bg-slate-100 rounded-lg text-center relative">

            {/* Heading */}
            <div className='relative'>
              <div className='font-bold text-3xl mt-4 mb-2'>Employee of the month</div>
              <div className='font-bold text-xl mb-8'>{`${monthYearFull}`}</div>
            </div>

            {/* Employee of the month view list */}
            <div>
              {/* Employee of the month Card Heading*/}
              {loadedEmpMonth && (
                <div className="grid grid-cols-12 gap-5 bg-primary-600 text-white shadow-gray-300 shadow-xl rounded-t-lg p-4 rounded-lg mb-4 w-full">
                  <div className={`flex justify-center items-center ${auth.isAdmin ? 'col-span-2' : 'col-span-2'} `}>
                    <h2 className="text-sm font-bold">Image</h2>
                  </div>
                  <div className={`flex justify-center items-center ${auth.isAdmin ? 'col-span-2' : 'col-span-2'} `}>
                    <h2 className="text-sm font-bold">Name</h2>
                  </div>
                  <div className={`flex justify-center items-center ${auth.isAdmin ? 'col-span-3' : 'col-span-4'} `}>
                    <h2 className="text-sm font-bold">Ref ID</h2>
                  </div>
                  <div className={`flex justify-center items-center ${auth.isAdmin ? 'col-span-3' : 'col-span-4'} `}>
                    <h2 className="text-sm font-bold">Domain</h2>
                  </div>
                  {auth.isAdmin && (
                    <div className={`flex justify-center items-center col-span-2`}>
                      <h2 className="text-sm font-bold">Actions</h2>
                    </div>
                  )}
                </div>
              )}

              {/* Employee of the month cards */}
              {loadedEmpMonth && loadedEmpMonth.map((empMonth) => {
                return (
                  <EmpMonthCard empMonthData={empMonth} />
                )
              })}
              {!loadedEmpMonth && (
                <div className='bg-white px-2 py-4 border border-gray-600 my-4 rounded-lg'>{`The list for Employee of the month for ${monthYearFull} has not been added by ADMIN!`}</div>
              )}
            </div>

            {/* ADD emp month button for ADMIN */}
            {auth.isAdmin && (
              <EmpMonthAddEmp monthYear={monthYear}/>
            )}

            {/* Buttons to view Employee of the month for other months */}
            <div className='mt-8'>
              <EmpMonthListByYear reloadNeeded={true} startYear={'19/04/2023'} endYear={new Date().getDate()}/>
            </div>

          </div>
        </div>
      )}
      {foundMonth == '' && (
        <Error text={`'${monthYear}' is not a valid month and Year`} isFullPage={false} />
      )}
    </>
  )
}

export default EmployeeOfTheMonth;