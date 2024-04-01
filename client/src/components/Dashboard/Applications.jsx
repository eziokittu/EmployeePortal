import React, {useEffect, useState} from 'react';
import ApplicationCard from '../Common/ApplicationCard';
import ReactPaginate from "react-paginate";
import { useHttpClient } from '../Backend/hooks/http-hook';
import { useParams } from 'react-router-dom';

function Applications() {
  const { oid } = useParams(); // Assuming you're correctly extracting the offer ID from the route params
	const { sendRequest } = useHttpClient();
  const applicationsDisplayedPerPage = 3;

  // fetching the no. of applications from mongoDB database for that offer
  const [appliedCount, setAppliedCount] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const fetchAppliedCount = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/applied/get/offer/count/${oid}`
        );
        if (responseData.ok === 1) {
          setAppliedCount(responseData.count);
          setPageCount(Math.ceil(responseData.count / applicationsDisplayedPerPage))
          console.log("Successful in fetching application count!");
        }
        else{
          console.log("Error in getting application count!");
        }
      } catch (err) {
        console.log("Error in fetching application count: "+err);
      }
    };
    fetchAppliedCount();
  }, []);

  // handling the pagination
  const [page, setPage] = useState(0);
  const handlePageClick = (num) => {
    setPage(num);
  };

  // fetching all the application details from the mongoDB database
  const [isaJob, setIsaJob] = useState(false);
  const [applications, setApplications] = useState();
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/applied/get/offer/${oid}?page=${page}`
        );
        if (responseData.ok === 1){
          setApplications(responseData.applied);
          setIsaJob(responseData.isJob);
          console.log("Successful in fetching applications");
        }
        else {
          console.log(responseData.message);
        }
      } catch (err) {
        console.log("Error in fetching applications for this offer: "+err);
      }
    };
    fetchApplications();
  }, [sendRequest, page]);

  return (
    <div className="p-4 sm:ml-64 min-h-[500px]">
      <div className='px-4 border-2 bg-gray-100 border-gray-200 rounded-lg'>
        {/* Heading */}
        {pageCount>0 ? (
          <div className='text-2xl font-bold text-center my-8'>View Applications</div>
        ) : (
          <div className='text-2xl font-bold text-center py-12'>No applications found!</div>
        )}

        {/* Content */}
        {pageCount>0 && (
        <div className='flex flex-col text-center bg-blue-50 border-2 border-gray-300 rounded-lg p-4'>
          {/* Heading */}
          <div className='grid grid-cols-12 bg-blue-600 text-white rounded-lg p-4 w-full'>
            <div className='col-span-1 border-r-2'>Status</div>
            <div className='col-span-2 border-r-2'>Name</div>
            <div className='col-span-2 border-r-2'>Email</div>
            <div className='col-span-3 border-r-2'>Reference ID</div>
            <div className='col-span-4'>Actions</div>
          </div>
          
          {/* Body */}
          {applications && applications.map((application) => {
            return (
              <div key={application.id}>
                <ApplicationCard 
                  isJob = {isaJob}
                  data = {application}
                />
              </div>
            );
          })}
        </div>
        )}

        {/* Pagination */}
        {pageCount>0 && (
        <div className='justify-center items-center flex'>    
          <ReactPaginate
            previousLabel={"previous"}
            nextLabel={"next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={(selected) => handlePageClick(selected.selected)}
            containerClassName={"inline-flex -space-x-px text-sm justify-content-center items-center mt-4 mb-4"}
            pageLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700"}
            previousLinkClassName={"flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-blue-100 hover:text-blue-700"}
            nextClassName={"page-item"}
            nextLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-blue-100 hover:text-blue-700"}
            breakLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-700 "}
          />
        </div>
        )}
      </div>
    </div>
  )
}

export default Applications;