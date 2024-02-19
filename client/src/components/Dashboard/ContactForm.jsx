import React, { useContext, useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { AuthContext } from '../Backend/context/auth-context';

function ContactForm() {
  const auth = useContext(AuthContext);

  const [inputEmail, setInputEmail] = useState(auth.email);
  const [inputMessage, setInputMessage] = useState('Enter your message');
  const [inputName, setInputName] = useState(auth.firstname+' '+auth.lastname);

  const [state, handleSubmit] = useForm("mjvnwzko");
  if (state.succeeded) {
    return <p>Thanks for joining!</p>;
  }

  return (
    
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
        <section id="form" className="bg-white rounded-lg flex flex-col items-center gap-4">
          <h1 className="text-3xl bg-white">Contact Form</h1>
          <p className="bg-white text-base">Fill out the form below and we will get back to you.</p>

          <form 
            onSubmit={handleSubmit} 
            id="contact" 
            className="bg-white min-w-[40rem] min-h-[25rem] p-4 flex flex-col justify-between"
          >
            {/* <div className="input bg-white">
              <p className="bg-white">Name</p>
              <input type="text" name="name" id="name" className="bg-white rounded-md h-6 border border-gray-400 w-full mt-1 p-2"/>
            </div> */}

            <div className="mb-4 relative">
              <label htmlFor="contact_name">Name</label>
              <input
                onChange={(event) => setInputName(event.target.value)}
                type="text"
                id="contact_name"
                placeholder={inputName}
                className="block w-full h-10 mt-1 pl-10 border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <svg
                className='absolute left-4 top-10 h-4 w-4 text-gray-400'
                fill="#0d0d0d" width="24" height="24" viewBox="0 0 24 24" id="user" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg"><path id="primary" d="M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,6,6,0,0,1,6-6h6A6,6,0,0,1,21,20Zm-9-8A5,5,0,1,0,7,7,5,5,0,0,0,12,12Z" fill="#0d0d0d" />
              </svg>
            </div>

            {/* <div className="input bg-white">
              <p className="bg-white">Email</p>
              <input type="email" name="email" id="email" className="bg-white rounded-md h-6 border border-gray-400 w-full mt-1 p-2"/>
            </div> */}

            <div className="mb-4 relative">
              <label htmlFor="contact_email">Email Address</label>
              <input
                onChange={(event) => setInputEmail(event.target.value)}
                type="email"
                id="contact_email"
                placeholder={inputEmail}
                className="block w-full h-10 mt-1 pl-10 border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <svg
                className=' absolute left-4 top-10 h-4 w-4 text-gray-400'
                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm3.519 0L12 11.671 18.481 6H5.52zM20 7.329l-7.341 6.424a1 1 0 0 1-1.318 0L4 7.329V18h16V7.329z" fill="#0D0D0D" />
              </svg>
            </div>

            {/* <div className="input bg-white">
              <p className="bg-white">Message</p>
              <textarea rows="10" placeholder="Write your message here." className="bg-white rounded-md resize-none overflow-hidden h-36 border border-gray-400 w-full mt-1 p-2"></textarea>
            </div> */}

            <div className='mb-4'>
              <label htmlFor="contact_message">Message</label>
              <textarea
                onChange={(event) => setInputMessage(event.target.value)}
                id="contact_message"
                rows="6"
                placeholder={inputMessage}
                className="block p-2 w-full mt-1 border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={state.submitting} 
              className="w-40 text-white bg-purple-700 border-none h-10 rounded-lg font-semibold text-base my-0 mx-auto transition-all duration-400 hover:bg-purple-900 hover:w-44"
              >Submit
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default ContactForm