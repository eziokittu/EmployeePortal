import React from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';

const ProjectItem = ({ task, deleteTask, editTask, toggleCompleted }) => {
  const { sendRequest } = useHttpClient();

	const projectDeleteHandler = async event => {
    event.preventDefault();
		try {
			const responseData = await sendRequest(
				'http://localhost:5000/api/projects/',
				'DELETE',
				JSON.stringify({
					projectId: task.id
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      console.log("Deleted project");

      // Refreshes the page after 1 second
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
      
		} catch (err) {
			console.log('ERROR deleting project, ID:', task.id);
		}  
  };

	return (
		<div className="flex justify-between items-center mb-2 px-3">
			<input
				type="checkbox"
				checked={task.completed}
			// onChange={handleChange}
			/>
			<p {...task.completed ? { className: 'line-through text-gray-400' } : { className: 'text-black' }}>{task.title}</p>

			<div className='flex justify-between items-center  w-100'>
				<div className='flex justify-between items-center mr-16'>
					<p {...task.completed ? { className: 'line-through text-gray-400' } : { className: 'text-black' }}>{task.date_start.split('T')[0]}</p>
					<p {...task.completed ? { className: 'line-through text-gray-400 mx-10' } : { className: 'text-black mx-10' }}>{task.date_end.split('T')[0]}</p>
				</div>
				<div className='flex justify-between items-center'>
					<button className='text-white bg-primary-600 border-2 hover:bg-white hover:text-primary-600 hover:border-primary-600 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2'
					// onClick={() => editTask(task.id)}
					>
						Edit
					</button>
					<button className='text-white border-2 bg-red-600 hover:bg-white hover:text-red-600 hover:border-red-600 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2'
					onClick={projectDeleteHandler}
					// onClick={deleteProject}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	)
}

export default ProjectItem

