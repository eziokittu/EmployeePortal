import React, {useState, useContext, useEffect} from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';
import { useParams } from 'react-router-dom';

import title from '../../assets/project/project-title.png'
import date from '../../assets/project/date.png'
import srs from '../../assets/project/srs.png'
import document from '../../assets/project/document.png'
import status from '../../assets/project/status.png'

const ProjectDetails = ({task, taskDomain}) => {
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
        if (responseData.ok===1){
          setLoadedProject(responseData.project);
        }
        else {
          console.log("No project found!");
        }
      } catch (err) {
        console.log("Error in fetching project: "+err);
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
        if (responseData.ok===1){
          setLoadedDomain(responseData.domain);
        }
        else {
          console.log("Error in setting domain");
        }
      } catch (err) {
        console.log("Error in fetching domain "+err);
      }
    };
    fetchProjectDomainName();
  }, [loadedProject]);

  // State to manage the section of the project details
  const [section, setSection] = useState('overview');
  

  // Function and states to view SRS pdf
  const [isSrsViewing, setIsSrsViewing] = useState(false);
  const [viewPdf, setViewPdf] = useState(null);
  const fileType = ["application/pdf"];
  useEffect(() => {
    if (viewPdf !== null && isSrsViewing) {
      setViewPdf(pdfFile);
    } else {
      setViewPdf(null);
    }
  }, [isSrsViewing]);

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
                    <div className='mx-6 my-4'>
                      <img src={title} className='w-100' alt="" />
                    </div>
                    <div className='my-auto '>
                      <h2 className='text-xl font-semibold'>Title</h2>
                      <p>{loadedProject.title}</p>
                    </div>
                  </div>

                  {/* Project Description */}
                  <div className="flex justify-start bg-white border-2 border-gray-400 rounded-xl">
                    <div className='mx-6 my-4'>
                      <img src={document} className='w-100' alt="" />
                    </div>
                    <div className='my-auto '>
                      <h2 className='text-xl font-semibold'>Description</h2>
                      <p>{loadedProject.description}</p>
                    </div>
                  </div>

                  {/* Project Start Date */}
                  <div className="flex justify-start bg-white border-2 border-gray-400 rounded-xl">
                    <div className='mx-6 my-4'>
                      <img src={date} className='w-100' alt="" />
                    </div>
                    <div className='my-auto '>
                      <h2 className='text-xl font-semibold'>Start Date</h2>
                      <p >{loadedProject.date_start.split('T')[0]}</p>
                    </div>
                  </div>

                  {/* Project End Date */}
                  <div className="flex justify-start bg-white border-2 border-gray-400 rounded-xl">
                    <div className='mx-6 my-4'>
                      <img src={date} className='w-100' alt="" />
                    </div>
                    <div className='my-auto '>
                      <h2 className='text-xl font-semibold'>End Date</h2>
                      <p >{loadedProject.date_end.split('T')[0]}</p>
                    </div>
                  </div>
                  
                  {/* Project Status */}
                  <div className="flex justify-start bg-white border-2 border-gray-400 rounded-xl">
                    <div className='mx-6 my-4'>
                      <img src={status} className='w-100' alt="" />
                    </div>
                    <div className='my-auto '>
                      <h2 className='text-xl font-semibold'>Status</h2>
                      <p >{loadedProject.isCompleted}</p>
                    </div>
                  </div>

                  {/* Project SRS Document */}
                  <div className="flex justify-start bg-white border-2 border-gray-400 rounded-xl">
                    <div className='mx-6 my-4'>
                      <img src={srs} className='w-100' alt="" />
                    </div>
                    <div className='my-auto '>
                      <h2 className='text-xl font-semibold'>SRS Document</h2>
                      <button 
                        className='bg-blue-500 p-4 hover:bg-blue-700 text-white'
                        onClick={()=>(setIsSrsViewing(!isSrsViewing))}
                      >View SRS PDF</button>
                    </div>
                  </div>
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
            {loadedDomain && loadedProject && (
              <div className="bg-gray-100 rounded-xl mt-8 pb-8">
                {/* Heading */}
                <h1 className="text-3xl font-bold pb-8 pt-14 text-center">Current Project Team</h1>
                <div className='mx-8'>

                  {/* Employee Cards Start*/}
                  <div className="grid grid-cols-3 bg-white drop-shadow-lg rounded-lg p-6 w-full mb-4">
                    {/* Employee Name */}
                    <div className='flex justify-center items-center'>
                      <h2 className="text-lg font-bold text-black">Akash Saha</h2>
                    </div>
                    {/* Employee ID */}
                    <div className='flex justify-center items-center'>
                      <p className=" text-black font-bold">RNPW/2024-25/WEB007DEV</p>
                    </div>
                    {/* Employee Email */}
                    <div className='flex justify-center items-center'>
                      <p className=" text-black font-bold">email@gmail.com</p>
                    </div>
                  </div>

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

        {/* Bottom Section - PDF viewer */}
        {isSrsViewing && loadedDomain && loadedProject && (
          <div>
            <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
              <h1 className="text-3xl text-center mt-4 mb-8 font-bold">
                Pdf Viewer
              </h1>
            </div>
            <div className=" container">
              <div className="w-full">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl={viewPdf}>
                  </Viewer>
                </Worker>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProjectDetails