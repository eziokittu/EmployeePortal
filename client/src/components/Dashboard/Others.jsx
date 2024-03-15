import React, { useState, useEffect} from 'react'
import DomainCard from '../Common/DomainCard';
import { useHttpClient } from '../Backend/hooks/http-hook';

function Others() {
	const { sendRequest } = useHttpClient();

  const [domainName, setDomainName] = useState('');
  const [domainName1, setDomainName1] = useState('');
  const [domainName2, setDomainName2] = useState('');

  // Function to add a new domain
  const addDomainSubmitHandler = async event => {
    event.preventDefault();
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/domains/post`,
				'POST',
				JSON.stringify({
					name: domainName,
          name1: domainName1,
          name2: domainName2
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      console.log("Added new domain");

      // Refreshes the page after 1 second
      setTimeout(() => {
        window.location.reload(false);
      }, 1500);
      
		} catch (err) {
			console.log('ERROR creating new domain');
		}  
  }; 

  // function to reset all input fields when cancel button is clicked
  const addDomainCancelHandler = () => {
    setDomainName('');
    setDomainName1('');
    setDomainName2('');
    console.log("CANCEL button clicked!")
  };

  // function to delete domain
  const deleteDomainHandler = async (name) => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/domains/delete`,
				'DELETE',
				JSON.stringify({
					name: name
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      console.log(`Deleted domain '${name}'`);

      // Refreshes the page after 1.5 second
      setTimeout(() => {
        window.location.reload(false);
      }, 1500);
      
		} catch (err) {
			console.log('ERROR creating new domain');
		} 
  }

  // getting all the domains from database
  const [allDomains, setAllDomains] = useState([]);
  const [domainCount, setDomainCount] = useState(0);
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/domains/get`
        );
        if (responseData.ok===1){
          setAllDomains(responseData.domains);
          setDomainCount(responseData.count);
        }
        else {
          console.log("No domains found!");
        }
      } catch (err) {
        console.log("Error in fetching domains: "+err);
      }
    };
    fetchDomains();
  }, []);

  return (
    <div className="p-4 sm:ml-64">

      {/* View Domain */}
      <div className='bg-gray-50 dark:bg-gray-800 border border-gray-500 rounded-xl'>
        
        {/* Heading Section */}
        <div className="flex items-center justify-center flex-row text-center h-24 rounded ">
          <div>
            <h1 className=' text-2xl font-bold'>All Existing Domains / Roles</h1>
          </div>
        </div>

        {/* Domain Cards */}
        <div className='flex flex-row space-x-2 p-4 bg-gray-100 rounded-b-xl'>
        {allDomains && allDomains.map(domain => (
          <div key={domain._id}>
            <DomainCard
              id = {domain._id}
              name = {domain.name}
              name1 = {domain.name1}
              name2 = {domain.name2}
              deleteDomainHandler = {deleteDomainHandler}
            />
          </div>
        ))}
        {(!allDomains || domainCount === 0) && (
          <div className='mx-auto'>No domains exist! Create one from below</div>
        )}
        </div>
        
      </div>

      {/* Add domain */}
      <div className='bg-gray-50 dark:bg-gray-800 border border-gray-500 rounded-xl mt-8'>

        {/* Add Domain Heading Section */}
        <div className="flex items-center justify-center flex-row text-center h-24 rounded ">
          <div>
            <h1 className=' text-2xl font-bold'>Add Domain / Role</h1>
            <p className='mt-4'>Add the unique domain names for assigning to employees, offers</p>
          </div>
        </div>

        {/* Add domain form*/}
        <form
          onSubmit={addDomainSubmitHandler}
          className="p-4 dark:border-gray-700 flex flex-col bg-gray-100 rounded-b-xl"
        >
          {/* Input fields */}
          <div className='flex flex-row space-x-2 justify-center'>
            {/* Domain Name */}
            <div className="mb-4 relative flex flex-col">
              <label htmlFor="name">Domain Name</label>
              <input
                onChange={(event) => setDomainName(event.target.value)}
                type="text"
                id="name"
                placeholder="Enter domain name"
                className="w-[180px] h-10 bg-blue-100 p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            {/* Domain Name 1 */}
            <div className="mb-4 relative flex flex-col">
              <label htmlFor="name1">Name 1 for Ref ID</label>
              <input
                onChange={(event) => setDomainName1(event.target.value)}
                type="text"
                id="name1"
                placeholder="Enter domain name 1"
                className="w-[180px] h-10 bg-blue-100 p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            {/* Domain Name 2 */}
            <div className="mb-4 relative flex flex-col">
              <label htmlFor="name2">Name 2 for Ref ID</label>
              <input
                onChange={(event) => setDomainName2(event.target.value)}
                type="text"
                id="name2"
                placeholder="Enter domain name 2"
                className="w-[180px] h-10 bg-blue-100 p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Save and Cancel Buttons */}
          <div className="mt-5 flex justify-center">
            <button 
              onClick={addDomainCancelHandler}
              className="px-6 py-2 mr-2 border-black-100 text-black rounded-md shadow hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              type='submit'
              className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-gray-600"
            >
              Save
            </button>
          </div>

        </form>
      </div>

    </div>
  )
}

export default Others