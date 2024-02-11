import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import {useHttpClient} from '../Backend/hooks/http-hook';
import TerminationItem from "../Common/TerminationItem";

const Termination = () => {
  const [chosen, setChosen] = useState('all');
  const handleParagraphClick = (option) => {
    setChosen(option);
  };

  const { sendRequest } = useHttpClient();

  // Function to fetch all terminations from the mongoDB database
  const [loadedAllTerminations, setLoadedAllTerminations] = useState();
  const fetchAllTerminations = async event => {
		try {
			const responseData = await sendRequest(
        `http://localhost:5000/api/terminations/get/all?page=${page}`
      );
      setLoadedAllTerminations(responseData.terminations);
      setPageCount(responseData.terminations.length)
		} catch (err) {
			console.log('ERROR fetching all terminations');
		}  
  };

  // Function to fetch Approved terminations from the mongoDB database
  const [loadedApprovedTerminations, setLoadedApprovedTerminations] = useState();
  const fetchApprovedTerminations = async event => {
		try {
			const responseData = await sendRequest(
        `http://localhost:5000/api/terminations/get/approved?page=${page}`
      );
      setLoadedApprovedTerminations(responseData.terminations);
      setPageCount(responseData.terminations.length)
		} catch (err) {
			console.log('ERROR fetching approved terminations');
		}  
    const fetchApprovedTerminationsCount = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/terminations/get/approved/count`
        );
        setTerminationCount(responseData.count);
        setPageCount(Math.ceil(responseData.count / terminationsDisplayedPerPage))
      } catch (err) {
        console.log("Error in fetching approved termination count: "+err);
      }
    };
    fetchApprovedTerminationsCount();
  };
  
  // Function to fetch Applied terminations from the mongoDB database
  const [loadedAppliedTerminations, setLoadedAppliedTerminations] = useState();
  const fetchAppliedTerminations = async event => {
		try {
			const responseData = await sendRequest(
        `http://localhost:5000/api/terminations/get/applied?page=${page}`
      );
      setLoadedAppliedTerminations(responseData.terminations);
      setPageCount(Math.ceil(responseData.terminations.length / terminationsDisplayedPerPage));
		} catch (err) {
			console.log('ERROR fetching applied terminations');
		}  
    const fetchAppliedTerminationsCount = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/terminations/get/applied/count`
        );
        setTerminationCount(responseData.count);
        setPageCount(Math.ceil(responseData.count / terminationsDisplayedPerPage))
      } catch (err) {
        console.log("Error in fetching applied termination count: "+err);
      }
    };
    fetchAppliedTerminationsCount();
  }; 

  // handling the pagination
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const handlePageClick = (num) => {
    setPage(num);
  };

  const terminationsDisplayedPerPage = 2;
  const [terminationCount, setTerminationCount] = useState(null);
  // Initially fetches all the terminations
  useEffect(() => {
    const fetchAllTerminations = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/terminations/get/all?page=${page}`
        );
        setLoadedAllTerminations(responseData.terminations);
      } catch (err) {
        console.log("Error in fetching all terminations: "+err);
      }
    };

    const fetchAllTerminationsCount = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/terminations/get/all/count`
        );
        setTerminationCount(responseData.count);
        setPageCount(Math.ceil(responseData.count / terminationsDisplayedPerPage))
      } catch (err) {
        console.log("Error in fetching employee count: "+err);
      }
    };

    fetchAllTerminations();
    fetchAllTerminationsCount();
  }, [sendRequest, page]);

  return (
    <div className=" h-full">
      <div className="p-4 ml-64 bg-blue-50">

        {/* Heading */}
        <h1 className="font-semibold text-3xl">Applications</h1>

        {/* Paragraph options */}
        <div className="flex items-center mt-4">
          <p
            id="all"
            className={`cursor-pointer mr-4 ${
              chosen === "all" ? "chosen font-bold" : ""
            }`}
            onClick={
              () => {
                handleParagraphClick("all");
                fetchAllTerminations();
                // setPage(0);
              }
            }
          >
            All
          </p>
          <p
            id="approved"
            className={`cursor-pointer mr-4 ${
              chosen === "approved" ? "chosen font-bold" : ""
            }`}
            onClick={
              () => {
                handleParagraphClick("approved");
                // setPage(0);
                fetchApprovedTerminations();
              }
            }
          >
            Approved
          </p>
          <p
            id="pending"
            className={`cursor-pointer mr-4 ${
              chosen === "pending" ? "chosen font-bold" : ""
            }`}
            onClick={
              () => {
                handleParagraphClick("pending");
                // setPage(0);
                fetchAppliedTerminations();
              }
            }
          >
            Pending
          </p>
        </div>

        {/* Card for Terminations starts */}

        <div className="grid grid-cols-2 gap-4 mb-4">
          {chosen==='all' && loadedAllTerminations && (
            loadedAllTerminations.map((item)=>(
              <div key={item.id}>
                <TerminationItem item={item}/>
              </div>
            ))
          )}
          {chosen==='pending' && loadedAppliedTerminations && (
            loadedAppliedTerminations.map((item)=>(
              <div key={item.id}>
                <TerminationItem item={item}/>
              </div>
            ))
          )}
          {chosen==='approved' && loadedApprovedTerminations && (
            loadedApprovedTerminations.map((item)=>(
              <div key={item.id}>
                <TerminationItem item={item}/>
              </div>
            ))
          )}
        </div>

        {/* Card for Terminations end */}

        {/* Pagination starts */}
      </div>
      <div className='flex justify-center items-center'>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={(selected) => handlePageClick(selected.selected)}
          containerClassName={"flex items-center mt-10 mr-4 justify-end"}
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
    </div>
  );
};

export default Termination;
