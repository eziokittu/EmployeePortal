import StarRatings from 'react-star-ratings';
import { useState } from 'react';

const EmployeeCard = ({ firstname, lastname, employeeID, email, progress, link }) => {
    // updating the star rating state
    const [rating, setRating] = useState(progress);
    // updating star rating function
    const handleRatingChange = (newRating) => {
        setRating((newRating));
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
                    rating={rating}
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
            <button
                onClick={() => {
                    window.open(link, '_blank');
                    console.log(link);
                }}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col justify-center col-span-2 items-center bg-primary-600 hover:bg-blue-600 text-white font-bold p-2 rounded-xl">
                <span>View</span>
                <span className=''>Project</span>
            </button>
        </div>
    )
}

export default EmployeeCard
