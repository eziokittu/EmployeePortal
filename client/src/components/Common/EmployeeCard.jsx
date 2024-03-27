import StarRatings from 'react-star-ratings';
import React, { useState, useEffect } from 'react'
import { useHttpClient } from '../Backend/hooks/http-hook';
import { Link } from 'react-router-dom';

const EmployeeCard = ({ id, firstname, lastname, employeeID, email, rating }) => {
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

	return (
		<div className="text-sm grid grid-cols-12 gap-5 bg-white drop-shadow-lg rounded-lg p-4 w-full mb-4">
			{/* Employee Name */}
			<div className='flex flex-col justify-center items-center col-span-2'>
				<h2 className="text-md font-bold text-black">{firstname}</h2>
				<h2 className="text-md font-bold text-black">{lastname}</h2>
			</div>
			{/* Employee ID */}
			<div className='flex justify-center items-center col-span-3'>
				<p className=" text-black font-bold">{employeeID}</p>
			</div>
			{/* Employee Email */}
			<div className='flex justify-center items-center col-span-2'>
				<p className=" text-black font-bold">{email}</p>
			</div>
			{/* Star Progress Input */}
			<div className="flex justify-center items-center col-span-3">
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
			{/* View Project Button */}
			<Link
				to={`/${id}/projects`}
				className="flex flex-col justify-center col-span-2 items-center bg-primary-600 hover:bg-blue-600 text-white font-bold p-2 rounded-xl">
				<span>View</span>
				<span className=''>Project</span>
			</Link>
		</div>
	)
}

export default EmployeeCard
