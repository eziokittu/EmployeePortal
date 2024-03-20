import { useState, useEffect, useContext } from 'react';
import ticketsOpen from '../../assets/ticketsOpen.png';
import ticketsClosed from '../../assets/ticketsClosed.png';
import ProjectItem from '../Common/ProjectItem';
import ReactPaginate from 'react-paginate';
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';
import Card from '../Common/Card';
import { Link } from 'react-router-dom';

const Projects = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  // handling the pagination
  // const projectsDisplayedPerPage = 5;
  const [projectsCount, setProjectsCount] = useState(0);
  // const [pageCount, setPageCount] = useState(0);
  // const [page, setPage] = useState(0);
  // const handlePageClick = (num) => {
  //   setPage(num);
  // };

  // getting all the projects from database
  const [projects, setProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState();
  const [ongoingProjects, setOngoingProjects] = useState();
  const [myCompletedProjects, setMyCompletedProjects] = useState();
  const [myOngoingProjects, setMyOngoingProjects] = useState();

  // Fetching the all projects and count only 1 time per page reload OR change in page of pagination
  useEffect(() => {
    // Function to fetch the project count
    const fetchProjectCount = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects/count/emp/${auth.userId}`
        );
        if (responseData.ok===1){
          setProjectsCount(responseData.count);
          // setPageCount(Math.ceil(responseData.count / projectsDisplayedPerPage))
        }
        else {
          console.log("No projects found!");
        }
      } catch (err) {
        console.log("Error in fetching all projects count: "+err);
      }
    };

    // Function to fetch all the projects
    const fetchProjects = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects/emp/all/${auth.userId}`
          // `${import.meta.env.VITE_BACKEND_URL}/projects/emp/all/${auth.userId}?page=${page}`
        );
        if (responseData.ok===1){
          setProjects(responseData.projects);
        }
        else {
          console.log("No projects found!");
        }
      } catch (err) {
        console.log("Error in fetching projects: "+err);
      }
    };

    fetchProjectCount();
    fetchProjects();
  // }, [page]);
  }, []);

  // Fetching MY ongoing and completed project count only 1 time per page reload
  useEffect(() => {

    // Function to fetch the ongoing project count
    const fetchOngoingProjectCount = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects/count/emp/ongoing/${auth.userId}`
        );
        if (responseData.ok===1){
          setMyOngoingProjects(responseData.count);
          // setPageCount(Math.ceil(responseData.count / projectsDisplayedPerPage))
        }
        else {
          console.log("No projects found!");
        }
      } catch (err) {
        console.log("Error in fetching ongoing projects count: "+err);
      }
    };

    // Function to fetch the completed project count
    const fetchCompletedProjectCount = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects/count/emp/completed/${auth.userId}`
        );
        if (responseData.ok===1){
          setMyCompletedProjects(responseData.count);
          // setPageCount(Math.ceil(responseData.count / projectsDisplayedPerPage))
        }
        else {
          console.log("No projects found!");
        }
      } catch (err) {
        console.log("Error in fetching completed projects count: "+err);
      }
    };

    fetchCompletedProjectCount();
    fetchOngoingProjectCount();
  }, []); 

  // Fetching TOTAL ongoing and completed project count only 1 time per page reload
  useEffect(() => {

    // Function to fetch the ongoing project count
    const fetchOngoingProjectCount = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects/count/ongoing`
        );
        if (responseData.ok===1){
          setOngoingProjects(responseData.count);
          // setPageCount(Math.ceil(responseData.count / projectsDisplayedPerPage))
        }
        else {
          console.log("No projects found!");
        }
      } catch (err) {
        console.log("Error in fetching ongoing projects count: "+err);
      }
    };

    // Function to fetch the completed project count
    const fetchCompletedProjectCount = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects/count/completed`
        );
        if (responseData.ok===1){
          setCompletedProjects(responseData.count);
          // setPageCount(Math.ceil(responseData.count / projectsDisplayedPerPage))
        }
        else {
          console.log("No projects found!");
        }
      } catch (err) {
        console.log("Error in fetching completed projects count: "+err);
      }
    };

    fetchCompletedProjectCount();
    fetchOngoingProjectCount();
  }, []);

  
  //Toggle Completed function
  // function toggleCompleted(id) {
  //   setTasks(tasks.map(task => {
  //     if (task.id === id) {
  //       return { ...task, completed: !task.completed };
  //     } else {
  //       return task;
  //     }
  //   }));
  // }

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 rounded-lg">

        {/* My Projects Overview */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Onfoing Projetcs */}
          <Card 
            name='My Ongoing Projects' 
            value={(!myOngoingProjects ? "0" : myOngoingProjects)} 
            imgValue={ticketsOpen} 
          />
          {/* Completed Projects */}
          <Card 
            name='My Completed Projects' 
            value={(!myCompletedProjects ? "0" : myCompletedProjects)} 
            imgValue={ticketsClosed}
          />
        </div>

        {/* Ongoing Projects  */}
        {/* Add Project Heading */}
        <h2 className='font-bold text-3xl mb-4 text-center'>My Projects</h2>

        {/* Displaying all projects */}
        {projects && projectsCount>0 && (
          <div className="mb-4 rounded bg-gray-50 dark:bg-gray-800">
            {/* Searchbar and Heading Start */}
            <div className='flex justify-between items-center px-4 py-3'>

              {/* <div className='w-72'>
                <h1 className=' text-xl mr-4 font-bold'>Ongoing Projects</h1>
              </div> */}

              {/* Search input */}
              {/* <div className='w-full mr-4'>
                <form>
                  <div className="flex">
                    <div className="relative w-full">
                      <input
                        type="search"
                        id="search-dropdown"
                        className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg  border-2-gray-50 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search"
                        required
                        // value={searchQuery}
                        // onChange={event => setSearchQuery(event.target.value)}
                      />
                      <button
                        type="submit"
                        className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
                      ">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span className="sr-only">Search</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div> */}

              {/* Filter by week, month */}
              {/* <div className='w-64'>
                <select
                  id="filter"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  // value={filter}
                  // onChange={event => setFilter(event.target.value)}
                >
                  <option value="all" selected>All Time</option>
                  <option value="week" >This Week</option>
                  <option value="day" >Today</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div> */}
            </div>
            {/* Searchbar and Heading End */}

            <div className='my-3' >
              {/* Projects start */}
              <div className="mb-2">
                {/* Project Component Start */}
                <div className='grid grid-cols-2 gap-4'>
                  {/* Conditional rendering between Search result and tasks list */}
                  {
                    // (searchQuery.length === 0 || searchResults.length === 0 ? filteredTasks : searchResults)
                    projects
                      .map(task => (
                        <ProjectItem
                          key={task.id}
                          task={task}
                          projetDesceiption={task.projectDescription}
                          selectedOption={task.selectedOption}
                          startDate={task.startDate}
                          endDate={task.endDate}
                          selectedFile={task.selectedFile}
                          link={task.link}
                          // toggleCompleted={toggleCompleted}
                        />
                      ))}
                </div>
                {/* Project Component End */}
              </div>
              {/* Projects End */}
            </div>
          </div>
        )}

        {/* If employee has no projects */}
        {projectsCount===0 && (
          <div
            className='text-center text-xl'
          >
            <div className='flex flex-row text-center justify-center'>
              <p>You are not assigned to any project.</p>
              <p className='mx-2 underline underline-offset-2 hover:text-blue-600'>
                <Link to={'/contact'}>
                  Contact the ADMIN
                </Link>
              </p>
              <p>for more details.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Projects


