import React, { useState, useEffect, useRef } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';

const CertificateAdmin = () => {
  const { sendRequest } = useHttpClient();

  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [newEmployeeRef, setNewEmployeeRef] = useState('');
  const [searchedEmployee, setSearchedEmployee] = useState();
  const [searchedEmployeeDomain, setSearchedEmployeeDomain] = useState();

  // For updating the image
  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);
  const [inputImage, setInputImage] = useState();

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
  
  const validateEmailInput = () => {
    let alerts = [];
    if (newEmployeeEmail.trim()==='' ) {
      alerts.push('Email search query is empty');
    }
    return alerts; // Return the alerts array directly
  };

  const validateRefInput = () => {
    let alerts = [];
    if (newEmployeeRef.trim() === '') {
      alerts.push('Ref ID search query is empty');
    }
    return alerts; // Return the alerts array directly
  };

  // function to fetch employee details by searching with Email
  const searchEmployeeByEmail = async (newEmployeeEmail) => {
    // Checking for invalid input
    const validationAlerts = validateEmailInput()
    if (validationAlerts.length > 0) {
      alert(`Please correct the following input errors:\n- ${validationAlerts.join('\n- ')}`);
      return;
    }
    try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/emp/search/email/${newEmployeeEmail}`
			);
      if (responseData.ok===1){
        console.log("Successfully fetched employee details with search email");
        setSearchedEmployee(responseData.employee);
      }
		} catch (err) {
      alert("No match found for any employee!")
			console.log('ERROR in searching employee with email');
		} 
  }

  // function to fetch employee details by searching with Ref ID
  const searchEmployeeByRef = async (newEmployeeRef) => {
    const validationAlerts = validateRefInput()
    if (validationAlerts.length > 0) {
      alert(`Please correct the following input errors:\n- ${validationAlerts.join('\n- ')}`);
      return;
    }
    try {
      let modifiedRefID = newEmployeeRef.replace(/\//g, ':');
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/emp/search/ref/${modifiedRefID}`
			);
      if (responseData.ok===1){
        console.log("Successfully fetched employee details with search ref ID");
        setSearchedEmployee(responseData.employee);
      }
		} catch (err) {
      alert("No match found for any employee!")
			console.log('ERROR in searching employee with Ref ID');
		} 
  }

  // function to clear the assign employee form
  const clearDetailsHandler = async () => {
    setSearchedEmployee();
  }
  
  // function to assign employee with emp id
  const issueCertificateHandler = async () => {
    try {
      const formData = new FormData();
      formData.append('domain', searchedEmployeeDomain.name);
      formData.append('userId', searchedEmployee._id);
      formData.append('certificate', file);
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/certificates/post`,
				'POST',
				formData
			);
      if (responseData.ok===1){
        console.log("Issued new certificate!");
        alert("Issued new certificate!");
        setTimeout(() => {
          window.location.reload(false);
        }, 1500);
      }
      else {
        alert(responseData.message);
      }
		} catch (err) {
			console.log('ERROR issuing certificate to employee, '+err);
		}
  }

  // Function to fetch searched employee domain 
  useEffect(() => {
    const fetchSearchedEmployeeDomain = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/domains/get/${searchedEmployee.domain}`
        );
        if (responseData.ok === 1) {
          setSearchedEmployeeDomain(responseData.domain);
        }
        else {
          console.log("Error in setting domain name for searched employee");
        }
      } catch (err) {
        console.log("Error in fetching domain " + err);
      }
    };
    fetchSearchedEmployeeDomain();
  }, [searchedEmployee]);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-300 bg-slate-100 rounded-lg ">
        {/* Certificates Heading Section */}
        <div className="bg-white rounded-lg mb-4">

          {/* heading */}
          <h1 className="text-3xl font-bold pb-8 pt-14 text-center">Issue a new Certificate</h1>

          {/* Form input section */}
          <div className="flex justify-center items-center">
            <div className='w-1/2'>

              {/* Search by Email Id */}
              <div className=''>
                <label htmlFor="search_email">Search By Email</label>
                <div className="flex flex-row gap-2">
                  <input
                    onChange={(event) => setNewEmployeeEmail(event.target.value)}
                    type="text"
                    id="search_email"
                    value={newEmployeeEmail}
                    className="px-2 block w-full h-10 mt-1 bg-white border-gray-300 border-2 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 placeholder:px-4"
                    placeholder="Enter Email to search"
                  />
                  <button 
                    onClick={()=>(searchEmployeeByEmail(newEmployeeEmail))}
                    className='bg-green-500 hover:bg-green-800 text-white px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-gray-600'
                  >Search</button>
                </div>
              </div>

              {/* OR */} 
              <div className="font-bold text-lg mb-4 mt-2 text-center">OR</div>

              {/* Search by Employee Ref ID */}
              <div className="">
                <label htmlFor="search_ref">Search Ref ID</label>
                <div className="flex flex-row gap-2">
                  <input
                  onChange={(event) => setNewEmployeeRef(event.target.value)}
                    type="text"
                    id="search_ref"
                    value={newEmployeeRef}
                    className="px-2 block w-full h-10 mt-1 bg-white border-gray-300 border-2 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 placeholder:px-4"
                    placeholder="Enter Reference ID to search"
                  />
                  <button 
                    onClick={()=>(searchEmployeeByRef(newEmployeeRef))}
                    className='bg-green-500 hover:bg-green-800 text-white px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-gray-600'
                  >Search</button>
                </div>
              </div>

              {/* Choose file Option - upload Certificate*/}
              <div className="my-5">
                <label htmlFor="certificate_file">Choose Certificate to issue</label>
                <input
                  id='certificate_file'
                  className='block w-full h-10 mt-1 bg-white border-gray-300 border-2 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-4 py-1'
                  type="file"
                  ref={filePickerRef}
                  placeholder='Enter SRS'
                  accept=".pdf"
                  onChange={pickedHandler}
                />
              </div>

              {/* Searched Employee Details */}
              <div className='col-span-2 flex flex-col justify-center items-center bg-gray-100 rounded-lg p-2 border-2 border-gray-300'>
                <h2 className="text-lg text-black underline underline-offset-4">Employee Details</h2>
                {!!searchedEmployee && searchedEmployeeDomain && (
                <div className='text-black text-sm text-center'>
                  <p className=" ">{`${searchedEmployee.firstname} ${searchedEmployee.lastname}`}</p>
                  <p className=" ">{`${searchedEmployee.phone}`}</p>
                  <p className=" ">{`${searchedEmployeeDomain.name}`}</p>
                  <p className=" ">{`${searchedEmployee.ref}`}</p>
                </div>
                )}
                {!searchedEmployee && (
                <div className='text-black text-sm text-center'>
                  <p className=" ">Search an employee</p>
                  <p className=" ">using Reference ID</p>
                  <p className=" ">or Email</p>
                </div>
                )}
                <button 
                  disabled={!searchedEmployee}
                  className={`${!!searchedEmployee ? `bg-red-500 hover:bg-red-800` : `bg-gray-400`}  text-white rounded-lg mt-4 px-4 py-1`}
                  onClick={clearDetailsHandler}
                >Clear</button>
                
              </div>

              {/* Issue Button */}
              <div className="my-8 flex justify-center">
                <button 
                  disabled={!searchedEmployee}
                  onClick={issueCertificateHandler}
                  className="px-6 py-3 mb-6 w-full font-bold disabled:bg-gray-400 bg-blue-500 hover:bg-blue-800 text-white rounded-md shadow">
                  Issue Certificate
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CertificateAdmin