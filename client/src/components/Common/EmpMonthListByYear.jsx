import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmpMonthListByYear = ({ reloadNeeded, startYear }) => {
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState(null);
  const [monthYear, setMonthYear] = useState('');

  // Function to handle click on year button
  const handleYearClick = (year) => {
    setSelectedYear(selectedYear === year ? null : year);
  };

  // Function to handle click on month button
  const handleMonthClick = (month, year) => {
    setMonthYear(`${month.substring(0, 3).toLowerCase()}-${year}`);
    navigate(`/employee-of-the-month/${month.substring(0, 3).toLowerCase()}-${year}`)
    if (reloadNeeded) {
      setTimeout(() => {
        window.location.reload(false);
      }, 300);
    }
  };

  // Function to generate months array for a specific year
const generateMonthsForYear = (year) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  let startMonth, endMonth;

  if (year === parseInt(startYear.split('/')[2])) {
    // Starting year: start from the provided month
    startMonth = parseInt(startYear.split('/')[1]);
    endMonth = currentYear === year ? currentMonth : 12;
  } else {
    // For other years, start from January
    startMonth = 1;
    endMonth = currentYear === year ? currentMonth : 12;
  }

  const months = [];

  // Generate months in reverse order
  for (let month = endMonth; month >= startMonth; month--) {
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    months.push({ month: monthName, year });
  }

  return months;
};



  // Render months for selected year
  const renderMonthsForYear = () => {
    if (selectedYear === null) return null;
    const months = generateMonthsForYear(selectedYear);
    return (
      <div className="flex flex-wrap mt-2 gap-2 mx-4 text-center items-center justify-center rounded-lg bg-gray-200 p-2">
        {months.map((monthObj, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-gray-100 hover:bg-white rounded"
            onClick={() => handleMonthClick(monthObj.month, monthObj.year)}
          >
            {monthObj.month}
          </button>
        ))}
      </div>
    );
  };

  // Render years
  const renderYears = () => {
    const startYearNum = parseInt(startYear.split('/')[2]);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const years = [];

    for (let year = currentYear; year >= startYearNum; year--) {
      years.push(year);
    }

    return years.map((year, index) => (
      <div key={index} className="">
        <button
          className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded  ${selectedYear === year ? 'bg-gray-400' : ''}`}
          onClick={() => handleYearClick(year)}
        >
          {year}
        </button>
        <div className='text-center justify-center items-center content-center'>
          {selectedYear === year && renderMonthsForYear()}
        </div>
      </div>
    ));
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">View previous employee of the months</h1>
      <div className="flex flex-col bg-white drop-shadow-lg rounded-lg gap-2 py-2">
        {renderYears()}
        {monthYear && (
          <p className="">Selected Month: {monthYear}</p>
        )}
      </div>
    </div>
  );
};

export default EmpMonthListByYear;