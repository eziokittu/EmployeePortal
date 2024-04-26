import React, { useEffect, useContext, useState, useRef } from 'react';
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from "../Backend/context/auth-context";
import { useNavigate } from 'react-router-dom';

const EmpMonthCard = ({ empMonthData }) => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [loadedEmployee, setLoadedEmployee] = useState(null);
  const [loadedDomain, setLoadedDomain] = useState(null);
  const [file, setFile] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/users/emp/id/${empMonthData.employee}`
        );
        if (responseData.ok === 1) {
          setLoadedEmployee(responseData.employee);
          console.log("Successful in fetching employee details!");
        } else {
          console.log("Error in fetching employee details!");
        }
      } catch (err) {
        console.log("Some error occurred while fetching employee details: " + err);
      }
    };
    fetchEmployeeDetails();
  }, []); // Empty dependency array to run the effect only once
  
  useEffect(() => {
    if (!loadedEmployee) return;

    const fetchEmployeeDomain = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/domains/get/${loadedEmployee.domain}`
        );
        if (responseData.ok === 1) {
          setLoadedDomain(responseData.domain);
          console.log("Successful in fetching domain!");
        } else {
          console.log("Error in fetching domain!");
        }
      } catch (err) {
        console.log("Error in fetching domain: " + err);
      }
    };
    fetchEmployeeDomain();
  }, [loadedEmployee]); // Run only when loadedEmployee changes

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    stipendUploadHandler();
  }, [file]);

  const pickedHandler = event => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

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
      if (responseData.ok === 1) {
        console.log("Removed employee from employee of the month list");
        setTimeout(() => {
          window.location.reload(false);
        }, 700);
      }
    } catch (err) {
      console.log('Error removing employee from employee of the month list: ', err);
    }
  };

  const stipendUploadHandler = async () => {
    try {
      const formData = new FormData();
      console.log("DEBUG:",file, empMonthData, loadedEmployee);
      formData.append('stipend', file);
      formData.append('employee', empMonthData.employee);
      formData.append('monthYear', empMonthData.monthYear);

      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/empmonth/patch`,
        'PATCH',
        formData
      );
      if (responseData.ok === 1) {
        console.log("Updated stipend receipt");
        setTimeout(() => {
          window.location.reload(false);
        }, 700);
      } else {
        console.log(responseData.message);
      }
    } catch (err) {
      console.log('Error uploading stipend file: ', err);
    }
  };

  return (
    <div className="flex flex-col gap-0">
      
      {loadedEmployee && (
        <div className="text-sm grid grid-cols-12 gap-2 bg-white drop-shadow-lg rounded-lg p-2 mb-4 w-full">
          {/* Employee Image */}
          <div className={`flex flex-col items-center w-full col-span-2 mr-4 bg-white border border-gray-200 rounded-lg shadow justify-between text-center`}>
            <div className='text-center min-w-16 max-w-28'>
              <img className="w-full h-full rounded-lg shadow-lg" src={`${import.meta.env.VITE_ASSETS_URL}/${loadedEmployee.image}`} alt="employee image" />
            </div>
          </div>
          {/* Employee Name */}
          <button className='flex flex-col justify-center items-center col-span-2'>
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
          {auth.isAdmin && loadedEmployee && (
            <div className={`flex flex-col justify-center items-center col-span-2 gap-1`}>
              <button
                onClick={removeEmployeeHandler}
                className='bg-red-500 hover:bg-red-800 text-white text-center px-2 py-1 border border-gray-900 hover:border-gray-100 rounded-lg w-full'
              >
                Remove
              </button>
              <div className='bg-blue-500 hover:bg-blue-800 text-white px-2 py-1 text-center border border-gray-900 hover:border-gray-100 rounded-lg w-full'>
                <label htmlFor={`srs_file_${empMonthData.employee}`} className="cursor-pointer">
                  Upload Stipend
                  <input
                    id={`srs_file_${empMonthData.employee}`}
                    type="file"
                    className="hidden"
                    ref={filePickerRef}
                    accept=".pdf"
                    onChange={pickedHandler}
                  />
                </label>
              </div>
              {empMonthData.stipend !== import.meta.env.VITE_USER_DEFAULT_STIPEND_PATH ? (
                <a
                  href={`${import.meta.env.VITE_ASSETS_URL}/${empMonthData.stipend}`}
                  target="_blank" rel="noopener noreferrer"
                  className='bg-green-500 hover:bg-green-800 text-white text-center px-2 py-1 border border-gray-900 hover:border-gray-100 rounded-lg w-full'
                >
                  View Stipend
                </a>
              ) : (
                <p className='text-[11px]'>stipend not uploaded</p>
              )}
            </div>
          )}
        </div>
      )}
      {loadedEmployee && (loadedEmployee._id===auth.userId) && (
        (empMonthData.stipend !== import.meta.env.VITE_USER_DEFAULT_STIPEND_PATH) ? (
          <a
            href={`${import.meta.env.VITE_ASSETS_URL}/${empMonthData.stipend}`}
            target="_blank" rel="noopener noreferrer"
            className='justify-center items-center mb-4 bg-green-500 hover:bg-green-800 text-white text-center px-4 py-2  border border-gray-900 hover:border-gray-100 rounded-lg w-full'
          >
            View your Stipend recipt
          </a>
        ) : (
          <p
            onClick={()=>(navigate('/contact'))} 
            className='cursor-pointer justify-center items-center mb-4 bg-red-500 hover:bg-red-800 text-white text-center px-4 py-2  border border-gray-900 hover:border-gray-100 rounded-lg w-full'
          >Your Stipend has not be updated yet. Contact ADMIN!</p>
        )
      )}
    </div>
  );
};

export default EmpMonthCard;
