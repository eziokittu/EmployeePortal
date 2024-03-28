import React, { useState, useContext, useEffect } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';
import { useParams } from 'react-router-dom';

import title from '../../assets/project/project-title.png'
import date from '../../assets/project/date.png'
import srs from '../../assets/project/srs.png'
import document from '../../assets/project/document.png'
import status from '../../assets/project/status.png'

import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const ProjectDetails = ({ task, taskDomain }) => {
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

        {/* Middle Section */}
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
                  <a 
                    href={`${import.meta.env.VITE_ASSETS_URL}/${loadedProject.srs}`} target="_blank" rel="noopener noreferrer"
                    className="flex justify-start bg-white border-2 border-gray-400 rounded-xl"
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
            {loadedEmployees && (
              <div className="bg-gray-100 rounded-xl mt-8 py-8">
                {/* Heading Section */}
                {/* <h1 className="text-3xl font-bold pb-8 pt-14 text-center">Current Project Team</h1> */}
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

                {/* Body section */}
                <div className='px-8'>
                  {/* Employee Cards */}
                  {loadedEmployees.map(emp => (
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
                        <button className="p-2 rounded-xl bg-red-500 hover:bg-red-800 text-white font-bold">Remove</button>
                      </div>
                      )}
                      
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!loadedDomain || !loadedProject && (
              <div className="bg-gray-100 rounded-xl mt-8 pb-8">
                <p className="text-2xl font-bold pb-8 pt-14 text-center">Loading Project Team Members...</p>
              </div>
            )}
          </>
        )}

        {/* Bottom Section - PDF viewer - removed cuz not working*/}

      </div>
    </div>
  )
}

export default ProjectDetails