import React, { useState, useEffect, useContext } from "react";
import TerminationCard from "../Common/TerminationCard";
import ReactPaginate from "react-paginate";
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const Termination = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const [terminationStatus, setTerminationStatus] = useState(true);
  const [terminationReason, setTerminationReason] = useState('');
  const fetchTerminationStatus = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/users/terminationstatus/id/${auth.userId}`
      );
      setTerminationStatus(responseData.status);
      setTerminationReason(responseData.reason);
    }
    catch (error) {
      console.log("Error while fetching termination status!");
    }
  }

  // fetches termination for the employee only
  useEffect(() => {
    if (!auth.isAdmin) {
      fetchTerminationStatus();
    }
  }, []);

  const [inputEmail, setInputEmail] = useState("");
  const [inputReason, setInputReason] = useState("");

  // function to check for invalid inputs and return the list of error message strings
  const validateInput = () => {
    let alerts = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputEmail.trim() || !emailRegex.test(inputEmail)) {
      alerts.push('Enter a valid email');
    }
    return alerts; // Return the alerts array directly
  }

  const terminateEmployeeHandler = async () => {
    // Checking for invalid input
    const validationAlerts = validateInput()
    if (validationAlerts.length > 0) {
      alert(`Please correct the following input errors:\n- ${validationAlerts.join('\n- ')}`);
      return;
    }
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/users/edit/terminate`,
        'PATCH',
        JSON.stringify({
          email: inputEmail,
          reason: inputReason
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      if (responseData.ok === 1) {
        alert("Successfully terminated employee");
        setTimeout(() => {
					window.location.reload(false);
				}, 700);
      }
      else {
        alert(responseData.message)
      }
    }
    catch (error) {
      console.log("Error while terminating employee!");
    }
  }

  const unterminateEmployeeHandler = async () => {
    // Checking for invalid input
    const validationAlerts = validateInput()
    if (validationAlerts.length > 0) {
      alert(`Please correct the following input errors:\n- ${validationAlerts.join('\n- ')}`);
      return;
    }
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/users/edit/unterminate`,
        'PATCH',
        JSON.stringify({
          email: inputEmail
        }),
        {
          'Content-Type': 'application/json'
        }
      );
      if (responseData.ok === 1) {
        alert("Successfully unterminated employee");
        setTimeout(() => {
					window.location.reload(false);
				}, 700);
      }
      else {
        alert(responseData.message)
      }
    }
    catch (error) {
      console.log("Error while unterminating employee!");
    }
  }

  const [loadedTerminations, setLoadedTerminations] = useState();
  const [terminationCount, setTerminationCount] = useState(0);
  const terminationsDisplayedPerPage = 2;

  // handling the pagination
  const [pageCount, setPageCount] = useState();
  const [page, setPage] = useState(0);
  const handlePageClick = (num) => {
    setPage(num);
  };

  // function to fetch all the jobs
  const fetchAllTerminations = async event => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/users/terminations?page=${page}`
      );
      if (responseData.ok === 1) {
        setLoadedTerminations(responseData.terminations);
      }
      else {
        console.log(responseData.message);
      }
    } catch (err) {
      console.error(`ERROR fetching Terminations`, err);
    }
  };

  // function to fetch all the job count
  const fetchTerminationCount = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/users/terminationcount`
      );
      if (responseData.ok === 1) {
        setTerminationCount(responseData.count);
        setPageCount(Math.ceil(responseData.count / terminationsDisplayedPerPage));
      }
      else {
        console.log(responseData.message);
      }
    } catch (err) {
      console.error(`ERROR fetching Termination count`, err);
    }
  };

  // Initial fetch + fetches on page change
  useEffect(() => {
    fetchAllTerminations();
    fetchTerminationCount();
    console.log("Fetching termination count and all terminations");
  }, [page]);

  if (!auth.isAdmin) {
    return (
      <div className=" h-full">
        <div className="p-4 ml-64 bg-blue-50 min-h-[500px] text-center">

          {/* Heading */}
          <h1 className="font-semibold text-3xl">Termination Status</h1>

          {/* Termination Status */}
          {terminationStatus === false ? (
            <div>
              <p className="text-xl text-green-500 font-bold">Your termination status is ok!</p>
            </div>
          ) : (
            <div>
              <p className="text-xl text-red-500 font-bold">You are terminated</p>

              <p className="mt-8 font-semibold text-3xl">Reason for termination</p>
              {(terminationReason !== '' && terminationReason !== '-') ? (
                <p className="mt-2font-normal text-xl">{terminationReason}</p>
              ) : (
                <p className="mt-2font-normal text-xl">No Reason provided by ADMIN</p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
  else {
    return (
      <div className="ml-64 p-4 min-h-[500px]">

        {/* Termination Window */}
        <div className="p-4 bg-blue-50 rounded-lg drop-shadow-lg">

          <h1 className="font-semibold text-3xl text-center">Termination Window</h1>

          {/* Email Address */}
          <div className="mt-8 relative">
            <label htmlFor="email">Email Address</label>
            <input
              onChange={(event) => setInputEmail(event.target.value)}
              type="email"
              id="termination_email"
              placeholder="Enter Employee email"
              className="block w-full h-10 mt-1 pl-10 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <svg
              className=' absolute left-4 top-10 h-4 w-4 text-gray-400'
              width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm3.519 0L12 11.671 18.481 6H5.52zM20 7.329l-7.341 6.424a1 1 0 0 1-1.318 0L4 7.329V18h16V7.329z" fill="#0D0D0D" />
            </svg>
          </div>

          {/* Termination Reason */}
          <div className="mt-4 relative">
            <label htmlFor="email">Termination Reason</label>
            <input
              onChange={(event) => setInputReason(event.target.value)}
              type="text"
              id="termination_reason"
              placeholder="Enter Termination Reason"
              className="block w-full h-10 mt-1 pl-10 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <svg
              className='absolute left-4 top-10 h-4 w-4 text-gray-400'
              fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 93.936 93.936" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M80.179,13.758c-18.342-18.342-48.08-18.342-66.422,0c-18.342,18.341-18.342,48.08,0,66.421 c18.342,18.342,48.08,18.342,66.422,0C98.521,61.837,98.521,32.099,80.179,13.758z M44.144,83.117 c-4.057,0-7.001-3.071-7.001-7.305c0-4.291,2.987-7.404,7.102-7.404c4.123,0,7.001,3.044,7.001,7.404 C51.246,80.113,48.326,83.117,44.144,83.117z M54.73,44.921c-4.15,4.905-5.796,9.117-5.503,14.088l0.097,2.495 c0.011,0.062,0.017,0.125,0.017,0.188c0,0.58-0.47,1.051-1.05,1.051c-0.004-0.001-0.008-0.001-0.012,0h-7.867 c-0.549,0-1.005-0.423-1.047-0.97l-0.202-2.623c-0.676-6.082,1.508-12.218,6.494-18.202c4.319-5.087,6.816-8.865,6.816-13.145 c0-4.829-3.036-7.536-8.548-7.624c-3.403,0-7.242,1.171-9.534,2.913c-0.264,0.201-0.607,0.264-0.925,0.173 s-0.575-0.327-0.693-0.636l-2.42-6.354c-0.169-0.442-0.02-0.943,0.364-1.224c3.538-2.573,9.441-4.235,15.041-4.235 c12.36,0,17.894,7.975,17.894,15.877C63.652,33.765,59.785,38.919,54.73,44.921z"></path> </g> </g>
            </svg>
          </div>

          {/* Terminate and Button */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={terminateEmployeeHandler}
              className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-gray-600"
            >
              Terminate
            </button>
            <button
              onClick={unterminateEmployeeHandler}
              className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-gray-600"
            >
              Unterminate
            </button>
          </div>
        </div>

        {/* View Previous Terminations */}
        <div className="mt-16 p-4 bg-blue-50 rounded-lg drop-shadow-lg">

          {/* Heading */}
          <h1 className="font-semibold text-3xl text-center mb-8">Previous Terminations</h1>

          {/* Employee of the month view list */}
          <div>
            {/* Employee of the month Card Heading*/}
            {loadedTerminations && (
              <div className="grid grid-cols-12 gap-5 bg-primary-600 text-white shadow-gray-300 shadow-xl rounded-t-lg p-4 rounded-lg mb-4 w-full">
                <div className={`flex justify-center items-center col-span-2`}>
                  <h2 className="text-sm font-bold">Name</h2>
                </div>
                <div className={`flex justify-center items-center col-span-2`}>
                  <h2 className="text-sm font-bold">Email</h2>
                </div>
                <div className={`flex justify-center items-center col-span-3`}>
                  <h2 className="text-sm font-bold">Ref ID</h2>
                </div>
                <div className={`flex justify-center items-center col-span-5`}>
                  <h2 className="text-sm font-bold">Reason</h2>
                </div>
              </div>
            )}

            {/* Employee of the month cards */}
            {loadedTerminations && loadedTerminations.map((loadedTermination) => {
              return (
                <TerminationCard terminationData={loadedTermination} />
              )
            })}

            {/* Pagination */}
            {terminationCount>0 && (
              <div className='flex justify-center items-center'>
                <ReactPaginate
                  previousLabel={"previous"}
                  nextLabel={"next"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={(selected) => handlePageClick(selected.selected)}
                  containerClassName={"flex items-center mt-4 mr-4 justify-end"}
                  pageLinkClassName={
                    "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700"
                  }
                  previousLinkClassName={
                    "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-blue-100 hover:text-blue-700"
                  }
                  nextClassName={"page-item"}
                  nextLinkClassName={
                    "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-blue-100 hover:text-blue-700"
                  }
                  breakLinkClassName={
                    "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-700 "
                  }
                />
              </div>
            )}
          </div>

        </div>
      </div>
    )
  }
};

export default Termination;