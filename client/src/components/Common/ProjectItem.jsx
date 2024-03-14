import React, {useContext} from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const ProjectItem = ({ project, deleteproject, editproject, toggleIsCompleted }) => {
	const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

	const projectDeleteHandler = async event => {
		event.preventDefault();
		try {
			const responseData = await sendRequest(
				import.meta.env.VITE_BACKEND_URL+`/projects/`,
				'DELETE',
				JSON.stringify({
					projectId: project.id
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
			console.log('ERROR deleting project, ID:', project.id);
		}
	};

	function handleChange() {
		toggleIsCompleted(project.id);
	}	

	return (
		<div className="flex justify-between items-center mb-2 px-3">
			<input
				type="checkbox"
				checked={project.isCompleted}
				onChange={handleChange}
			/>
			<p {...project.isCompleted ? { className: 'line-through text-gray-400' } : { className: 'text-black' }}>{project.title}</p>

			<div className='flex justify-between items-center  w-100'>
				<div className='flex justify-between items-center mr-16'>
					<p {...project.isCompleted ? { className: 'line-through text-gray-400' } : { className: 'text-black' }}>{project.date_start.split('T')[0]}</p>
					<p {...project.isCompleted ? { className: 'line-through text-gray-400 mx-10' } : { className: 'text-black mx-10' }}>{project.date_end.split('T')[0]}</p>
				</div>

				{auth.isAdmin && (
					<div className='flex justify-between items-center'>
						<button className='text-white bg-primary-600 border-2 hover:bg-white hover:text-primary-600 hover:border-primary-600 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2'
							// onClick={() => editproject(project.id)}
						>
							Edit
						</button>
						<button className='text-white border-2 bg-red-600 hover:bg-white hover:text-red-600 hover:border-red-600 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2'
							onClick={projectDeleteHandler}
						>
							Delete
						</button>
					</div>
				)}
			</div>
		</div>
	)
}

export default ProjectItem

