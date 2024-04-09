import React, { useState, useEffect} from 'react'
import DomainCard from '../Common/DomainCard';
import RoleCard from '../Common/RoleCard';
import { useHttpClient } from '../Backend/hooks/http-hook';

function Others() {
	const { sendRequest } = useHttpClient();

  const [domainName, setDomainName] = useState('');
  const [domainName1, setDomainName1] = useState('');
  const [domainName2, setDomainName2] = useState('');

  // function to check for invalid inputs and return the list of error message strings
  const validateDomainsInput = () => {
    let alerts = [];
    if (!domainName.trim()) {
			alerts.push('Enter a valid Domain name');
		}
    if (!domainName1.trim()) {
			alerts.push('Enter a valid Domain name 1 for Ref ID');
		}
    if (!domainName2.trim()) {
			alerts.push('Enter a valid Domain name 2 for Ref ID');
		}
		return alerts; // Return the alerts array directly
	}

  // Function to add a new domain
  const addDomainSubmitHandler = async event => {
    event.preventDefault();

    // Checking for invalid input
    const validationAlerts = validateDomainsInput()
    if (validationAlerts.length > 0) {
      alert(`Please correct the following input errors:\n- ${validationAlerts.join('\n- ')}`);
      return;
    }
    
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
      alert(`Added new domain '${domainName}'`)
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
      alert(`Deleted domain '${name}'`)
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

  const [roleName, setRoleName] = useState('');

  const validateRolesInput = () => {
    let alerts = [];
    if (!roleName.trim()) {
			alerts.push('Enter a valid role name');
		}
		return alerts; // Return the alerts array directly
	}

  // Function to add a new domain
  const addRoleSubmitHandler = async event => {
    event.preventDefault();

    // Checking for invalid input
    const validationAlerts = validateRolesInput()
    if (validationAlerts.length > 0) {
      alert(`Please correct the following input errors:\n- ${validationAlerts.join('\n- ')}`);
      return;
    }

		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/roles/post`,
				'POST',
				JSON.stringify({
					name: roleName
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      console.log("Added new role");
      alert(`Added new role '${roleName}'`)

      // Refreshes the page after 1 second
      setTimeout(() => {
        window.location.reload(false);
      }, 1500);
      
		} catch (err) {
			console.log('ERROR creating new role');
		}  
  }; 

  // function to reset all input fields when cancel button is clicked
  const addRoleCancelHandler = () => {
    setRoleName('');
    console.log("CANCEL button clicked!")
  };

  // function to delete domain
  const deleteRoleHandler = async (name) => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/roles/delete`,
				'DELETE',
				JSON.stringify({
					name: name
				}),
				{
					'Content-Type': 'application/json'
				}
			);
      console.log(`Deleted role '${name}'`);
      alert(`Deleted role '${name}'`);

      // Refreshes the page after 1.5 second
      setTimeout(() => {
        window.location.reload(false);
      }, 1500);
      
		} catch (err) {
			console.log('ERROR deleting role');
		} 
  }

  // getting all the domains from database
  const [allRoles, setAllRoles] = useState([]);
  const [roleCount, setRoleCount] = useState(0);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/roles/get`
        );
        if (responseData.ok===1){
          setAllRoles(responseData.roles);
          setRoleCount(responseData.count);
        }
        else {
          console.log("No roles found!");
        }
      } catch (err) {
        console.log("Error in fetching roles: "+err);
      }
    };
    fetchRoles();
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

      {/* View Roles Section */}
      <div className='bg-gray-50 dark:bg-gray-800 border border-gray-500 rounded-xl mt-8'>
        
        {/* Heading Section */}
        <div className="flex items-center justify-center flex-row text-center h-24 rounded ">
          <div>
            <h1 className=' text-2xl font-bold'>All Existing Roles</h1>
          </div>
        </div>

        {/* Role Cards */}
        <div className='flex flex-row space-x-2 p-4 bg-gray-100 rounded-b-xl'>
        {allRoles && allRoles.map(role => (
          <div key={role._id}>
            <RoleCard
              id = {role._id}
              name = {role.name}
              deleteRoleHandler = {deleteRoleHandler}
            />
          </div>
        ))}
        {(!allRoles || roleCount === 0) && (
          <div className='mx-auto'>No roles exist! Create one from below</div>
        )}
        </div>
        
      </div>

      {/* Add Role Section */}
      <div className='bg-gray-50 dark:bg-gray-800 border border-gray-500 rounded-xl mt-8'>

        {/* Add Role Heading Section */}
        <div className="flex items-center justify-center flex-row text-center h-24 rounded ">
          <div>
            <h1 className=' text-2xl font-bold'>Add Role</h1>
            <p className='mt-4'>Add the unique roles for assigning to employees in projects</p>
          </div>
        </div>

        {/* Add Role form*/}
        <form
          onSubmit={addRoleSubmitHandler}
          className="p-4 dark:border-gray-700 flex flex-col bg-gray-100 rounded-b-xl"
        >
          {/* Input fields */}
          <div className='flex flex-row space-x-2 justify-center'>
            {/* Role Name */}
            <div className="mb-4 relative flex flex-col">
              <label htmlFor="name">Role Name</label>
              <input
                onChange={(event) => setRoleName(event.target.value)}
                type="text"
                id="name"
                placeholder="Enter role name"
                className="w-[180px] h-10 bg-blue-100 p-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
          </div>

          {/* Save and Cancel Buttons */}
          <div className="mt-5 flex justify-center">
            <button 
              onClick={addRoleCancelHandler}
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