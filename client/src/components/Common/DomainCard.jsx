import React, { useState } from 'react';

const DomainCard = ({ id, name, name1, name2, deleteDomainHandler }) => {
  const handleDeleteClick = () => {
    deleteDomainHandler(name);
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      key={id}
      className={`flex items-center justify-around rounded-xl `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow relative cursor-pointer"
      >
        <button 
          className={`p-2 text-white rounded-xl  ${isHovered ? 'bg-red-400' : 'bg-blue-500'}`}
          onClick={handleDeleteClick} 
        >
          {name}
          {isHovered && (
            <div 
              onClick={handleDeleteClick} 
              className="absolute top-0 text-red-800"
            >
              &#x2715;
            </div>
          )}
        </button>
        {/* <div>{name1}</div>
        <div>{name2}</div> */}
      </div>
    </div>
  );
};

export default DomainCard;
