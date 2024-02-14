import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const Settings = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  // For updating the user information
  const [inputFirstName, setInputFirstName] = useState('');
  const [inputLastName, setInputLastName] = useState('');
  const [inputUserName, setInputUserName] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputBio, setInputBio] = useState('');
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
      console.log("User details updated successfully!");
    } catch (err) {
      console.log('ERROR updating user details!');
    }
  };

  // For updating the image
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const [inputImage, setInputImage] = useState(null);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = event => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    // props.onInput(props.id, pickedFile, fileIsValid);
    setInputImage(pickedFile);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  const userImageUpdateHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('image', inputImage);
      formData.append('email', inputEmail); // Hard coded value
      const responseData = await sendRequest(
        import.meta.env.VITE_BACKEND_URL+`/users/edit/image/${auth.userId}`,
        'PATCH',
        formData
      );
      console.log("User image updated successfully!");
    } catch (err) {
      console.log('ERROR updating user image!');
    }
  };

  return (
    <div className="p-4 sm:ml-64">
      <h1 className="m-3 text-2xl">Settings page</h1>

      {/* Personal Information */}
      {/* {loadedUser && ( */}
      <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
        
        {/* Heading */}
        <h1 className="mb-4">Personal Information</h1>

        {/* Full Name*/}
        <div className="flex mb-4">

          {/* First Name */}
          <div className="w-1/2 pr-2 relative">
            <label htmlFor="name">First name</label>
            <input
              onChange={(event) => setInputFirstName(event.target.value)}
              type="text"
              id="settings_fname"
              className="block w-full pl-8 h-10 mt-1 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <svg
              className="absolute left-2 top-10 h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 48 48"
              id="person"
            >
              <path
                fill="#333"
                fill-rule="evenodd"
                d="M24 24C28.4204 24 32 20.4204 32 16 32 11.5796 28.4204 8 24 8 19.5796 8 16 11.5796 16 16 16 20.4204 19.5796 24 24 24zM34 16C34 21.525 29.525 26 24 26 18.475 26 14 21.525 14 16 14 10.475 18.475 6 24 6 29.525 6 34 10.475 34 16zM9.22348 34.2119C8.22038 35.0211 8 35.6291 8 36V40H40V36C40 35.6291 39.7796 35.0211 38.7765 34.2119 37.7958 33.4207 36.3341 32.6669 34.5622 32.015 31.0199 30.7117 26.7532 30 24 30 21.2468 30 16.9801 30.7117 13.4378 32.015 11.6659 32.6669 10.2042 33.4207 9.22348 34.2119zM24 28C17.9925 28 6 31.0347 6 36V42H42V36C42 31.0347 30.0075 28 24 28z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          
          {/* Last Name */}
          <div className="w-1/2  relative">
            <label htmlFor="name">Last name</label>
            <input
              onChange={(event) => setInputLastName(event.target.value)}
              type="text"
              id="settings_lname"
              className="block w-full pl-8 h-10 mt-1 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
            <svg
              className="absolute left-2 top-10 h-4 w-4 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 48 48"
              id="person"
            >
              <path
                fill="#333"
                fill-rule="evenodd"
                d="M24 24C28.4204 24 32 20.4204 32 16 32 11.5796 28.4204 8 24 8 19.5796 8 16 11.5796 16 16 16 20.4204 19.5796 24 24 24zM34 16C34 21.525 29.525 26 24 26 18.475 26 14 21.525 14 16 14 10.475 18.475 6 24 6 29.525 6 34 10.475 34 16zM9.22348 34.2119C8.22038 35.0211 8 35.6291 8 36V40H40V36C40 35.6291 39.7796 35.0211 38.7765 34.2119 37.7958 33.4207 36.3341 32.6669 34.5622 32.015 31.0199 30.7117 26.7532 30 24 30 21.2468 30 16.9801 30.7117 13.4378 32.015 11.6659 32.6669 10.2042 33.4207 9.22348 34.2119zM24 28C17.9925 28 6 31.0347 6 36V42H42V36C42 31.0347 30.0075 28 24 28z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          
        </div>

        {/* Phone No. */}
        <div className="pb-4">
          <label htmlFor="number">Phone number</label>
          <input
            onChange={(event) => setInputPhone(event.target.value)}
            type="text"
            id="settings_phone"
            className="block w-full pl-2 h-10 mt-1 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Email Address */}
        <div className=" mb-4 relative">
          <label htmlFor="email">Email Address</label>
          <input
            onChange={(event) => setInputEmail(event.target.value)}
            type="email"
            id="settings_email"
            className="block w-full h-10 mt-1 pl-8 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <svg
            className="absolute left-2 top-10 h-4 w-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 32 32"
            id="mail"
          >
            <path
              fill="#231f20"
              d="M27,26H5a3,3,0,0,1-3-3V9A3,3,0,0,1,5,6H27a3,3,0,0,1,3,3V23A3,3,0,0,1,27,26ZM5,8A1,1,0,0,0,4,9V23a1,1,0,0,0,1,1H27a1,1,0,0,0,1-1V9a1,1,0,0,0-1-1Z"
            ></path>
            <path
              fill="#231f20"
              d="M16,17a1,1,0,0,1-.55-.17l-12-8A1,1,0,0,1,4.55,7.17l12,8A1,1,0,0,1,16,17Z"
            ></path>
            <path
              fill="#231f20"
              d="M16,17a1,1,0,0,1-.56-1.83l12-8a1,1,0,0,1,1.11,1.66l-12,8A1,1,0,0,1,16,17Z"
            ></path>
          </svg>
        </div>

        {/* UserName */}
        <div className="mb-4 relative">
          <label htmlFor="username">Username</label>
          <input
            onChange={(event) => setInputUserName(event.target.value)}
            type="username"
            id="settings_username"
            className="block w-full h-10 mt-1 pl-8 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio">BIO</label>
          <textarea
            onChange={(event) => setInputBio(event.target.value)}
            id="settings_bio"
            rows="6"
            className="block p-2 w-full mt-1 bg-blue-100 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>

        {/* Cancel and Save Buttons */}
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
      {/* )} */}

      {/* Your Photo */}
      <div className="p-4 border-2 mt-6 border-gray-200 rounded-lg dark:border-gray-700">

        {/* Heading */}
        <h1>Your photo</h1>

        {/* Image preview */}
        <div className="mt-4 flex flex-row">
          <div className="w-12 h-12 rounded-full object-cover bg-gray-100 text-sm" >
            {previewUrl && <img src={previewUrl} alt="Preview" />}
            {!previewUrl && <img src={"noimage"} alt="default" />}
          </div>
          <div>
            <div className="flex flex-col">
              <h1 className="ml-2">Edit your photo</h1>
              <div className="flex flex-row">
                <button className=" text-black px-2 py-1 rounded-full  ">
                  Delete
                </button>
                <button className=" text-black px-2 py-1 rounded-full ">
                  Update
                </button>
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
  );
};

export default Settings;
