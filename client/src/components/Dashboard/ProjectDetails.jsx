import React, { useState, useContext, useEffect } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';
import { useParams } from 'react-router-dom';

import title from '../../assets/project/project-title.png'
import date from '../../assets/project/date.png'
import srs from '../../assets/project/srs.png'
import document from '../../assets/project/document.png'
import status from '../../assets/project/status.png'

// import { Viewer, Worker } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";

const ProjectDetails = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const { pid } = useParams();

  const [loadedProject, setLoadedProject] = useState();
  // Function to fetch project with ID and the project domain
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects/project/${pid}`
        );
        if (responseData.ok === 1) {
          setLoadedProject(responseData.project);

          // console.log(loadedProject.srs, import.meta.env.VITE_USER_DEFAULT_SRS_PATH);
        }
        else {
          console.log("No project found!");
        }
      } catch (err) {
        console.log("Error in fetching project: " + err);
      }
    };
    fetchProject();
  }, []);

  const [loadedDomain, setLoadedDomain] = useState();
  // Function to fetch project domain
  useEffect(() => {
    const fetchProjectDomainName = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/domains/get/project/${pid}`
        );
        if (responseData.ok === 1) {
          setLoadedDomain(responseData.domain);
        }
        else {
          console.log("Error in setting domain");
        }
      } catch (err) {
        console.log("Error in fetching domain " + err);
      }
    };
    fetchProjectDomainName();
  }, [loadedProject]);

  const [updateRoleClicked, setUpdateRoleClicked] = useState(false);
  const [allRoles, setAllRoles] = useState();
  // Function to fetch all roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/roles/get`
        );
        if (responseData.ok === 1) {
          setAllRoles(responseData.roles);
        }
        else {
          console.log("Error in setting roles");
        }
      } catch (err) {
        console.log("Error in fetching roles " + err);
      }
    };
    fetchRoles();
  }, []);

  // fetching all the employee details from the mongoDB database
  const [loadedEmployees, setLoadedEmployees] = useState();
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + `/users/employees/project/${pid}`
        );
        if (responseData.ok === 1) {
          setLoadedEmployees(responseData.employees);
          setUpdateRoleClicked(false); // reset the state
        }
        else {
          console.log(responseData.message)
        }
      } catch (err) {
        console.log("Error in fetching employees: " + err);
      }
    };
    fetchEmployees();
  }, [loadedProject, updateRoleClicked]);

  // State to manage the section of the project details
  const [section, setSection] = useState('overview');

  const updateEmployeeRole = async (role, empId) => {
    try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/edit/role/${empId}`,
				'PATCH',
				JSON.stringify({
					role: role
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      if (responseData.ok===1){
        console.log("updated employee role");
        setUpdateRoleClicked(true);
      }
		} catch (err) {
			console.log('ERROR updating employee role');
		}  
  }

  const removeEmployeeHandler = async (empId) => {
    try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/projects/patch/remove/employee`,
				'PATCH',
				JSON.stringify({
					empId: empId,
          projectId: pid
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      if (responseData.ok===1){
        console.log("removed employee from project");
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
		} catch (err) {
			console.log('ERROR removing employee from project');
		} 
  }

  const [newEmployeeEmail, setNewEmployeeEmail] = useState();
  const [newEmployeeRef, setNewEmployeeRef] = useState();
  const [searchedEmployee, setSearchedEmployee] = useState();
  const [searchedEmployeeDomain, setSearchedEmployeeDomain] = useState();
  
  // function to fetch employee details by searching with Email
  const searchEmployeeByEmail = async (newEmployeeEmail) => {
    try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/emp/search/email/${newEmployeeEmail}`
			);
      if (responseData.ok===1){
        console.log("Successfully fetched employee details with search email");
        setSearchedEmployee(responseData.employee);
      }
		} catch (err) {
      alert("No match found for any employee!")
			console.log('ERROR in searching employee with email');
		} 
  }

  // function to fetch employee details by searching with Ref ID
  const searchEmployeeByRef = async (newEmployeeRef) => {
    try {
      let modifiedRefID = newEmployeeRef.replace(/\//g, ':');
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/emp/search/ref/${modifiedRefID}`
			);
      if (responseData.ok===1){
        console.log("Successfully fetched employee details with search ref ID");
        setSearchedEmployee(responseData.employee);
      }
		} catch (err) {
      alert("No match found for any employee!")
			console.log('ERROR in searching employee with Ref ID');
		} 
  }

  // function to clear the assign employee form
  const clearAssignHandler = async () => {
    setSearchedEmployee();
    // setNewEmployeeRef();
    // setNewEmployeeEmail();
  }
  
  // function to assign employee with emp id
  const submitAssignHandler = async () => {
    try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/projects/patch/addemployees-id/${pid}`,
				'PATCH',
				JSON.stringify({
					"employees": [
            `${searchedEmployee._id}`
          ]
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      if (responseData.ok===1){
        console.log("Added searched employee to project");
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
		} catch (err) {
			console.log('ERROR adding employee to project');
		}
  }

  // Function to fetch searched employee domain 
  useEffect(() => {
    const fetchSearchedEmployeeDomain = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/domains/get/${searchedEmployee.domain}`
        );
        if (responseData.ok === 1) {
          setSearchedEmployeeDomain(responseData.domain);
        }
        else {
          console.log("Error in setting domain name for searched employee");
        }
      } catch (err) {
        console.log("Error in fetching domain " + err);
      }
    };
    fetchSearchedEmployeeDomain();
  }, [searchedEmployee]);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">

        {/* Top Section */}
        <div className="bg-gray-100 rounded-xl text-center">
          {/* Headings and buttons to navigate between the overview and team sections */}
          <h1 className="text-4xl font-bold pb-8 pt-14">Project Details</h1>
          <p className="text-lg">Details of the current Project</p>

          {/* Buttons - Overview, Team */}
          <div className="flex justify-center items-center gap-4 pt-8 pb-14">
            <button
              onClick={() => setSection('overview')}
              className={`flex justify-center items-center w-40 text-white font-bold py-2 px-4 rounded-xl ${section === 'overview' ? 'bg-primary-600 hover:bg-blue-600' : 'bg-gray-400'}`}

            // className="flex justify-center items-center bg-primary-600 w-40 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl"
            >
              Overview
            </button>
            <button
              onClick={() => setSection('team')}
              className={`flex justify-center items-center w-40 text-white font-bold py-2 px-4 rounded-xl ${section === 'team' ? 'bg-primary-600 hover:bg-blue-600' : 'bg-gray-400'}`}

            // className="flex justify-center items-center bg-primary-600 w-40 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl"
            >
              Team Members
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        {section === 'overview' ? (
          //Overview Section
          <>
            {loadedDomain && loadedProject && (
              <div className="bg-gray-100 rounded-xl mt-8">
                {/* Heading */}
                <h1 className="text-3xl font-bold pb-8 pt-14 text-center">Project Overview</h1>
                <p className="text-lg text-center">Details of the current Project</p>

                <div className="grid grid-cols-2 gap-4 pt-8 pb-14 mx-20">
                  {/* Project Title */}
                  <div className="flex justify-start bg-white border-2 border-gray-400 rounded-xl">
                    <div className='mx-4 my-4'>
                      <img src={title} className='w-100' alt="" />
                    </div>
                    <div className='my-auto '>
                      <h2 className='text-xl font-semibold'>Title</h2>
                      <p className=''>{loadedProject.title}</p>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="flex justify-start bg-white border-2 border-gray-400 rounded-xl">
                    <div className='mx-4 my-4'>
                      <img src={document} className='w-100' alt="" />
                    </div>
                    <div className='my-auto '>
                      <h2 className='text-xl font-semibold'>Description</h2>
                      <p className=''>
                        {loadedProject.description}
                      </p>
                    </div>
                  </div>

                  {/* Project Start Date */}
                  <div className="flex justify-start bg-white border-2 border-gray-400 rounded-xl">
                    <div className='mx-4 my-4'>
                      <img src={date} className='w-100' alt="" />
                    </div>
                    <div className='my-auto '>
                      <h2 className='text-xl font-semibold'>Start Date</h2>
                      <p className='text-lg'>{loadedProject.date_start.split('T')[0]}</p>
                    </div>
                  </div>

                  {/* Project End Date */}
                  <div className="flex justify-start bg-white border-2 border-gray-400 rounded-xl">
                    <div className='mx-4 my-4'>
                      <img src={date} className='w-100' alt="" />
                    </div>
                    <div className='my-auto '>
                      <h2 className='text-xl font-semibold'>End Date</h2>
                      <p className='text-lg'>{loadedProject.date_end.split('T')[0]}</p>
                    </div>
                  </div>

                  {/* Project Status */}
                  <div className="flex justify-start bg-white border-2 border-gray-400 rounded-xl">
                    <div className='mx-4 my-4'>
                      <img src={status} className='w-100' alt="" />
                    </div>
                    <div className='my-auto '>
                      <h2 className='text-xl font-semibold'>Status</h2>
                      <p className='text-lg' >{loadedProject.isCompleted === true ? 'Completed' : 'Ongoing'}</p>
                    </div>
                  </div>

                  {/* Project SRS Document */}
                  <>
                    {!auth.isTerminated && (
                      <a 
                        href={`${import.meta.env.VITE_ASSETS_URL}/${loadedProject.srs}`} target="_blank" rel="noopener noreferrer"
                        className="cursor-pointer flex justify-start bg-white border-2 border-gray-400 rounded-xl"
                      >
                        <div className='mx-4 my-4'>
                          <img src={srs} className='w-100' alt="" />
                        </div>
                        <div className='my-auto'>
                          <h2 
                            className='text-lg font-semibold'
                          >SRS Document
                          </h2>
                        </div>
                      </a>
                    )}
                    {auth.isTerminated && (
                      <div 
                        onClick={()=>{alert("You are not permitted to access the SRS document!")}}
                        className="flex justify-start bg-white border-2 border-gray-400 rounded-xl cursor-pointer"
                      >
                        <div className='mx-4 my-4'>
                          <img src={srs} className='w-100' alt="" />
                        </div>
                        <div className='my-auto'>
                          <h2 
                            className='text-lg font-semibold'
                          >SRS Document
                          </h2>
                        </div>
                      </div>
                    )}
                  </>
                </div>
              </div>
            )}
            {!loadedDomain || !loadedProject && (
              <div className="bg-gray-100 rounded-xl mt-8">
                <p className="text-2xl font-bold pb-8 pt-14 text-center">Loading Project Details...</p>
              </div>
            )}
          </>

        ) : (
          // Team Section
          <>
            <div className="bg-gray-100 rounded-xl mt-8 py-8">
              {/* Heading Section */}
              {!loadedEmployees && (
              <h1 className="text-2xl font-bold text-center my-2">No Employees assigned yet to the project</h1>
              )}
              {loadedEmployees && (
                <div className='px-8'>
                  <h1 className="text-3xl font-bold text-center my-2">Project Members</h1>
                  {/* Employee Card  Heading*/}
                  <div className={`${auth.isAdmin===true ? 'grid-cols-5' : 'grid-cols-4'} grid gap-5 bg-primary-600 text-white shadow-gray-300 shadow-xl rounded-t-lg p-4 rounded-lg mb-4 w-full`}>
                    <div className='flex justify-center items-center col-span-1'>
                      <h2 className="text-sm font-bold">Name</h2>
                    </div>
                    <div className='flex justify-center items-center col-span-1'>
                      <h2 className="text-sm font-bold">Reference ID</h2>
                    </div>
                    <div className='flex justify-center items-center col-span-1'>
                      <h2 className="text-sm font-bold">Email</h2>
                    </div>
                    <div className='flex justify-center items-center col-span-1'>
                      <h2 className="text-sm font-bold">Project Role</h2>
                    </div>
                    {auth.isAdmin===true && (
                    <div className='flex justify-center items-center col-span-1'>
                      <h2 className="text-sm font-bold">Actions</h2>
                    </div>
                    )}
                  </div>
                </div>
              )}

              {/* Body section */}
              <div className='px-8'>
                {/* Employee Cards */}
                {loadedEmployees && loadedEmployees.map(emp => (
                  <div className={`grid ${auth.isAdmin===true ? 'grid-cols-5' : 'grid-cols-4'} bg-white drop-shadow-lg rounded-lg p-6 w-full mb-4`}>
                    {/* Employee Name */}
                    <div className='flex justify-center items-center'>
                      <h2 className="text-lg font-bold text-black">{emp.firstname + ' ' + emp.lastname}</h2>
                    </div>
                    {/* Employee ID */}
                    <div className='flex justify-center items-center'>
                      <p className="text-black font-bold">{emp.ref}</p>
                    </div>
                    {/* Employee Email */}
                    <div className='flex justify-center items-center'>
                      <p className="text-black font-bold">{emp.email}</p>
                    </div>
                    {/* Employee Role */}
                    {auth.isAdmin ? (
                      <div className='flex justify-center items-center'>
                        {allRoles && (
                          <select
                            className='border-2 border-gray-200 rounded-lg m-2 p-2'
                            defaultValue={emp.role}
                            value={emp.role} 
                            onChange={e => updateEmployeeRole(e.target.value, emp._id)}
                          >
                            {allRoles.map(r => (
                              <option key={r.id} value={r.name}>{r.name}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    ) : (
                      <div className='flex justify-center items-center'>
                        <p className="text-black font-bold">{emp.role}</p>
                      </div>
                    )}
                    {/* Employee Remove Button */}
                    {auth.isAdmin && (
                    <div className='flex justify-center items-center'>
                      <button 
                        onClick={()=>(removeEmployeeHandler(emp._id))}
                        className="p-2 rounded-xl bg-red-500 hover:bg-red-800 text-white font-bold"
                      >Remove</button>
                    </div>
                    )}
                    
                  </div>
                ))}

                {/* ADMIN view only */}
                {auth.isAdmin && (
                <div className='text-center text-xl font-bold mb-2 mt-16'>Assign a new Employee to this project</div>
                )}
                {/* Assign new Employee */}
                {auth.isAdmin && (
                <div className={`grid grid-cols-10 bg-white drop-shadow-lg rounded-lg p-6 w-full mb-4`}>

                  {/* Employee Details */}
                  <div className='col-span-2 flex flex-col justify-center items-center bg-gray-100 rounded-lg p-2 border-2 border-gray-300'>
                    <h2 className="text-lg text-black underline underline-offset-4">Employee Details</h2>
                    {!!searchedEmployee && searchedEmployeeDomain && (
                    <div className='text-black text-sm text-center'>
                      <p className=" ">{`${searchedEmployee.firstname} ${searchedEmployee.lastname}`}</p>
                      <p className=" ">{`${searchedEmployee.phone}`}</p>
                      <p className=" ">{`${searchedEmployeeDomain.name}`}</p>
                      <p className=" ">{`${searchedEmployee.ref}`}</p>
                    </div>
                    )}
                    {!searchedEmployee && (
                    <div className='text-black text-sm text-center'>
                      <p className=" ">Search an employee</p>
                      <p className=" ">using Reference ID</p>
                      <p className=" ">or Email and <span className='font-bold'>Assign!</span></p>
                    </div>
                    )}
                  </div>

                  {/* Employee Ref ID */}
                  <div className='mx-2 col-span-3 flex flex-col justify-center items-center border-2 border-gray-100 bg-gray-50 rounded-lg p-2'>
                    <label htmlFor="search_ref">Search by Ref ID</label>
                    <input
                      onChange={(event) => setNewEmployeeRef(event.target.value)}
                      type="text"
                      id="search_ref"
                      value={newEmployeeRef}
                      placeholder={'Enter Reference ID'}
                      className="block w-full h-8 my-1 px-2 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button 
                      onClick={()=>(searchEmployeeByRef(newEmployeeRef))}
                      className='bg-green-500 hover:bg-green-800 text-white px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-gray-600'
                    >Search</button>
                  </div>

                  {/* Employee Email */}
                  <div className='mx-2 col-span-3 flex flex-col justify-center items-center border-2 border-gray-100 bg-gray-50 rounded-lg p-2'>
                    <label htmlFor="search_email">Search by Email</label>
                    <input
                      onChange={(event) => setNewEmployeeEmail(event.target.value)}
                      type="text"
                      id="search_email"
                      value={newEmployeeEmail}
                      placeholder={'Enter Email'}
                      className="block w-full h-8 my-1 px-2 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                    <button 
                      onClick={()=>(searchEmployeeByEmail(newEmployeeEmail))}
                      className='bg-green-500 hover:bg-green-800 text-white px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-gray-600'
                    >Search</button>
                  </div>

                  {/* Buttons */}
                  <div className='col-span-2 flex flex-col justify-around items-center border-2 border-gray-100 bg-gray-50 rounded-lg p-2'>
                    <button 
                      disabled={!searchedEmployee}
                      onClick={submitAssignHandler}
                      className={`px-3 py-1 rounded-xl ${searchedEmployee ? 'bg-green-500 hover:bg-green-800' : 'bg-gray-400'} text-white font-bold`}
                    >Assign</button>
                    <button 
                      onClick={clearAssignHandler}
                      className="px-3 py-1 rounded-xl bg-gray-400 hover:bg-gray-600 text-white font-bold"
                    >Clear</button>
                  </div>
                  
                </div>
                )}
              </div>
            </div>
            {!loadedDomain || !loadedProject && (
              <div className="bg-gray-100 rounded-xl mt-8 pb-8">
                <p className="text-2xl font-bold pb-8 pt-14 text-center">Loading Project Team Members...</p>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default ProjectDetails