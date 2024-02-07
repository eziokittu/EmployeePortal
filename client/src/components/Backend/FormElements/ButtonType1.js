import React from 'react';

const ButtonType1 = ({ text, functionCallback, moreClasses }) => {
  return (
    <button 
      className={`rounded-full px-5 py-3 text-slate-300 ${moreClasses}
      bg-gradient-to-r from-[#404def] to-[#4520bb]
      hover:bg-gradient-to-r hover:from-gray-400 hover:to-[#4520bb]`}
      onClick={functionCallback}
    >
      {text}
    </button>
  );
};

export default ButtonType1;
