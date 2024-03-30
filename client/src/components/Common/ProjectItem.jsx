import React, { useState, useContext, useEffect, useRef } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';
import { useNavigate } from 'react-router-dom';

// project, deleteproject, editproject, toggleIsCompleted
const ProjectItem = ({ task, toggleCompleted, projectDomains }) => {
	const navigate = useNavigate();
	const { sendRequest } = useHttpClient();
	const auth = useContext(AuthContext);

	const projectDeleteHandler = async event => {
		try {
			const responseData = await sendRequest(
				import.meta.env.VITE_BACKEND_URL + `/projects/`,
				'DELETE',
				JSON.stringify({
					projectId: task.id
				}),
				{
					'Content-Type': 'application/json'
				}
			);
			if (responseData.ok === 1) {
				console.log("Deleted project");

				// Refreshes the page after 1 second
				setTimeout(() => {
					window.location.reload(false);
				}, 1500);
			}
			else {
				console.log(responseData.message)
			}
		} catch (err) {
			console.log('ERROR deleting project, ID:', project.id);
		}
	};

	// State defined for editing the project details
	const [isEditing, setIsEditing] = useState(false);
	const [editedProjectTitle, setEditedProjectTitle] = useState(task.title);
	const [editedProjectDescription, setEditedProjectDescription] = useState(task.description);
	const [editedProjectLink, setEditedProjectLink] = useState(task.link);
	const [editedProjectType, setEditedProjectType] = useState();
	const [editedStartDate, setEditedStartDate] = useState(task.date_start);
	const [editedEndDate, setEditedEndDate] = useState(task.date_end);
	const [domain, setDomain] = useState();

	// For updating the image
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);
  const [inputFile, setInputFile] = useState(auth.image);

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
    setInputFile(pickedFile);
  };

	// Function to edit current project
	const projectEditHandler = async event => {
		try {
			const formData = new FormData();
      formData.append('srs', file);

      // for project title
      if (editedProjectTitle===''){
        setEditedProjectTitle(task.title);
      }
			formData.append('title', editedProjectTitle);

      // for project description
      if (editedProjectDescription===''){
        setEditedProjectDescription(task.description);
      }
			formData.append('description', editedProjectDescription);

			// for project link
      if (editedProjectLink===''){
        setEditedProjectLink(task.link);
			}
			formData.append('link', editedProjectLink);		
      formData.append('domain', editedProjectType);
      formData.append('startDate', editedStartDate);
      formData.append('endDate', editedEndDate);

			const responseData = await sendRequest(
				import.meta.env.VITE_BACKEND_URL + `/projects/patch/${task.id}`,
				'PATCH',
        formData
			);
			if (responseData.ok === 1) {
				console.log("Updated project details");

				// Refreshes the page after 1 second
				setTimeout(() => {
					window.location.reload(false);
				}, 1500);
			}
			else {
				console.log(responseData.message)
			}
		} catch (err) {
			console.log('ERROR deleting project, ID:', project.id);
		}
	};

	// Button to handle the edit button click
	function handleEditClick() {
		setIsEditing(true);
	}
	function handleCancelClick() {
		setIsEditing(false);
	}
	function handleDetailsClick(projectId) {
		navigate(`/project-details/${projectId}`);
	}

	// Function to mark project as completed
	const handleMarkAsCompleteClick = async (projectId) => {
		try {
			const responseData = await sendRequest(
				import.meta.env.VITE_BACKEND_URL + `/projects/patch/mark-as-complete/${projectId}`,
				'PATCH',
				[],
				{
					'Content-Type': 'application/json'
				}
			);
			if (responseData.ok === 1) {
				console.log("Project marked as complete");
				// Refreshes the page after 1 second
				setTimeout(() => {
					window.location.reload(false);
				}, 1500);
			}
			else {
				console.log(responseData.message)
			}
		} catch (err) {
			console.log('ERROR marking project as complete');
		}
	}
	
	// Function to mark project as completed
	const handleMarkAsOngoingClick = async (projectId) => {
		try {
			const responseData = await sendRequest(
				import.meta.env.VITE_BACKEND_URL + `/projects/patch/mark-as-ongoing/${projectId}`,
				'PATCH',
				[],
				{
					'Content-Type': 'application/json'
				}
			);
			if (responseData.ok === 1) {
				console.log("Project marked as ongoing");
				// Refreshes the page after 1 second
				setTimeout(() => {
					window.location.reload(false);
				}, 1500);
			}
			else {
				console.log(responseData.message)
			}
		} catch (err) {
			console.log('ERROR marking project as ongoing');
		}
	}

	// Function to get the domain name for the project
	useEffect(() => {
		const fetchProjectDomainName = async () => {
			try {
				const responseData = await sendRequest(
					`${import.meta.env.VITE_BACKEND_URL}/domains/get/project/${task._id}`
				);
				if (responseData.ok === 1) {
					setDomain(responseData.domain);
					setEditedProjectType(responseData.domain.name);
				}
				else {
					console.log("Error in setting domain");
				}
			} catch (err) {
				console.log("Error in fetching domain " + err);
			}
		};
		fetchProjectDomainName();
	}, []);

	return (
		// Project Item View Card
		!isEditing ? (
			<div className='m-3'>
				<div className="bg-gray-100 border-primary-700 border-2 mb-4 rounded-lg overflow-hidden">
					<div className="p-5">
						{/* Project Title */}
						<h2 className="text-xl font-bold mb-2">{task.title}</h2>

						{/* Project Description */}
						<p className="text-gray-600 mb-4">{task.description}</p>
						<div className='flex items-center '>
							{/* Project Domain */}
							{domain && (
								<p className="text-white font-semibold text-xs mb-4 mr-2 bg-primary-600 px-3 py-1 rounded-full">{domain.name}</p>
							)}

							{/* Project Link */}
							<a href={task.link} target="_blank" rel="noopener noreferrer" className="text-white bg-black font-semibold text-xs mb-4 rounded-full hover:underline font-md px-3 py-1">
								Project Link
							</a>
						</div>
						{/* Project Start and End Date */}
						<div className="flex items-center mb-2">
							<span
								{...task.isCompleted ? { className: 'inline-block rounded-full px-3 py-1 text-xs font-semibold bg-green-700 text-white mr-2' } : { className: 'inline-block rounded-full px-3 py-1 text-xs font-semibold bg-gray-600 text-white mr-2' }}
							>
								{task.isCompleted ? 'Completed' : 'Ongoing'}
							</span>
							<span className="text-sm text-black">{task.date_start.split('T')[0]} - {task.date_end.split('T')[0]}</span>
						</div>
						{/* Checkbox to mark the project as completed */}
						{/* {auth.isAdmin && (
						<div className="flex items-center font-semibold mb-4 border-primary-600">
							<input
								type="checkbox"
								checked={task.completed}
								onChange={handleChange}
								className="form-checkbox h-4 w-4 text-primary-600"
							/>
							<span className="ml-2 text-md">Mark as Completed</span>
						</div>
						)} */}
						{/* PDF File need to complete the backend*/}
						<p className="text-gray-600 mb-4">{task.setPdfFile}</p>

						{/* Edit and Delete Button */}
						<div className="flex flex-wrap justify-between items-center gap-3">

							{/* Edit Button */}
							{auth.isAdmin && (
								<button
									onClick={handleEditClick}
									className="text-sm text-white bg-blue-500 w-2/5 py-2 rounded-md hover:bg-blue-600"
								>
									Edit
								</button>
							)}

							{/* Details Button */}
							<button
								onClick={() => { handleDetailsClick(task._id) }}
								className="text-sm text-white bg-gray-500 w-2/5 py-2 rounded-md hover:bg-gray-600"
							>
								Details
							</button>

							{/* Mark as complete Button */}
							{auth.isAdmin && !task.isCompleted && (
							<button
								onClick={() => { handleMarkAsCompleteClick(task._id) }}
								className="text-sm text-white bg-gray-500 w-2/5 py-2 rounded-md hover:bg-gray-600"
							>
								Mark as Complete
							</button>
							)}

							{/* Mark as ongoing Button */}
							{auth.isAdmin && task.isCompleted && (
							<button
								onClick={() => { handleMarkAsOngoingClick(task._id) }}
								className="text-sm text-white bg-gray-500 w-2/5 py-2 rounded-md hover:bg-gray-600"
							>
								Mark as Ongoing
							</button>
							)}

							{/* Delete Button */}
							{auth.isAdmin && (
								<button
									onClick={() => projectDeleteHandler()}
									className="text-sm text-white bg-red-500 w-2/5 py-2 rounded-md hover:bg-red-600"
								>
									Delete
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		) : (
			// Edit Project View Card
			<div className='bg-slate-200 p-2 m-2 rounded-xl'>
				{/* Project Title edit input box */}
				<input
					type="text"
					value={editedProjectTitle}
					placeholder='Enter Project Title'
					onChange={(e) => setEditedProjectTitle(e.target.value)}
					className="mt-2 block w-full px-3 py-2 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
				{/* Project Description edit input box */}
				<textarea
					value={editedProjectDescription}
					placeholder='Enter Project Description'
					onChange={(e) => setEditedProjectDescription(e.target.value)}
					className="mt-2 block w-full px-3 py-2 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
				{/* Project Link edit input box */}
				<input
					type="text"
					value={editedProjectLink}
					placeholder='Enter Project Link'
					onChange={(e) => setEditedProjectLink(e.target.value)}
					className="mt-2 block w-full px-3 py-2 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
				/>
				<div className='flex gap-2 justify-center'>
					{/* Project Type edit input box */}
					{domain && (<select
						defaultValue={editedProjectType}
						value={editedProjectType}
						onChange={e => setEditedProjectType(e.target.value)}
						className="mt-2 block w-full px-3 py-2 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					>
						{projectDomains.map(d => (
							<option key={d.id} defaultValue={d.name} value={d.name}>{d.name}</option>
						))}
					</select>
					)}
					<input
						id='srs_file'
						type="file"
						className="mt-2 block w-full px-3 py-2 bg-white border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						placeholder="Upload new SRS File"
						name="file"
						ref={filePickerRef}
						accept=".pdf"
						onChange={pickedHandler}
					/>
				</div>
				{/* Project Start and End Date edit input box */}
				<div className='flex justify-center items-center gap-2'>
					<input
						type="date"
						value={editedStartDate}
						placeholder='Enter Start Date'
						onChange={(e) => setEditedStartDate(e.target.value)}
						className="mt-2 block w-full px-3 py-2 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
					<input
						type="date"
						value={editedEndDate}
						placeholder='Enter End Date'
						onChange={(e) => setEditedEndDate(e.target.value)}
						className="mt-2 block w-full px-3 py-2 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>
				{/* Save and Cancel Button */}
				<div className="flex justify-between items-center mt-4">
					<button
						onClick={projectEditHandler}
						className="text-sm text-white bg-green-500 px-3 py-1 rounded-md hover:bg-green-600"
					>
						Save
					</button>
					<button
						onClick={handleCancelClick}
						className="text-sm text-white bg-gray-500 px-3 py-1 rounded-md hover:bg-gray-600"
					>
						Cancel
					</button>
				</div>
			</div>
		)

	);
};

export default ProjectItem

