import { useState, useEffect, useContext } from 'react'
import Card from '../Common/Card'
import ticketsOpen from '../../assets/ticketsOpen.png'
import ticketsClosed from '../../assets/ticketsClosed.png'
import ProjectItem from '../Common/ProjectItem'
import ReactPaginate from 'react-paginate'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const Projects = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  // handling the pagination
  const projectsDisplayedPerPage = 5;
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
  useEffect(() => {
    // Function to fetch the project count
    const fetchProjectCount = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects/count`
        );
        if (responseData.ok===1){
          setProjectsCount(responseData.count);
          setPageCount(Math.ceil(responseData.count / projectsDisplayedPerPage))
        }
        else {
          console.log("No projects found!");
        }
      } catch (err) {
        console.log("Error in fetching projects: "+err);
      }
    };

    // Function to fetch all the projects
    const fetchProjects = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/projects?page=${page}`
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

    // Function to fetch the count of completed projects
    // const fetchCompletedProjectsCount = async () => {
    //   try {
    //     const responseData = await sendRequest(
    //       import.meta.env.VITE_BACKEND_URL+`/projects/completed`
    //     );
    //     setCompletedProjects(responseData.count);
    //   } catch (err) {
    //     console.log("Error in fetching completed projects count: "+err);
    //   }
    // }

    // Function to fetch the count of Ongoing projects
    // const fetchOngoingProjectsCount = async () => {
    //   try {
    //     const responseData = await sendRequest(
    //       `${import.meta.env.VITE_BACKEND_URL}/projects/ongoing`
    //     );
    //     setOngoingProjects(responseData.count);
    //   } catch (err) {
    //     console.log("Error in fetching ongoing projects count: "+err);
    //   }
    // }

    fetchProjectCount();
    fetchProjects();
    // fetchCompletedProjectsCount();
    // fetchOngoingProjectsCount();
  }, [page]);

  const [text, setText] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // function to add a new project
  const projectAddHandler = async event => {
    event.preventDefault();
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/projects/`,
				'POST',
				JSON.stringify({
					title: text,
          startDate: startDate,
          endDate: endDate
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      console.log("Added new project");

      // Refreshes the page after 1 second
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
      
		} catch (err) {
			console.log('ERROR creating new project');
		}  
  };  

  function toggleIsCompleted(id) {
    setProjects(projects.map(project => {
      if (project.id === id) {
        return { ...project, isCompleted: !project.isCompleted };
      } else {
        return project;
      }
    }));
  }

  return (
    <div className="p-4 sm:ml-64 min-h-[500px]">
      <div className="p-4 border-2 border-gray-200 rounded-lg">
        {/* Projects Overview */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {ongoingProjects>0 ? 
            (<Card name='Ongoing Projects' value={ongoingProjects} imgValue={ticketsOpen} />)
            :
            (<Card name='Ongoing Projects' value='0' imgValue={ticketsOpen} />)
          }
          {completedProjects>0 ? 
            (<Card name='Closed Projects' value={completedProjects} imgValue={ticketsClosed} />)
            :
            (<Card name='Closed Projects' value='0' imgValue={ticketsClosed} />)
          }
          <Card name='Hold' value='48' imgValue={ticketsOpen} />
        </div>

        {/* Ongoing Projects  */}
        <div className="mb-4 rounded bg-gray-50 dark:bg-gray-800">

          < div className='my-3' >

            {/* Projects start */}
            <div className='my-3'>
              <div className="mb-2">
                {/* Optional Add Projects with start and end date */}
                <div className='flex justify-around items-center mb-4'>
                  <h2 className='font-bold text-lg'>Add Projects</h2>
                  <input
                    className='border-2 w-72 border-gray-200 rounded-lg px-3 py-1.5 mr-2'
                    value={text}
                    placeholder='Enter Project name'
                    onChange={e => setText(e.target.value)}
                    required
                  />
                  <input
                    required
                    className='border-2 border-gray-200 rounded-lg px-3 py-1.5 mr-2'
                    type="date"
                    placeholder='Enter Start Date'
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                  <input
                    required
                    className='border-2 border-gray-200 rounded-lg px-3 py-1.5 mr-2'
                    type="date"
                    placeholder='Enter Start Date'
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                  />
                  <button
                    className='text-white bg-primary-600 border-2 hover:bg-white hover:text-primary-600 hover:border-primary-600 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2'
                    onClick={projectAddHandler}>Add</button>

                </div>
                {/* Optional Add Projects with start and end date */}

                {/* Project Heading Start */}
                <div className='flex justify-between items center font-bold text-lg bg-gray-100 h-12 mb-3 rounded-lg'>
                  <div>Completed</div>
                  <div className='mr-20 pr-10'>Projects</div>
                  <div className='flex justify-center items-center'>
                    <div className='flex justify-around items-center mr-32'>
                      <h2 className='w-30 mr-10'>Start</h2>
                      <h2 className='w-30 mr-10 '>Deadline</h2>
                    </div>
                    
                    {auth.isAdmin && (<h2 className=' w-32'>Actions</h2>)}
                  </div>
                </div>
                {/* Project Heading End */}

                {/* Project Component Start */}
                <div>
                  {projects
                    // .slice(pagesVisited, pagesVisited + itemsPerPage)
                    .map(project => (
                      // console.log(project),
                      <ProjectItem
                        key={project.id}
                        project={project}
                        // deleteproject={deleteproject}
                        // editproject={editproject}
                        startDate={project.date_start}
                        toggleIsCompleted={toggleIsCompleted}
                        endDate={project.date_end}
                      />
                    ))}
                </div>
                {/* Project Component End */}
              </div>
            </div>
            {/* Projects End */}
          </div >

          {/* Pagination */}
          {projectsCount>0 && (
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
        </div >
      </div>
    </div >
  )
}

export default Projects


