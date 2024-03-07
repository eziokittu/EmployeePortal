import React, { useState, useEffect, useContext, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';
import profileImg from '../../assets/profile.png';

const EditProfile = () => {
	const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  // For updating the user information
  const [inputFirstName, setInputFirstName] = useState(auth.firstname);
  const [inputLastName, setInputLastName] = useState(auth.lastname);
  const [inputUserName, setInputUserName] = useState(auth.userName);
  const [inputPhone, setInputPhone] = useState(auth.phone);
  const [inputEmail, setInputEmail] = useState(auth.email);
  const [inputBio, setInputBio] = useState(auth.bio);

	// console.log(auth.firstname);

	// Function to update user details
  const userInfoUpdateHandler = async event => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL+`/users/edit/info/${auth.userId}`,
        'PATCH',
        JSON.stringify({
					email: inputEmail,
					firstname: inputFirstName,
					lastname: inputLastName,
					userName: inputUserName,
					phone: inputPhone,
					bio: inputBio,
				}),
				{
					'Content-Type': 'application/json'
				}
      );
			console.log("DEBUG 1");
			setTimeout(() => {
				window.location.reload(false);
			}, 2500);
			console.log("DEBUG 2");
			await auth.updateUser(
        inputUserName,
        inputFirstName,
        inputLastName,
        inputEmail,
        inputPhone,
        inputBio,
				auth.role,
				auth.image,
				false
      );
			console.log("DEBUG 3");
      console.log("User details updated successfully!");
    } catch (err) {
      console.log('ERROR updating user details!');
    }
  };

  // For updating the image
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState(auth.image);
  const [isValid, setIsValid] = useState(false);
  const [inputImage, setInputImage] = useState(auth.image);

  const filePickerRef = useRef();

	// Function to update the preview image when the file changes
  useEffect(() => {
    // console.log('File:', file);
    // console.log('Auth Image:', auth.image);
    if (!file) {
        setPreviewUrl(auth.image); // Reset to default image if no file is selected
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
        // console.log('FileReader Result:', fileReader.result);
        setPreviewUrl(fileReader.result); // Update previewUrl with the new image data URL
    };
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

	// Function to update current user image
  const userImageUpdateHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('image', inputImage);
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL+`/users/edit/imageupdate/${auth.userId}`,
        'PATCH',
        formData
      );
			setTimeout(() => {
				window.location.reload(false);
			}, 1500);
			await auth.updateUser(
        auth.userName,
        auth.firstname,
        auth.lastname,
        auth.email,
        auth.phone,
        auth.bio,
				auth.role,
				responseData.user.image
      );
      console.log("User image updated successfully!",inputImage);
    } catch (err) {
      console.log('ERROR updating user image!');
    }
  };

	// Function to remove current user image
	const userImageRemoveHandler = async event => {
    event.preventDefault();
    try {
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL+`/users/edit/imagedelete/${auth.userId}`,
        'PATCH',
        []
      );
      console.log("User image deleted successfully!");
			setTimeout(() => {
				// navigate('/')
				window.location.reload(false);
			}, 1500);
			console.log("DEBUG 1");
			await auth.updateUser(
        auth.userName,
        auth.firstname,
        auth.lastname,
        auth.email,
        auth.phone,
        auth.bio,
				auth.role,
				import.meta.env.VITE_USER_DEFAULT_IMAGE_PATH
			);
			console.log("DEBUG 2");
			setPreviewUrl(import.meta.env.VITE_USER_DEFAULT_IMAGE);
			console.log("DEBUG 3");
			console.log(import.meta.env.VITE_USER_DEFAULT_IMAGE);
    } catch (err) {
      console.log('ERROR deleting user image!');
    }
  };

	return (
		<div className="p-4 sm:ml-64">
			<div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
				{/* Heading Section */}
				<div className="flex items-center justify-center flex-row text-center h-48 mb-4 rounded bg-gray-50 dark:bg-gray-800">
					<div>
						<h1 className=' text-4xl font-bold'>Edit Profile</h1>
						<p className='mt-4'>Manage Your Account Preferences</p>
					</div>
				</div>
				<div className="p-4 bg-gray-50">

					{/* Edit Details section */}
					<div className="p-4 rounded-lg dark:border-gray-700">
						{/* Full Name */}
						<div className="flex mb-4">
							{/* First Name */}
							<div className="w-1/2 pr-4 relative">
								<label htmlFor="name">First name</label>
								<input
									onChange={(event) => setInputFirstName(event.target.value)}
									type="text"
									id="settings_fname"
									placeholder={inputFirstName}
									className="block w-full pl-10 h-10 mt-1 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								/>
								<svg
									className='absolute left-4 top-10 h-4 w-4 text-gray-400'
									fill="#0d0d0d" width="24" height="24" viewBox="0 0 24 24" id="user" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg"><path id="primary" d="M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,6,6,0,0,1,6-6h6A6,6,0,0,1,21,20Zm-9-8A5,5,0,1,0,7,7,5,5,0,0,0,12,12Z" fill="#0d0d0d" /></svg>
							</div>
							{/* Last Name */}
							<div className="w-1/2 pl-2 relative">
								<label htmlFor="lastname">Last name</label>
								<input
									onChange={(event) => setInputLastName(event.target.value)}
									type="text"
									id="settings_lname"
									placeholder={inputLastName}
									className="block w-full pl-10 h-10 mt-1 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
								/>
								<svg
									className='absolute left-4 top-10 h-4 w-4 text-gray-400'
									fill="#0d0d0d" width="24" height="24" viewBox="0 0 24 24" id="user" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg"><path id="primary" d="M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,6,6,0,0,1,6-6h6A6,6,0,0,1,21,20Zm-9-8A5,5,0,1,0,7,7,5,5,0,0,0,12,12Z" fill="#0d0d0d" /></svg>
							</div>
						</div>
						{/* Phone Number */}
						<div className="mb-4 relative">
							<label htmlFor="number">Phone number</label>
							<input
								onChange={(event) => setInputPhone(event.target.value)}
								type="text"
								id="settings_phone"
								placeholder={inputPhone}
								className="block w-full h-10 mt-1 bg-blue-100 pl-10 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							/>
							<svg
								className=" absolute left-4 top-10 h-4 w-4 text-gray-400"

								width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.833 4h4.49L9.77 7.618l-2.325 1.55A1 1 0 0 0 7 10c.003.094 0 .001 0 .001v.021a2.026 2.026 0 0 0 .006.134c.006.082.016.193.035.33.039.27.114.642.26 1.08.294.88.87 2.019 1.992 3.141 1.122 1.122 2.261 1.698 3.14 1.992.439.146.81.22 1.082.26a4.43 4.43 0 0 0 .463.04l.013.001h.008s.112-.006.001 0a1 1 0 0 0 .894-.553l.67-1.34 4.436.74v4.32c-2.111.305-7.813.606-12.293-3.874C3.227 11.813 3.527 6.11 3.833 4zm5.24 6.486l1.807-1.204a2 2 0 0 0 .747-2.407L10.18 3.257A2 2 0 0 0 8.323 2H3.781c-.909 0-1.764.631-1.913 1.617-.34 2.242-.801 8.864 4.425 14.09 5.226 5.226 11.848 4.764 14.09 4.425.986-.15 1.617-1.004 1.617-1.913v-4.372a2 2 0 0 0-1.671-1.973l-4.436-.739a2 2 0 0 0-2.118 1.078l-.346.693a4.71 4.71 0 0 1-.363-.105c-.62-.206-1.481-.63-2.359-1.508-.878-.878-1.302-1.739-1.508-2.36a4.59 4.59 0 0 1-.125-.447z" fill="#0D0D0D" /></svg>
						</div>
						{/* Email Address */}
						<div className="mb-4 relative">
							<label htmlFor="email">Email Address</label>
							<input
								onChange={(event) => setInputEmail(event.target.value)}
								type="email"
								id="settings_email"
								placeholder={inputEmail}
								className="block w-full h-10 mt-1 pl-10 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							/>
							<svg
								className=' absolute left-4 top-10 h-4 w-4 text-gray-400'
								width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm3.519 0L12 11.671 18.481 6H5.52zM20 7.329l-7.341 6.424a1 1 0 0 1-1.318 0L4 7.329V18h16V7.329z" fill="#0D0D0D" /></svg>
						</div>
						{/* Username */}
						<div className="mb-4 relative">
							<label htmlFor="username">Username</label>
							<input
								onChange={(event) => setInputUserName(event.target.value)}
								type="username"
								id="settings_username"
								placeholder={inputUserName}
								className="block w-full h-10 mt-1 pl-10 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							/>
							<svg
								className=' absolute left-4 top-10 h-4 w-4 text-gray-400'
								fill="#000000" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,1a11,11,0,0,0,0,22,1,1,0,0,0,0-2,9,9,0,1,1,9-9v2.857a1.857,1.857,0,0,1-3.714,0V7.714a1,1,0,1,0-2,0v.179A5.234,5.234,0,0,0,12,6.714a5.286,5.286,0,1,0,3.465,9.245A3.847,3.847,0,0,0,23,14.857V12A11.013,11.013,0,0,0,12,1Zm0,14.286A3.286,3.286,0,1,1,15.286,12,3.29,3.29,0,0,1,12,15.286Z" /></svg>
						</div>
						{/* Bio */}
						<div>
							<label htmlFor="bio">BIO</label>
							<textarea
								onChange={(event) => setInputBio(event.target.value)}
								id="settings_bio"
								rows="6"
								placeholder={inputBio}
								className="block p-2 w-full mt-1 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
							></textarea>
						</div>
						{/* Save and Cancel Buttons */}
						<div className="mt-5 flex justify-end">
							<button 
								onClick={()=>(console.log("CANCEL button clicked!"))}
								className="px-6 py-2 mr-2 border-black-100 text-black rounded-md shadow hover:bg-gray-100"
							>
								Cancel
							</button>
							<button 
								onClick={userInfoUpdateHandler}
								className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-gray-600"
							>
								Save
							</button>
						</div>
					</div>

					{/* Edit Photo section */}
					<div className="p-4 border-2 mt-6 border-gray-200 rounded-lg dark:border-gray-700">
						{/* Heading */}
						<h1>Your photo</h1>

						{/* Image preview */}
						<div className="mt-4 flex flex-row">
							<div className="w-12 h-12 rounded-full object-cover bg-gray-100 text-sm" >
								{/* {previewUrl && <img src={import.meta.env.VITE_ASSETS_URL+'/'+previewUrl} alt="Preview" />} */}
								{previewUrl && 
									<img
										src={
											file
												? previewUrl // If a new image is selected, use the data URL directly
												: `${import.meta.env.VITE_ASSETS_URL}/${previewUrl}` // If updating, use the existing URL
										}
										alt="Preview"
									/>}
								{/* {previewUrl && <img src={previewUrl} alt="Preview" />} */}
								{!previewUrl && <img src={profileImg} alt="default" />}
							</div>
							<div>
								<div className="flex flex-col">
									<h1 className="ml-2">Edit your photo</h1>
									<div className="flex flex-row">
										<button 
											type='button'
											onClick={userImageRemoveHandler}
											className=" text-black px-2 py-1 rounded-full  "
										>Remove Existing Image</button>
									</div>
								</div>
							</div>
						</div>

						{/* Selecting the file */}
						<div className="mt-4 p-8 border-dashed border-2 border-gray-400 ">
							<p className="text-gray-500 text-center">
								Click to upload or drag and drop
							</p>
							<p className="text-blue-300 text-center">SVG, PNG, JPG or GIF</p>
							<p className="text-gray-500 text-center">(max 800 x 800px)</p>
							<input
								id="settings_image"
								ref={filePickerRef}
								type="file"
								accept=".jpg,.png,.jpeg"
								onChange={pickedHandler}
								// onClick={pickImageHandler}
							/>
						</div>

						{/* Cancel and Save Buttons */}
						<div className="mt-5 flex justify-end">
							<button className="px-6 py-2 mr-2 border-black-100 text-black rounded-md shadow hover:bg-gray-100">
								Cancel
							</button>
							<button 
								type='button'
								className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-gray-600"
								onClick={userImageUpdateHandler}
							>
								Save
							</button>
						</div>

					</div>
				</div>
			</div>
		</div>
	)
}

export default EditProfile
