import React, { useState, useEffect } from "react";
import TerminationItem from "../Common/TerminationItem";
import ReactPaginate from "react-paginate";
import {useHttpClient} from '../Backend/hooks/http-hook';

const Termination = () => {
  const [chosen, setChosen] = useState('all');
  const handleParagraphClick = (option) => {
    setChosen(option);
    setPage(0);
  };

  const { sendRequest } = useHttpClient();

  const [loadedTerminations, setLoadedTerminations] = useState();
  const fetchTerminations = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/terminations/get/${chosen}?page=${page}`
      );
      if (chosen === 'all' || chosen === 'approved' || chosen === 'applied') {
        setLoadedTerminations(responseData.terminations);
      } 
    } catch (err) {
      console.error(`ERROR fetching ${chosen} terminations`, err);
    }
  };
  const [terminationCount, setTerminationCount] = useState(0);
  const fetchTerminationsCount = async () => {
    try {
      if (chosen === 'all' || chosen === 'approved' || chosen === 'applied') {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/terminations/get/${chosen}/count`
        );
        setTerminationCount(responseData.count);
        setPageCount(Math.ceil(responseData.count / terminationsDisplayedPerPage));
      } 
    } catch (err) {
      console.error(`ERROR fetching ${chosen} terminations count`, err);
    }
  };

  // handling the pagination
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const handlePageClick = (num) => {
    setPage(num);
  };

  const terminationsDisplayedPerPage = 2;
  // const [terminationCount, setTerminationCount] = useState(null);
  // Initially fetches all the terminations
  useEffect(() => {
    fetchTerminationsCount();
    fetchTerminations();
  }, [sendRequest, page, chosen]);

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
              }
            }
          >
            Approved
          </p>
          <p
            id="applied"
            className={`cursor-pointer mr-4 ${
              chosen === "pending" ? "chosen font-bold" : ""
            }`}
            onClick={
              () => {
                handleParagraphClick("applied");
              }
            }
          >
            Pending
          </p>
        </div>

        {/* Card for Terminations starts */}

        <div className="grid grid-cols-2 gap-4 mb-4">
          {loadedTerminations && (
            loadedTerminations.map((item)=>(
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
