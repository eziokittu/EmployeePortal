import { useState, useEffect, useContext, useRef } from 'react'
import ticketsOpen from '../../assets/ticketsOpen.png'
import ticketsClosed from '../../assets/ticketsClosed.png'
import ProjectItem from '../Common/ProjectItem'
import ReactPaginate from 'react-paginate'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';
import Card from '../Common/Card'
import { Element, scroller } from "react-scroll";
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  // onChange={e => setText(e.target.value)}

  // handling the pagination
  const projectsDisplayedPerPage = 2;
  const [projectsCount, setProjectsCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);
  const handlePageClick = (num) => {
    setPage(num);
  };

  // getting all the projects from database
  const [projects, setProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState();
  const [ongoingProjects, setOngoingProjects] = useState();
  const [projectDomains, setProjectDomains] = useState();

  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDomain, setSelectedDomain] = useState();
  const [startDate, setStartDate] = useState(new Date().toISOString());
  const [endDate, setEndDate] = useState(new Date().toISOString());
  const [link, setLink] = useState('');
  // for searchbar defining states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // for filter dropdown defining states
  const [filter, setFilter] = useState('all');

  // Fetching the all projects and count only 1 time per page reload OR change in page of pagination
  useEffect(() => {
    // Function to fetch the project count
    const fetchProjectCount = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects/count/`
        );
        if (responseData.ok === 1) {
          setProjectsCount(responseData.count);
          setPageCount(Math.ceil(responseData.count / projectsDisplayedPerPage))
        }
        else {
          console.log("No projects found!");
        }
      } catch (err) {
        console.log("Error in fetching all projects count: " + err);
      }
    };

    // Function to fetch all the projects
    const fetchProjects = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects?page=${page}`
        );
        if (responseData.ok === 1) {
          setProjects(responseData.projects);
        }
        else {
          console.log("No projects found!");
        }
      } catch (err) {
        console.log("Error in fetching projects: " + err);
      }
    };

    fetchProjectCount();
    fetchProjects();
  }, [page]);

  // Fetching the ongoing and completed project count and domains only 1 time per page reload
  useEffect(() => {

    // Function to fetch the ongoing project count
    const fetchOngoingProjectCount = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects/count/ongoing`
        );
        if (responseData.ok === 1) {
          setOngoingProjects(responseData.count);
          // setPageCount(Math.ceil(responseData.count / projectsDisplayedPerPage))
        }
        else {
          console.log("No projects found!");
        }
      } catch (err) {
        console.log("Error in fetching ongoing projects count: " + err);
      }
    };

    // Function to fetch the completed project count
    const fetchCompletedProjectCount = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects/count/completed`
        );
        if (responseData.ok === 1) {
          setCompletedProjects(responseData.count);
          // setPageCount(Math.ceil(responseData.count / projectsDisplayedPerPage))
        }
        else {
          console.log("No projects found!");
        }
      } catch (err) {
        console.log("Error in fetching completed projects count: " + err);
      }
    };

    // Function to fetch the project domains
    const fetchProjectDomains = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/domains/get`
        );
        if (responseData.ok === 1) {
          setProjectDomains(responseData.domains);
          setSelectedDomain(responseData.domains[0].name);
        }
      } catch (err) {
        console.log("Error in fetching domains: " + err);
      }
    };

    fetchOngoingProjectCount();
    fetchCompletedProjectCount();
    fetchProjectDomains();
  }, []);

  // For updating the image
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);
  const [inputImage, setInputImage] = useState(auth.image);

  const filePickerRef = useRef();

  // Function to update the preview image when the file changes
  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = event => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
    setInputImage(pickedFile);
  };

  // function to check for invalid inputs and return the list of error message strings
  const validateInput = () => {
    let alerts = [];
    if (!text.trim()) {
      alerts.push('Project Title cannot be empty');
    }
    return alerts; // Return the alerts array directly
  }

  // function to add a new project
  const projectAddHandler = async event => {
    // Checking for invalid input
    const validationAlerts = validateInput()
    if (validationAlerts.length > 0) {
      alert(`Please correct the following input errors:\n- ${validationAlerts.join('\n- ')}`);
      return;
    }

    if (!projectDomains){
      alert('No domain has been selected!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('srs', file);

      // for project title
      if (text === '') {
        console.log("project title cannot be empty!")
        return;
      }
      else {
        formData.append('title', text);
      }

      // for project description
      if (description === '') {
        formData.append('description', '-');
      }
      else {
        formData.append('description', description);
      }
      formData.append('employees', []);
      formData.append('domain', selectedDomain);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);

      // for project link
      if (link === '') {
        formData.append('link', 'https://www.google.com');
      }
      else {
        formData.append('link', link);
      }
      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/projects/`,
        'POST',
        formData
      );
      if (responseData.ok === 1) {
        console.log("Added new project");
        alert("Successfully added a new project");
        // Refreshes the page after 1.5 second
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
      else {
        console.log(responseData.message);
      }
    } catch (err) {
      console.log('ERROR creating new project' + err);
    }
  };

  // function to scroll to section using react-scroll
  const scrollToSection = (section) => {
    // console.log(section);
    scroller.scrollTo(section, {
      duration: 1500,
      delay: 100,
      smooth: 'easeOutBack',
      offset: -80
    });
  };

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 rounded-lg">
        {/* Projects Overview */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Onfoing Projetcs */}
          <Card
            name='Ongoing Projects'
            value={(!ongoingProjects ? "0" : ongoingProjects)}
            imgValue={ticketsOpen}
          />
          {/* Completed Projects */}
          <Card
            name='Completed Projects'
            value={(!completedProjects ? "0" : completedProjects)}
            imgValue={ticketsClosed}
          />
        </div>

        {/* Button to scroll to - add projects */}
        {auth.isAdmin && (
          <button
            className='text-white text-center justify-center flex mb-12 mx-auto w-1/2 bg-primary-600 border-2 hover:bg-white hover:text-primary-600 hover:border-primary-600 focus:ring-2 focus:ring-indigo-300 font-bold rounded-lg text-lg px-4 lg:px-5 py-2 lg:py-2.5'
            onClick={() => { scrollToSection('section_project_add') }}
          >
            Add New Project
          </button>
        )}

        {/* Ongoing Projects  */}
        <Element name="section_project_view" className='mb-4 rounded bg-gray-50 dark:bg-gray-800'>
          {/* Add Project Heading */}
          <h2 className='font-bold text-3xl mb-4 text-center'>All Projects</h2>

          {/* Displaying all projects */}
          {projectsCount > 0 && (
            <div className="">

              {/* Projects start */}
              <div className='my-3' >
                <div className="mb-2">
                  {/* Project Component */}
                  {projects && projectDomains && (
                    <div className='grid grid-cols-2 gap-4'>
                      {projects.map(task => (
                        <ProjectItem
                          key={task.id}
                          task={task}
                          projectDomains={projectDomains}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {projectsCount > 0 && (
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
          )}

          {/* If no projects available */}
          {projectsCount === 0 && (
            <div className='text-2xl font-bold text-center'>
              No Projects! Add one from below
            </div>
          )}
        </Element>

        {/* Add Project Section */}
        <Element name="section_project_add">
          {/* Add Project Heading */}
          <h2 className='font-bold text-3xl mb-4 text-center'>Add Projects</h2>
          {/* Add Projects form */}
          <div className='flex justify-center items-center flex-col mb-10'>
            {/* Project title input field */}
            <input
              className='border-2 w-1/2 border-gray-200 rounded-lg px-3 py-1.5 mb-2 placeholder:text-gray-800'
              value={text}
              placeholder='Enter Project Title'
              onChange={e => setText(e.target.value)}
              required
            /> <br />
            {/* Project Description input field */}
            <textarea
              className='border-2 w-1/2 border-gray-200 rounded-lg px-3 py-1.5 mb-2 placeholder:text-gray-800'
              value={description}
              placeholder='Enter Project Description'
              onChange={e => setDescription(e.target.value)}
              required
            /> <br />
            {/* Project Type dropdown */}
            {!projectDomains && (
              <div 
                onClick={()=>navigate('/others')}
                className='border-2 w-1/2 border-gray-200 rounded-lg px-3 py-1.5 mb-2 flex justify-center items-center bg-gray-400 hover:bg-gray-700 text-white'>Create Domain!</div>
            )}
            {projectDomains && (
            <div
              className='border-2 w-1/2 border-gray-200 rounded-lg px-3 py-1.5 mb-2 flex justify-center items-center'
            >
              <div className=''>Select Project Domain</div>
              <select
                className='border-2 w-3/4 border-gray-200 rounded-lg m-2 p-2'
                defaultValue={projectDomains[0]}
                value={selectedDomain}
                onChange={e => setSelectedDomain(e.target.value)}
              >
                {projectDomains.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            )}
            <br />

            {/* Start and End Date */}
            <div className='flex justify-center gap-4 w-1/2'>
              <div className='w-1/2'>
                <label htmlFor="">Enter Project Start Date</label> <br />
                <input
                  required
                  className='border-2 w-full border-gray-200 rounded-lg px-3 py-1.5 mb-2'
                  type="date"
                  placeholder='Enter Start Date'
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div className='w-1/2 text-start'>
                <label htmlFor="" className=''>Enter Project End Date</label> <br />
                <input
                  required
                  className='border-2 w-full border-gray-200 rounded-lg px-3 py-1.5 mb-2'
                  type="date"
                  placeholder='Enter End Date'
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <br />
            {/* SRS document input field */}
            <label htmlFor="">Enter SRS document</label>
            <input
              id='srs_file'
              className='border-2 w-1/2 border-gray-200 rounded-lg px-3 py-1.5 mb-2'
              type="file"
              ref={filePickerRef}
              placeholder='Enter SRS'
              accept=".pdf"
              onChange={pickedHandler}
            /> <br />
            {/* Project Link input field */}
            <input
              required
              className='border-2 w-1/2 border-gray-200 rounded-lg px-3 py-1.5 mb-2 placeholder:text-gray-800'
              type="text"
              placeholder='Enter Project Link'
              value={link}
              onChange={(e) => setLink(e.target.value)}
            /> <br />
            <button
              className='text-white w-1/2 bg-primary-600 border-2 hover:bg-white hover:text-primary-600 hover:border-primary-600 focus:ring-2 focus:ring-indigo-300 font-bold rounded-lg text-lg px-4 lg:px-5 py-2 lg:py-2.5'
              onClick={() => { projectAddHandler() }}
            >
              Add Projects
            </button>
          </div>
        </Element>

        {/* Button to scroll to - view all projects */}
        <button
          className='text-white text-center justify-center flex right-0 mb-12 mx-auto w-1/2 bg-primary-600 border-2 hover:bg-white hover:text-primary-600 hover:border-primary-600 focus:ring-2 focus:ring-indigo-300 font-bold rounded-lg text-lg px-4 lg:px-5 py-2 lg:py-2.5'
          onClick={() => { scrollToSection('section_project_view') }}
        >
          View All Projects
        </button>

      </div>
    </div>
  )
}

export default Projects


