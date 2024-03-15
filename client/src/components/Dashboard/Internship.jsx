import React, {useState, useEffect, useContext} from "react";
import JobItem from "../Common/JobItem";
import ReactPaginate from "react-paginate";
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const Internship = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const internshipsDisplayedPerPage = 2;

  const [loadedInternships, setLoadedInternships] = useState();
  const fetchInternships = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/offers/get/internships?page=${page}`
      );
      if (responseData && responseData.ok===1){
        setLoadedInternships(responseData.internships);
      }
      else{
        console.log(responseData.message);
      }
    } catch (err) {
      console.error(`ERROR fetching internships`, err);
    }
  };
  const [internshipCount, setInternshipCount] = useState();
  const fetchInternshipCount = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/offers/get/internshipcount`
      );
      if (responseData && responseData.ok===1){
        setInternshipCount(responseData.count);
        setPageCount(Math.ceil(responseData.count / internshipsDisplayedPerPage));
      }
      else{
        console.log(responseData.message);
      }
    } catch (err) {
      console.error(`ERROR fetching internship count`, err);
    }
  };

  // handling the pagination
  const [pageCount, setPageCount] = useState();
  const [page, setPage] = useState(0);
  const handlePageClick = (num) => {
    setPage(num);
  };

  useEffect(() => {
    fetchInternshipCount();
    fetchInternships();
  }, [sendRequest, page]);

  return (
    <div className="p-4 sm:ml-64 bg-blue-50 min-h-[500px]">

      {/* Heading Section */}
      <div className="bg-white rounded-lg flex justify-between">
        <h1 className="p-4 text-2xl font-bold">{`Internship Opportunities (${internshipCount})`}</h1>
        <p className="text-gray-400  text-4xl pr-6">...</p>
      </div>

      {/* Job Section */}
      <div className="flex">
        <div className="mr-5">
          <div className="flex gap-4">
          {loadedInternships && loadedInternships.map((item) => {
            return (
              <div key={item.id}>
                <JobItem
                  id={item.id}
                  heading={item.heading}
                  employee_salary={item.stipend}
                  date={item.date_posted}
                  stipend={item.stipend}
                  domain={item.domain}
                  userIsAdmin = {auth.isAdmin}
                  isInternship = {true}
                />
              </div>
            );
          })}
          </div>
        </div>
      </div>
      {!internshipCount && !auth.isAdmin && (
        <div className="flex flex-col p-4 text-lg text-center">
        <div>No Job Opportunities available at the moment!</div>
        <div>Keep in touch!</div>
        </div>
      )}
      {!internshipCount && auth.isAdmin && (
        <div className="flex flex-col p-4 text-lg text-center">
        <div>No Internship Opportunities.</div>
        <div>Create a new opportunity above!</div>
        </div>
      )}

      {/* Pagination */}
      <div className='flex justify-center items-center'>
        {!!internshipCount && (
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

export default Internship;
