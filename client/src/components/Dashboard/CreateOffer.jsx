import React, { useState, useEffect } from "react";
import { useHttpClient } from '../Backend/hooks/http-hook';
import { Link, useNavigate } from "react-router-dom";

function CreateOffer() {
  const { sendRequest } = useHttpClient();
  const navigate = useNavigate();

  const [offerType, setOfferType] = useState('internship');
  const [projectDomains, setProjectDomains] = useState();
  const [selectedDomain, setSelectedDomain] = useState();
  const [inputHeading, setInputHeading] = useState('');
  const [inputStipend, setInputStipend] = useState('');
  const [inputCtc, setInputCtc] = useState('');
  const [inputLink, setInputLink] = useState('');
  const [inputDays, setInputDays] = useState(7);

  // Initial fetch
  useEffect(() => {
    // Function to fetch the project domains
    const fetchProjectDomains = async event => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/domains/get`
        );
        if (responseData.ok === 1) {
          setProjectDomains(responseData.domains);
          setSelectedDomain(responseData.domains[0].name)
        }
      } catch (err) {
        console.log("Error in fetching domains: " + err);
      }
    };
    fetchProjectDomains();
  }, []);

  // function to check for invalid inputs and return the list of error message strings
  const validateCreateOfferInput = () => {
    let alerts = [];
    // if (!inputCtc.trim()) {
    //   alerts.push('Offer CTC cannot be empty');
    // }
    // if (!inputStipend.trim()) {
    //   alerts.push('Offer Stipend cannot be empty');
    // }
    // if (!inputLink.trim()) {
    //   alerts.push('Offer Link cannot be empty');
    // }
    if (!inputHeading.trim()) {
      alerts.push('Offer name cannot be empty');
    }
    return alerts; // Return the alerts array directly
  }

  const createOfferHandler = async event => {
    event.preventDefault();
    try {
      // Checking for invalid input
      const validationAlerts = validateCreateOfferInput();
      if (validationAlerts.length > 0) {
        alert(`Please correct the following input errors:\n- ${validationAlerts.join('\n- ')}`);
        return; // Stopping the function execution if there are validation errors
      }

      // Correcting the data directly for sending
      const correctedStipend = inputStipend.trim() ? inputStipend : '-';
      const correctedCtc = inputCtc.trim() ? inputCtc : '-';
      const correctedLink = inputLink.trim() ? inputLink : '-';
      const correctedDays = inputDays>0 ? inputDays: 7;

      // Setting the data to be sent based on the offer type
      let postData = {
        heading: inputHeading,
        link: correctedLink,
        domain: selectedDomain,
        days: correctedDays
      };

      if (offerType === 'job') {
        postData.ctc = correctedCtc;
      } else { // Assuming it's an internship if not a job
        postData.stipend = correctedStipend;
      }

      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/offers/post/${offerType}`,
        'POST',
        JSON.stringify(postData),
        {
          'Content-Type': 'application/json'
        }
      );

      if (responseData.ok === 1) {
        console.log("Added new Offer");
        alert(`Created new ${offerType} listing:\nHeading: ${inputHeading}\nLink: ${correctedLink}\nDomain: ${selectedDomain}\n${offerType === 'job' ? `CTC: ${correctedCtc}` : `Stipend: ${correctedStipend}`}`);
      } else {
        console.log("Creating new offer failed!");
      }

    } catch (err) {
      console.log('ERROR Creating offer listing, ERROR: ' + err);
    }
  };

  const cancelOfferHandler = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 300);
  }

  return (
    <div className="p-4 sm:ml-64 ">
      <div className="bg-blue-50 min-h-[500px] border-2 border-gray-300 p-8 rounded-xl">

        {/* Create Internship Offer */}
        {projectDomains && (
          <div className="flex flex-col justify-center items-center w-1/2 mx-auto">

            {/* Heading */}
            <p className="text-3xl my-8 font-bold">Create Offer Listing</p>

            {/* Select offer type */}
            <p className="text-lg mr-auto">Choose Offer Type</p>
            <select
              className="mb-4 h-10 w-full rounded-md p-2 bg-blue-100 px-2 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              onClickCapture={e => setOfferType(e.target.value)}
            >
              <option className="" value={'internship'}>Internship</option>
              <option className="" value={'job'}>Job</option>
            </select>

            {/* Form */}
            <div className="flex flex-col justify-center items-center w-full">

              {/* Offer Heading */}
              <div className="mb-4 w-full relative">
                <label className="text-lg" htmlFor="create_heading">Heading</label>
                <input
                  onChange={(event) => setInputHeading(event.target.value)}
                  type="text"
                  id="create_heading"
                  value={inputHeading}
                  placeholder={'Enter Offer Heading'}
                  className="block w-full h-10 mt-1 bg-blue-100 px-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

              {/* Offer Domain */}
              <div className="mb-4 w-full relative">
                <div className="text-lg">Select Domain</div>
                <div className="flex justify-between">
                  <select
                    className='block h-10 mt-1 bg-blue-100 px-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                    defaultValue={projectDomains[0]}
                    value={selectedDomain}
                    onChange={e => setSelectedDomain(e.target.value)}
                  >
                    {projectDomains.map(d => (
                      <option
                        className=""
                        id={d.id}
                        value={d.name}
                      >{d.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={()=>(navigate('/others'))}
                    className="rounded-md bg-gray-400 hover:bg-gray-600 text-white p-2"
                  >Create another domain</button>
                </div>
              </div>

              {/* Offer Stipend */}
              {offerType === 'internship' && (
                <div className="mb-4 w-full relative">
                  <label className="text-lg" htmlFor="create_heading">Stipend</label>
                  <input
                    onChange={(event) => setInputStipend(event.target.value)}
                    type="text"
                    id="create_stipend"
                    value={inputStipend}
                    placeholder={'Enter stipend in string'}
                    className="block w-full h-10 mt-1 bg-blue-100 px-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              )}

              {/* Offer CTC */}
              {offerType === 'job' && (
                <div className="mb-4 w-full relative">
                  <label className="text-lg" htmlFor="create_heading">CTC</label>
                  <input
                    onChange={(event) => setInputCtc(event.target.value)}
                    type="text"
                    id="create_stipend"
                    value={inputCtc}
                    placeholder={'Enter CTC in string'}
                    className="block w-full h-10 mt-1 bg-blue-100 px-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              )}

              {/* Offer Link */}
              <div className="mb-4 w-full relative">
                <label className="text-lg" htmlFor="create_link">Link</label>
                <input
                  onChange={(event) => setInputLink(event.target.value)}
                  type="text"
                  id="create_link"
                  value={inputLink}
                  placeholder={'Enter offer link (if any)'}
                  className="block w-full h-10 mt-1 bg-blue-100 px-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

              {/* Offer Days */}
              <div className="mb-4 w-full relative">
                <label className="text-lg" htmlFor="create_days">Apply Before (in days)</label>
                <input
                  onChange={(event) => setInputDays(event.target.value)}
                  type="number"
                  id="create_days"
                  value={inputDays}
                  placeholder={'Enter number of days till offer expires'}
                  className="block w-full h-10 mt-1 bg-blue-100 px-2 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-center w-full">
                <button
                  className="p-4 text-white bg-blue-500 hover:bg-blue-800 rounded-md w-[180px] text-xl"
                  onClick={createOfferHandler}
                >Create Offer</button>
                <button
                  className="p-4 text-white bg-gray-400 hover:bg-gray-600 rounded-md w-[180px] text-xl"
                  onClick={cancelOfferHandler}
                >Clear</button>
              </div>

            </div>
          </div>
        )}

        {!projectDomains && (
          <div className="flex flex-col justify-center items-center w-1/2 mx-auto">
            <div className="text-3xl font-bold mt-8 mb-4">ERROR: No Domains found</div>
            <div className="text-lg mb-4">To create an offer listing, you need to create a domain!</div>
            <button className="rounded-xl bg-blue-500 hover:bg-blue-800 text-white p-4">
              <Link to={'/others'}>Create a domain</Link>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateOffer