import React, {useState, useEffect, useContext} from "react";
import JobItem from "../Common/JobItem";
import ReactPaginate from "react-paginate";
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const Jobs = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const jobsDisplayedPerPage = 2;

  const [loadedJobs, setLoadedJobs] = useState();
  const fetchJobs = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/offers/get/jobs?page=${page}`
      );
      if (responseData.ok===1){
        setLoadedJobs(responseData.jobs);
      }
      else{
        console.log(responseData.message);
      }
    } catch (err) {
      console.error(`ERROR fetching Jobs`, err);
    }
  };
  const [jobCount, setJobCount] = useState();
  const fetchJobCount = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/offers/get/jobcount`
      );
      if (responseData.ok===1){
        setJobCount(responseData.count);
        setPageCount(Math.ceil(responseData.count / jobsDisplayedPerPage));
      }
      else{
        console.log(responseData.message);
      }
    } catch (err) {
      console.error(`ERROR fetching Job count`, err);
    }
  };

  // handling the pagination
  const [pageCount, setPageCount] = useState();
  const [page, setPage] = useState(0);
  const handlePageClick = (num) => {
    setPage(num);
  };

  useEffect(() => {
    fetchJobCount();
    fetchJobs();
  }, [sendRequest, page]);

  return (
    <div className="p-4 sm:ml-64 bg-blue-50 min-h-[500px]">

      {/* Heading Section */}
      <div className="bg-white rounded-lg flex justify-between">
        <h1 className="p-4 text-2xl font-bold">{`Job Opportunities (${jobCount})`}</h1>
        <p className="text-gray-400  text-4xl pr-6">...</p>
      </div>

      {/* Job Opportunities */}
      <div className="flex">
        <div className="mr-5">

          {/* All Jobs */}
          <div className="flex gap-4">
          {loadedJobs && loadedJobs.map((item) => {
            return (
              <div key={item.id}>
                <JobItem
                  id={item.id}
                  heading={item.heading}
                  employee_salary={item.stipend}
                  date={item.date_end}
                  ctc={item.ctc}
                  domain={item.domain}
                  // isAdmin = {isAdmin}
                  isInternship = {false}
                  userIsAdmin = {auth.isAdmin}
                />
              </div>
            );
          })}
          </div>
        </div>
      </div>
      {!jobCount && !auth.isAdmin && (
        <div className="flex flex-col p-4 text-lg text-center">
        <div>No Job Opportunities available at the moment!</div>
        <div>Keep in touch!</div>
        </div>
      )}
      {!jobCount && auth.isAdmin && (
        <div className="flex flex-col p-4 text-lg text-center">
        <div>No Job Opportunities.</div>
        <div>Create a new opportunity above!</div>
        </div>
      )}

      {/* Pagination */}
      <div className='flex justify-center items-center'>
        {!!jobCount && (
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
        )}
      </div>
    </div>
  );
};

export default Jobs;
