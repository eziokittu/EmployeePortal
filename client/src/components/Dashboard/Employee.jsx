import React, { useState, useEffect } from 'react'

import EmployeeCard from "../Common/EmployeeCard"
import ReactPaginate from "react-paginate";
import { useHttpClient } from '../Backend/hooks/http-hook';

const Employee = () => {
	const { sendRequest } = useHttpClient();
  const employeesDisplayedPerPage = 3;

  // fetching the no. of employees from mongoDB database
  const [employeeCount, setEmployeeCount] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  useEffect(() => {
    const fetchEmployeeCount = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/users/empcount`
        );
        setEmployeeCount(responseData.employeeCount);
        setPageCount(Math.ceil(responseData.employeeCount / employeesDisplayedPerPage))
      } catch (err) {
        console.log("Error in fetching employee count: "+err);
      }
    };
    fetchEmployeeCount();
  }, []);

  // handling the pagination
  const [page, setPage] = useState(0);
  const handlePageClick = (num) => {
    setPage(num);
  };

  // fetching all the employee details from the mongoDB database
  const [loadedEmployees, setLoadedEmployees] = useState();
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/users/emp?page=${page}`
        );
        setLoadedEmployees(responseData.employees);
      } catch (err) {
        console.log("Error in fetching employees: "+err);
      }
    };
    fetchEmployees();
  }, [sendRequest, page]);

  // getting the employee details when an employee is selected
  // const [empDetails, setEmpDetails] = useState('');
  // const handleEmployeeClick = (details) => {
  //   setEmpDetails(details);
  //   // console.log(empDetails.image);
  // };

	return (
		<div className="p-4 sm:ml-64">
			<div className="p-4 border-2 bg-slate-200 border-gray-200 rounded-lg">
				<div className="grid grid-cols-3 gap-4 mb-4">
					{loadedEmployees && loadedEmployees.map((employee) => {
						return (
							<div key={employee.id}>
								<EmployeeCard 
									name={employee.firstname +' '+ employee.lastname} 
									date={employee.date.split('T')[0]} 
									role={employee.role}
									username={employee.userName}
									email={employee.email}
									projects={employee.projects_complete}
									empImg={employee.image}
								/>
							</div>
						);
					})}
				</div>

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
				containerClassName={"inline-flex -space-x-px text-sm justify-content-center items-center mt-4 mb-4"}
				pageLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700"}
				previousLinkClassName={"flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-blue-100 hover:text-blue-700"}
				nextClassName={"page-item"}
				nextLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-blue-100 hover:text-blue-700"}
				breakLinkClassName={"flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-blue-100 hover:text-blue-700 "}
			/>
      </div>
		</div>
	)
}

export default Employee
