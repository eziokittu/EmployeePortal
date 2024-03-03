import React, { useContext, useState } from 'react';
import { AuthContext } from '../Backend/context/auth-context';

function ContactForm() {
  const auth = useContext(AuthContext);

  const [state, setState] = useState({
    name: auth.firstname+' '+auth.lastname,
    email: auth.email,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Function to submit mail using formspree
  const handleSubmit = (e) => {
    e.preventDefault();
    const formAction = 'https://formspree.io/f/mjvnwzko'; // replace with other id
    fetch(formAction, {
      method: 'POST',
      body: JSON.stringify(state),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    })
    .then(response => {
      if (response.ok) {
        alert('Message sent successfully.');
        setState({
          name: auth.firstname+' '+auth.lastname,
          email: auth.email,
          message: ''
        });
      } else {
        alert('There was a problem with your submission. Please try again.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    });
  };

  return (
    
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
        <section id="form" className="bg-white rounded-lg flex flex-col items-center gap-4">

          {/* Heading */}
          <h1 className="text-3xl ">Contact Form</h1>
          <p className=" text-base">Fill out the form below and we will get back to you.</p>

          {/* Contact Form */}
          <form 
            onSubmit={handleSubmit} 
            id="contact" 
            className="bg-white min-w-[40rem] min-h-[25rem] p-4 flex flex-col justify-between"
          >
            {/* Name */}
            <div className="mb-4 relative">
              <label htmlFor="contact_name">Name</label>
              <input
                // onChange={(event) => setInputName(event.target.value)}
                value={state.name}
                onChange={handleChange}
                type="text"
                id="contact_name"
                placeholder={auth.firstname+' '+auth.lastname}
                className="block w-full h-10 mt-1 pl-10 border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <svg
                className='absolute left-4 top-10 h-4 w-4 text-gray-400'
                fill="#0d0d0d" width="24" height="24" viewBox="0 0 24 24" id="user" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg"><path id="primary" d="M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,6,6,0,0,1,6-6h6A6,6,0,0,1,21,20Zm-9-8A5,5,0,1,0,7,7,5,5,0,0,0,12,12Z" fill="#0d0d0d" />
              </svg>
            </div>

            {/* Email */}
            <div className="mb-4 relative">
              <label htmlFor="contact_email">Email Address</label>
              <input
                value={state.email}
                onChange={handleChange}
                type="email"
                id="contact_email"
                placeholder={auth.email}
                className="block w-full h-10 mt-1 pl-10 border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
              <svg
                className=' absolute left-4 top-10 h-4 w-4 text-gray-400'
                width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm3.519 0L12 11.671 18.481 6H5.52zM20 7.329l-7.341 6.424a1 1 0 0 1-1.318 0L4 7.329V18h16V7.329z" fill="#0D0D0D" />
              </svg>
            </div>

            {/* Message */}
            <div className='mb-4'>
              <label htmlFor="contact_message">Message</label>
              <textarea
                name='message'
                value={state.message}
                onChange={handleChange}
                id="contact_message"
                rows="6"
                required
                placeholder={"Enter your message"}
                className="block p-2 w-full mt-1 border-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              ></textarea>
            </div>

            {/* Submit Button */}
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