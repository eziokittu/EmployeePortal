import StarRatings from 'react-star-ratings';
import React, { useState, useEffect, useContext, useRef } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Backend/context/auth-context';

const EmployeeCard = ({ id, firstname, lastname, employeeID, email, rating, isPaid, receipt }) => {
  const navigate = useNavigate();
	const { sendRequest } = useHttpClient();
	const [empRating, setEmpRating] = useState(rating);

	// updating star rating function
	const handleRatingChange = async (newRating) => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/edit/rating/`,
				'PATCH',
				JSON.stringify({
					userId: id,
					rating: newRating
				}),
				{
					'Content-Type': 'application/json'
				}
			);
			if (responseData.ok === 1) {
				console.log(`Updated rating to ${newRating}`);
				setEmpRating((newRating));
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while updating employe rating!" + err);
		}
	};

	// updating star rating function
	const markEmployeeAsPaid = async () => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/edit/emptopaid/`,
				'PATCH',
				JSON.stringify({
					userId: id
				}),
				{
					'Content-Type': 'application/json'
				}
			);
			if (responseData.ok === 1) {
				console.log(`Updated employee to paid`);
				setTimeout(() => {
					window.location.reload(false);
				}, 700);
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while updating employee is paid status!" + err);
		}
	};

	// updating star rating function
	const markEmployeeAsUnpaid = async () => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/edit/emptounpaid/`,
				'PATCH',
				JSON.stringify({
					userId: id
				}),
				{
					'Content-Type': 'application/json'
				}
			);
			if (responseData.ok === 1) {
				console.log(`Updated employee to unpaid`);
				setTimeout(() => {
					window.location.reload(false);
				}, 700);
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while updating employee is paid status!" + err);
		}
	};

	const clickEmployeeHandler = () => {
    navigate(`/employee-details/${id}`);
  }

	const removeEmployeeReceipt = async () => {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/users/edit/remove-paid-emp-receipt/`,
        'PATCH',
        JSON.stringify({
					userId: id,
				}),
				{
					'Content-Type': 'application/json'
				}
      );
      if (responseData.ok === 1) {
        alert("Removed payment receipt");
        setTimeout(() => {
          window.location.reload(false);
        }, 700);
      } else {
        console.log(responseData.message);
      }
    } catch (err) {
      console.log('Error removing payment receipt file: ', err);
    }
  };

	// Receipt file
	const [file, setFile] = useState(null);
  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
		if (receipt!=import.meta.env.VITE_USER_DEFAULT_RECEIPT_PATH) {
			receiptUpdateHandler();
		}
		else {
    	receiptUploadHandler();
		}
  }, [file]);

  const pickedHandler = event => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
    }
  };

  const receiptUploadHandler = async () => {
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      formData.append('userId', id);

      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/users/edit/upload-paid-emp-receipt/`,
        'PATCH',
        formData
      );
      if (responseData.ok === 1) {
        alert("Uploaded payment receipt");
        setTimeout(() => {
          window.location.reload(false);
        }, 700);
      } else {
        console.log(responseData.message);
      }
    } catch (err) {
      console.log('Error uploading payment receipt file: ', err);
    }
  };

	const receiptUpdateHandler = async () => {
    try {
      const formData = new FormData();
      formData.append('receipt', file);
      formData.append('userId', id);

      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/users/edit/update-paid-emp-receipt/`,
        'PATCH',
        formData
      );
      if (responseData.ok === 1) {
        alert("Updated payment receipt");
        setTimeout(() => {
          window.location.reload(false);
        }, 700);
      } else {
        console.log(responseData.message);
      }
    } catch (err) {
      console.log('Error updating payment receipt file: ', err);
    }
  };

	return (
		<div className="text-sm grid grid-cols-12 gap-5 bg-white drop-shadow-lg rounded-lg p-2 w-full mb-2">
			
			{/* Employee Name and mark-as-paid buttons */}
			<div className='flex flex-col col-span-2 gap-2 justify-center '>
				<button 
					onClick={clickEmployeeHandler} 
					className='flex flex-col text-center justify-center items-center border-2 hover:border-gray-600 border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-200'
				>
					<h2 className="text-md font-bold text-black">{firstname}</h2>
					<h2 className="text-md font-bold text-black">{lastname}</h2>
				</button>
			
				{!isPaid && (
					<button 
						onClick={markEmployeeAsPaid}
						className='flex flex-col text-center justify-center items-center border-2 border-gray-300 hover:border-gray-600 rounded-lg bg-green-100 hover:bg-green-300'
					>
						<span>Mark as</span>
						<span>Paid</span>
					</button>
				)}
				{isPaid && (
					<button 
						onClick={markEmployeeAsUnpaid}
						className='flex flex-col text-center justify-center items-center border-2 border-gray-300 hover:border-gray-600 rounded-lg bg-red-100 hover:bg-red-300'
					>
						<span>Mark as</span>
						<span>Unpaid</span>
					</button>
				)}
			</div>
			{/* Employee ID */}
			<div className='flex justify-center items-center text-center col-span-3'>
				<p className=" text-black font-bold">{employeeID}</p>
			</div>
			{/* Employee Email */}
			<div className='flex justify-center items-center text-center col-span-2'>
				<p className=" text-black font-bold">{email}</p>
			</div>
			{/* Star Progress Input */}
			<div className="flex justify-center items-center text-center col-span-2">
				<StarRatings
					rating={empRating}
					starRatedColor="blue"
					starHoverColor="blue"
					changeRating={handleRatingChange}
					numberOfStars={5}
					starDimension="20px"
					starSpacing="1px"
					name="rating"
				/>
			</div>
			{/* Action Buttons */}
			<div className='flex flex-col col-span-3 gap-2 justify-center '>
				<Link
					to={`/${id}/projects`}
					className="flex flex-col text-center justify-center items-center bg-primary-600 hover:bg-blue-600 text-white font-bold py-2 rounded-xl ">
					View Project
				</Link>
				{isPaid && receipt==import.meta.env.VITE_USER_DEFAULT_RECEIPT_PATH && (
					<label htmlFor={`upload_receipt_file_${id}`} className="flex flex-col col-span-2 text-center justify-center items-center bg-primary-600 hover:bg-blue-600 text-white font-bold py-2 rounded-xl cursor-pointer">
						<span>Upload</span>
						<span>Receipt</span>
						<input
							id={`upload_receipt_file_${id}`}
							type="file"
							className="hidden"
							ref={filePickerRef}
							accept=".pdf"
							onChange={pickedHandler}
						/>
					</label>
				)}
				{isPaid && receipt!=import.meta.env.VITE_USER_DEFAULT_RECEIPT_PATH && (
					<div className='grid grid-cols-3 space-x-2'>
						<label htmlFor={`update_receipt_file_${id}`} className="flex flex-col col-span-2 text-center justify-center items-center bg-green-500 hover:bg-green-800 text-white font-bold py-2 rounded-xl cursor-pointer">
							<span>Update</span>
							<span>Receipt</span>
							<input
								id={`update_receipt_file_${id}`}
								type="file"
								className="hidden"
								ref={filePickerRef}
								accept=".pdf"
								onChange={pickedHandler}
							/>
						</label>
						<div className='flex flex-col gap-2 text-center justify-center items-center col-span-1'>
							<a
								href={`${import.meta.env.VITE_ASSETS_URL}/${receipt}`} target="_blank" rel="noopener noreferrer"
								className="flex flex-col text-center justify-center items-center bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 rounded-xl w-full cursor-pointer">
								<span className=''>View</span>
							</a>
							<button
								onClick={removeEmployeeReceipt}
								className="flex flex-col text-center justify-center items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 rounded-xl w-full cursor-pointer">
								<span className=''>Delete</span>
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default EmployeeCard
