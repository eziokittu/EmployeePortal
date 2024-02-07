import React from 'react';
import { Link } from 'react-router-dom';

// import './Button.css';

const Button = props => {
  if (props.href) {
    return (
      <a
        className={``}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className='text-teal-500 bg-transparent border border-solid border-teal-500 hover:bg-teal-500 hover:text-rose-200 active:bg-teal-600 font-bold text-lg px-4 py-2 rounded-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"'
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      // className={`button button--${props.size || 'default'} ${props.inverse &&
      //   'button--inverse'} ${props.danger && 'button--danger'}`}
      className='className="text-teal-500 bg-transparent border border-solid border-teal-500 hover:bg-teal-500 hover:text-rose-200 active:bg-teal-600 font-bold text-lg px-4 py-2 rounded-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"'
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
