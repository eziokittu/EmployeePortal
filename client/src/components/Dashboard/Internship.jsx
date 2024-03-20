import React, {useState, useEffect, useContext} from "react";
import JobItem from "../Common/JobItem";
import ReactPaginate from "react-paginate";
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const Internship = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const internshipsDisplayedPerPage = 2;

  // declaring states
  const [selectedDomain, setSelectedDomain] = useState("-"); // "-" refers to all the domains
  const [resetSelectedDomain, setResetSelectedDomain] = useState(false);
  const [projectDomains, setProjectDomains] = useState();
  const [loadedInternships, setLoadedInternships] = useState();
  const [internshipCount, setInternshipCount] = useState();
  const [allInternshipCount, setAllJnternshipCount] = useState(0);

  // handling the pagination
  const [pageCount, setPageCount] = useState();
  const [page, setPage] = useState(0);
  const handlePageClick = (num) => {
    setPage(num);
  };

  // Function to fetch the project domains
  const fetchProjectDomains = async event => {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/domains/get`
      );
      if (responseData.ok===1){
        setProjectDomains(responseData.domains);
      }
    } catch (err) {
      console.log("Error in fetching domains: "+err);
    }
  };

  // function to fetch all the internships
  const fetchAllInternships = async event => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/offers/get/internships/-?page=${page}`
      );
      if (responseData.ok===1){
        setLoadedInternships(responseData.internships);
      }
      else{
        console.log(responseData.message);
      }
    } catch (err) {
      console.error(`ERROR fetching internships`, err);
    }
  };

  // function to fetch all the internship count
  const fetchInternshipCount = async () => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/offers/get/internshipcount`
      );
      if (responseData.ok===1){
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
  
  // Initial fetch
  useEffect(() => {
    // function to fetch all the internship count
    const fetchAllInternshipCount = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/offers/get/internshipcount`
        );
        if (responseData.ok===1){
          setInternshipCount(responseData.count);
          setAllJnternshipCount(responseData.count)
          setPageCount(Math.ceil(responseData.count / internshipsDisplayedPerPage));
        }
        else{
          console.log(responseData.message);
        }
      } catch (err) {
        console.error(`ERROR fetching internship count`, err);
      }
    }; 
    if (selectedDomain === "-") {
      fetchProjectDomains();
      fetchAllInternshipCount();
      console.log("Fetching all project domains:");
    }
  }, []);

  // Initial fetch + fetches on page change
  useEffect(() => {
    if (selectedDomain === "-") {
      fetchInternshipCount();
      fetchAllInternships();
      console.log("Fetching internship count and all internships");
      setResetSelectedDomain(false);
    }
  }, [resetSelectedDomain, page]);
  
  // function to fetch internships by domain
  const fetchInternshipsByDomain = async selectedDomain => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/offers/get/internships/${selectedDomain}?page=${page}`
      );
      if (responseData.ok===1){
        setLoadedInternships(responseData.internships);
      }
      else{
        console.log(responseData.message);
      }
    } catch (err) {
      console.error(`ERROR fetching internships`, err);
    }
  };

  // function to fetch internship count by domain
  const fetchInternshipCountByDomain = async selectedDomain => {
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL + `/offers/get/internshipcount/${selectedDomain}`
      );
      if (responseData.ok===1){
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

  // runs on changin domain or page
  useEffect(() => {
    // selectedDomain is "-" initially
    if (selectedDomain !== "-") {
      fetchInternshipsByDomain(selectedDomain);
      fetchInternshipCountByDomain(selectedDomain);
      console.log("Fetching internships and internship Count for domain: " + selectedDomain);
    }
  }, [selectedDomain, page]);

  return (
    <div className="p-4 sm:ml-64 bg-blue-50 min-h-[500px]">

      {/* Heading Section */}
      <div className="bg-white rounded-lg flex justify-between">
        <h1 className="p-4 text-2xl font-bold">{`Internship Opportunities [${allInternshipCount}]`}</h1>
      </div>

      {/* Select Domain checkbox */}
      <div className="mt-3 text-sm text-center">
        <div className="mb-2">Select a domain from below</div>
        <div className="flex space-x-4 text-center justify-center">
          <select 
            className="p-1"
            onChange={(e) => {
              setSelectedDomain(e.target.value);
              setPage(0);
            }}
          >
            {projectDomains && (
              projectDomains.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))
            )}
          </select>
          <button 
            className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 flex flex-col justify-center" 
            onClick={() => {
              setSelectedDomain("-");
              setResetSelectedDomain(true);
            }}
          >
            <p className="font-bold">Reset</p>
          </button>
        </div>
        {selectedDomain==='-' && (
          <div className="my-2">[Showing opportunities for all domains]</div>
        )}
        {selectedDomain!=='-' && (
          <div className="my-2">{`[Showing opportunities for Domain: ${selectedDomain}]`}</div>
        )}
      </div>

      {/* Internship Opportunities */}
      <div className="flex">
        <div className="mr-5">

          {/* All Internship */}
          <div className="flex gap-4">
          {loadedInternships && loadedInternships.map((item) => {
            return (
              <div key={item._id}>
                <JobItem
                  id={item._id}
                  heading={item.heading}
                  employee_salary={item.stipend}
                  date={item.date_end}
                  stipend={item.stipend}
                  domain={item.domain}
                  // isAdmin = {isAdmin}
                  isInternship = {true}
                  userIsAdmin = {auth.isAdmin}
                />
              </div>
            );
          })}
          </div>
        </div>
      </div>
      {!internshipCount && !auth.isAdmin && (
        <div className="flex flex-col p-4 text-lg text-center">
        <div>No Internship Opportunities available at the moment!</div>
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
