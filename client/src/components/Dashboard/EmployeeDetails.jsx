import React, { useState, useEffect, useContext } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const EmployeeDetails = () => {
	const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

	// fetching the employee details
  const [employeeDetails, setEmployeeDetails] = useState();
  useEffect(() => {
    const fetchEmployeeDetais = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/users/emp/id/${auth.userId}`
        );
        if (responseData.ok === 1) {
          setEmployeeDetails(responseData.employee);
          console.log("Successful in fetching employee details!");
        }
        else{
          console.log("Error in fetching employee details!");
        }
      } catch (err) {
        console.log("Some error occured: "+err);
      }
    };
    fetchEmployeeDetais();
  }, []);
	
  const [employeeDomain, setEmployeeDomain] = useState("-");
	useEffect(() => {
    const fetchEmployeeDomain = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/domains/get/${employeeDetails.domain}`
        );
        if (responseData.ok === 1) {
          setEmployeeDomain(responseData.domain);
          console.log("Successful in fetching employee domain!");
        }
        else{
          console.log("Error in fetching employee domain!");
        }
      } catch (err) {
        console.log("Some error occured: "+err);
      }
    };
    fetchEmployeeDomain();
    // fetchEmployeeProjects();
  }, [employeeDetails]);

  const [employeeProjects, setEmployeeProjects] = useState();
	useEffect(() => {
    const fetchEmployeeProjects = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/projects/emp/all/${auth.userId}`
        );
        if (responseData.ok === 1) {
          setEmployeeProjects(responseData.projects);
          console.log("Successful in fetching employee projects!");
        }
        else{
          console.log("Error in fetching employee projects!");
        }
      } catch (err) {
        console.log("Some error occured: "+err);
      }
    };
    fetchEmployeeProjects();
  }, [employeeDetails]);

	const openProject = () => {
		alert('Project Details will be shown here');
	}

	return (
		<div className="p-4 sm:ml-64">
			{employeeDetails && (
			<div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">

				{/* Heading */}
				<h1 className='text-center p-4 mb-2 font-bold text-3xl'>Employee Details</h1>

				{/* card starts */}
				<div className="grid grid-cols-3 p-4 mb-8 rounded bg-gray-100 dark:bg-gray-800">

					{/* Employee Image */}
					<div className="flex items-start h-72 w-100 mr-4 bg-white border border-gray-200 rounded-lg shadow justify-between text-center">
						<div className="w-full max-w-sm ">
							<div className="flex flex-col items-center justify-center pb-5 pt-5">
								<img className="w-48 h-48 mb-3 mt-3 rounded-full shadow-lg" src={`${import.meta.env.VITE_ASSETS_URL}/${auth.image}`} alt="employee image" />
							</div>
						</div>
					</div>

					{/* Employee Details */}
					<div className='col-span-2 text-white w-100 h-72 bg-employeeBg bg-no-repeat bg-center rounded-lg shadow'>

						{/* name */}
						<h5 className="ml-8 mt-8 mb-4 text-2xl lg:text-3xl font-bold">
							<span>{auth.firstname}</span>
							<span className='pl-4'>{auth.lastname}</span>
						</h5>

						{/* Role / Designation  */}
						{employeeDomain && (
							<h2 className="ml-8 mb-4 text-2xl font bold">Domain: {employeeDomain.name}</h2>
						)}

						{/* Joining Date */}
						<span className="pl-8 mb-4 text-lg font bold">{employeeDetails.date.split('T')[0]} - Present</span> <br />
						
						{/* Reference ID */}
						<span className="pl-8 my-4 text-lg font bold">RefID: {employeeDetails.ref}</span>

						{/* Mobile No */}
						<button href="#" className="flex justify-between items-center ml-8 mt-2 px-4 py-2 text-sm font-medium text-center text-white  bg-blue-700 rounded-lg hover:bg-blue-800 ">
							<svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 32 32" id="Phone"><path d="M13.216 8.064c-.382-4.394-4.966-6.55-5.16-6.638a.974.974 0 0 0-.582-.078c-5.292.878-6.088 3.958-6.12 4.086a.99.99 0 0 0 .02.54c6.312 19.584 19.43 23.214 23.742 24.408.332.092.606.166.814.234a.99.99 0 0 0 .722-.042c.132-.06 3.248-1.528 4.01-6.316a.997.997 0 0 0-.096-.612c-.068-.132-1.698-3.234-6.218-4.33a.977.977 0 0 0-.884.21c-1.426 1.218-3.396 2.516-4.246 2.65-5.698-2.786-8.88-8.132-9-9.146-.07-.57 1.236-2.572 2.738-4.2a.998.998 0 0 0 .26-.766z" fill="#ffffff"></path></svg>
							<span className='ms-3 text-md'>{employeeDetails.phone}</span>
						</button>

						{/* Email */}
						<button href="#" className="flex justify-between items-center ml-8 mt-2 px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 ">
							<svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 128 96" id="Email"><g data-name="Layer 2" fill="#ffffff" className="color000000 svgShape"><path d="M0 11.283V8a8 8 0 0 1 8-8h112a8 8 0 0 1 8 8v3.283l-64 40zm66.12 48.11a4.004 4.004 0 0 1-4.24 0L0 20.717V88a8 8 0 0 0 8 8h112a8 8 0 0 0 8-8V20.717z" fill="#ffffff" className="color000000 svgShape"></path></g></svg>
							<span className='ms-3 text-md'> {auth.email}</span>
						</button>
					</div>

				</div>

				{/* Projects Starts */}
				<div className="grid grid-cols-2 gap-4 mb-4">
					{/* Project Item start*/}
					<div className="flex items-center justify-around rounded-xl bg-gray-100 p-8 dark:bg-gray-800">
						<div className='bg-indigo-300 h-10 w-10 rounded-lg'></div>
						<div>
							{/* project heading */}
							<h2 className='text-3xl font-bold'>Project 1</h2>
							{/* Project Description */}
							<p>Make your Product be the first on the searching result</p>
						</div>
						{/* arrow button */}
						{/* <div onClick={openProject}>
							<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 0 64 64" id="Arrow"><path fill="#151616" d="m-210.9-289-2-2 11.8-11.7-11.8-11.7 2-2 13.8 13.7-13.8 13.7" transform="translate(237 335)" className="color134563 svgShape"></path></svg>
						</div> */}
					</div>

				</div>

			</div>
			)}
		</div>
	)
}

export default EmployeeDetails
