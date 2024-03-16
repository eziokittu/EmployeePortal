import React, { useState, useEffect, useContext } from "react";
// import TerminationItem from "../Common/TerminationItem";
// import ReactPaginate from "react-paginate";
import {useHttpClient} from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const Termination = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const [terminationStatus, setTerminationStatus] = useState(true);
  const fetchTerminationStatus = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/users/terminationstatus/id/${auth.userId}`
      );
      setTerminationStatus(responseData.status);
    }
    catch (error) {
      console.log("Error while fetching termination status!");
    }
  }

  // fetches termination for the employee only
  useEffect(() => {
    if (!auth.isAdmin){
      fetchTerminationStatus();
    }
  }, []);

  const [inputEmail, setInputEmail] = useState("");
  const terminateEmployeeHandler = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL+`/users/edit/terminate`,
        'PATCH',
        JSON.stringify({
					email: inputEmail
				}),
				{
					'Content-Type': 'application/json'
				}
      );
      console.log("Successfully terminated employee with email:", inputEmail);
    }
    catch (error) {
      console.log("Error while terminating employee!");
    }
  }

  // const [loadedTerminations, setLoadedTerminations] = useState();
  // const fetchTerminations = async () => {
  //   try {
  //     const responseData = await sendRequest(
  //       import.meta.env.VITE_BACKEND_URL + `/users/terminations?page=${page}`
  //     );
  //     setLoadedTerminations(responseData.terminations);
  //   } catch (err) {
  //     console.error(`ERROR fetching terminations`, err);
  //   }
  // };
  // const [terminationCount, setTerminationCount] = useState(0);
  // const fetchTerminationsCount = async () => {
  //   try {
  //     const responseData = await sendRequest(
  //       import.meta.env.VITE_BACKEND_URL + `/users/terminationcount`
  //     );
  //     setTerminationCount(responseData.count);
  //     setPageCount(Math.ceil(responseData.count / terminationsDisplayedPerPage));
  //   } catch (err) {
  //     console.error(`ERROR fetching terminations count`, err);
  //   }
  // };

  // handling the pagination
  // const [pageCount, setPageCount] = useState(0);
  // const [page, setPage] = useState(0);
  // const handlePageClick = (num) => {
  //   setPage(num);
  // };

  // const terminationsDisplayedPerPage = 2;
  // const [terminationCount, setTerminationCount] = useState(null);
  // Initially fetches all the terminations
  // useEffect(() => {
  //   fetchTerminationsCount();
  //   fetchTerminations();
  // }, [sendRequest, page]);

  // return (
  //   <div className=" h-full">
  //     <div className="p-4 ml-64 bg-blue-50">

  //       {/* Heading */}
  //       <h1 className="font-semibold text-3xl">Termination Status</h1>

  //       {/* Card for Terminations starts */}

  //       {/* <div className="grid grid-cols-2 gap-4 mb-4">
  //         {loadedTerminations && (
  //           loadedTerminations.map((item)=>(
  //             <div key={item.id}>
  //               <TerminationItem item={item}/>
  //             </div>
  //           ))
  //         )}
  //       </div> */}

  //       {/* Card for Terminations end */}

  //     </div>
  //     {/* Pagination starts */}
  //     {/* <div className='flex justify-center items-center'>
  //       <ReactPaginate
  //         previousLabel={"previous"}
  //         nextLabel={"next"}
  //         breakLabel={"..."}
  //         pageCount={pageCount}
  //         marginPagesDisplayed={2}
  //         pageRangeDisplayed={3}
  //         onPageChange={(selected) => handlePageClick(selected.selected)}
  //         containerClassName={"flex items-center mt-10 mr-4 justify-end"}
  //         pageLinkClassName={
  //           "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700"
  //         }
  //         previousLinkClassName={
  //           "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-blue-100 hover:text-blue-700"
  //         }
  //         nextClassName={"page-item"}
  //         nextLinkClassName={
  //           "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-blue-100 hover:text-blue-700"
  //         }
  //         breakLinkClassName={
  //           "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-700 "
  //         }
  //       />
  //     </div> */}
  //     {/* Pagination ends */}
  //   </div>
  // );

  if (!auth.isAdmin) {
    return (
      <div className=" h-full">
        <div className="p-4 ml-64 bg-blue-50 min-h-[500px]">
  
          {/* Heading */}
          <h1 className="font-semibold text-3xl">Termination Status</h1>
  
          {/* Termination Status */}
          {terminationStatus===false ? (
            <div>
              <p className="font-normal text-xl">Your termination status is ok!</p>
            </div>
          ) : (
            <div>
              <p className="font-normal text-xl">You are terminated</p>
            </div>
          )}
        </div>
      </div>
    )
  }
  else {
    return (
      <div className=" h-full">
        <div className="p-4 ml-64 bg-blue-50 min-h-[500px]">
  
          <h1 className="font-semibold text-3xl">Termination Window</h1>
  
          {/* Email Address */}
          <div className="mt-4 relative">
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
              width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm3.519 0L12 11.671 18.481 6H5.52zM20 7.329l-7.341 6.424a1 1 0 0 1-1.318 0L4 7.329V18h16V7.329z" fill="#0D0D0D" /></svg>
          </div>
          {/* Terminate and Button */}
          <div className="mt-5 flex justify-center">
            <button 
              onClick={terminateEmployeeHandler}
              className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-gray-600"
            >
              Terminate
            </button>
          </div>
        </div>
      </div>
    )
  }
};



export default Termination;
