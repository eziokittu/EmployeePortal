import React, { useState, useEffect } from "react";
import { useHttpClient } from '../Backend/hooks/http-hook';
import { Link, useParams, useNavigate } from "react-router-dom";

function EditOffer() {
  const { sendRequest } = useHttpClient();
  const [loadedOffer, setLoadedOffer] = useState();
  const [loadedOfferDomain, setLoadedOfferDomain] = useState();
  const { oid } = useParams();
  const navigate = useNavigate();

  const [offerType, setOfferType] = useState('internship');
  const [projectDomains, setProjectDomains] = useState();
  const [selectedDomain, setSelectedDomain] = useState();
  const [inputHeading, setInputHeading] = useState('');
  const [inputStipend, setInputStipend] = useState('');
  const [inputCtc, setInputCtc] = useState('');
  const [inputLink, setInputLink] = useState('');

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

    // Function to fetch the offer
    const fetchOffer = async event => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/offers/get/offer/${oid}`
        );
        if (responseData.ok === 1) {
          setLoadedOffer(responseData.offer);
          setOfferType(responseData.offer.type)
          setInputLink(responseData.offer.link)
          setInputCtc(responseData.offer.ctc)
          setInputStipend(responseData.offer.stipend)
          setInputHeading(responseData.offer.heading)
          setInputHeading(responseData.offer.heading)
        }
      } catch (err) {
        console.log("Error in fetching offer: "+err);
      }
    };
    fetchProjectDomains();
    fetchOffer();
  }, []);

  // Initial fetch + fetch on change in loadedOffer
  useEffect(() => {
    // Function to fetch the offer domain
    const fetchOfferDomain = async event => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/domains/get/${loadedOffer.domain}`
        );
        if (responseData.ok === 1) {
          setLoadedOfferDomain(responseData.domain);
        }
      } catch (err) {
        console.log("Error in fetching offer domain! ERROR: "+err);
      }
    };
    if (loadedOffer){
      fetchOfferDomain();
    }
  }, [loadedOffer]);

  // function to check for invalid inputs and return the list of error message strings
  const validateCreateOfferInput = () => {
    let alerts = [];
    if (!inputHeading.trim()) {
      alerts.push('Offer name cannot be empty');
    }
    return alerts; // Return the alerts array directly
  }

  const editOfferHandler = async event => {
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

      // Setting the data to be sent based on the offer type
      let patchData = {
        heading: inputHeading,
        link: correctedLink,
        domain: selectedDomain
      };

      if (offerType === 'job') {
        patchData.ctc = correctedCtc;
      } else {
        patchData.stipend = correctedStipend;
      }

      // Sending the PATCH request
      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/offers/patch/${offerType}/${oid}`,
        'PATCH',
        JSON.stringify(patchData),
        {
          'Content-Type': 'application/json'
        }
      );

      if (responseData.ok === 1) {
        console.log("Edited Offer Successfully");
        alert(`Edited ${offerType} listing:\nHeading: ${inputHeading}\nLink: ${correctedLink}\nDomain: ${selectedDomain}\n${offerType === 'job' ? `CTC: ${correctedCtc}` : `Stipend: ${correctedStipend}`}`);
      } else {
        console.log("Editing offer failed!");
      }

    } catch (err) {
      console.log('ERROR Editing offer listing, ERROR: ' + err);
    }
  };

  const deleteOfferHandler = async event => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/offers/delete/offer/${oid}`,
        'DELETE',
        [],
        {
          'Content-Type': 'application/json'
        }
      );

      if (responseData.ok === 1) {
        alert("Deleted Offer Successfully");
        console.log("Deleted Offer Successfully");
        setTimeout(() => {
					navigate(`/${offerType}s`)
				}, 500);
      } else {
        alert("deleting offer failed!");
        console.log("deleting offer failed!");
      }

    } catch (err) {
      alert('ERROR deleting offer listing, ERROR: ' + err);
      console.error('ERROR deleting offer listing, ERROR: ' + err);
    }
  };

  const resetOfferHandler = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 300);
  }

  return (
    <div className="p-4 sm:ml-64 ">
      <div className="bg-blue-50 min-h-[500px] border-2 border-gray-300 p-8 rounded-xl">

        {/* Create Internship Offer */}
        {projectDomains && loadedOffer &&  (
          <div className="flex flex-col justify-center items-center w-1/2 mx-auto">

            {/* Heading */}
            <p className="text-3xl my-8 font-bold">{`Edit ${offerType} Listing`}</p>

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

              {/* Buttons */}
              <div className="flex flex-col space-y-4">
                <div className="flex gap-2 justify-center w-full">
                  <button
                    className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-800 rounded-md w-[180px] text-xl"
                    onClick={editOfferHandler}
                  >Edit Offer</button>
                  <button
                    className="px-4 py-2 text-white bg-gray-400 hover:bg-gray-600 rounded-md w-[180px] text-xl"
                    onClick={resetOfferHandler}
                  >Reset</button>
                </div>
                <button
                  className="px-4 py-2 text-white bg-red-500 hover:bg-gray-800 rounded-md w-[180px] text-xl mx-auto"
                  onClick={deleteOfferHandler}
                >Delete Offer</button>
              </div>

            </div>
          </div>
        )}

        {!loadedOffer && (
          <div className="flex flex-col justify-center items-center w-1/2 mx-auto">
            <div className="text-3xl font-bold mt-8 mb-4">ERROR: Could not fetch offer with this ID</div>
            <div className="text-lg">[Try Again Later]</div>
          </div>
        )}

        {!projectDomains && (
          <div className="flex flex-col justify-center items-center w-1/2 mx-auto">
            <div className="text-3xl font-bold mt-8 mb-4">ERROR: No Domains found</div>
            <div className="text-lg mb-4">To edit the offer listing, you need to create a domain!</div>
            <button className="rounded-xl bg-blue-500 hover:bg-blue-800 text-white p-4">
              <Link to={'/others'}>Create a domain</Link>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EditOffer