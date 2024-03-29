import React, {useState, useEffect} from "react";
import { useHttpClient } from '../Backend/hooks/http-hook';
import { useNavigate } from "react-router-dom";

function CreateOffer() {
  const { sendRequest } = useHttpClient();
  const navigate = useNavigate();

  const [offerType, setOfferType] = useState('internship');
  const [projectDomains, setProjectDomains] = useState([]);
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
        if (responseData.ok===1){
          setProjectDomains(responseData.domains);
          setSelectedDomain(responseData.domains[0].name)
        }
      } catch (err) {
        console.log("Error in fetching domains: "+err);
      }
    };
    fetchProjectDomains();
  }, []);

  // function to check for invalid inputs and return the list of error message strings
  const validateCreateOfferInput = () => {
    let alerts = [];
    if (!inputCtc.trim()) {
      setInputCtc('-');
			// alerts.push('Enter a valid CTC ');
		}
    if (!inputStipend.trim()) {
      setInputStipend('-');
			// alerts.push('Enter a valid Domain name');
		}
    if (!inputHeading.trim()) {
			alerts.push('Offer name cannot be empty');
		}
    if (!inputLink.trim()) {
      setInputLink('-');
			// alerts.push('Enter a valid Domain name 2 for Ref ID');
		}
		return alerts; // Return the alerts array directly
	}

  const createOfferHandler = async event => {
    event.preventDefault();
		try {
      // Checking for invalid input
      const validationAlerts = validateCreateOfferInput()
      if (validationAlerts.length > 0) {
        alert(`Please correct the following input errors:\n- ${validationAlerts.join('\n- ')}`);

        // Resetting the window after pressing okay in the alert
        setTimeout(() => {
          window.location.reload(false);
        }, 300);
        return;
      }

      // setting the data to be sent
      let postData;
      if (offerType==='job') {
        postData = {
          ctc: inputCtc,
          heading: inputHeading,
          link: inputLink,
          domain: selectedDomain
        }
      } else {
        postData = {
          stipend: inputStipend,
          heading: inputHeading,
          link: inputLink,
          domain: selectedDomain
        }
      }
			const responseData = await sendRequest(
				import.meta.env.VITE_BACKEND_URL+`/offers/post/${offerType}`,
				'POST',
				JSON.stringify(postData),
				{
					'Content-Type': 'application/json'
				}
			);
			if (responseData.ok===1){
        console.log("Added new Offer");
        alert(`Created new ${offerType} listing:\nHeading: ${inputHeading}\nLink: ${inputLink}\nDomain: ${selectedDomain}\n${offerType==='job' ? `CTC:${inputCtc}`: `Stipend: ${inputStipend}`}`);
      }
      else {
        console.log("Creating new offer failed!");
      }
			
		} catch (err) {
			console.log('ERROR Creating offer listing, ERROR: '+err);
		}
  };

  const cancelOfferHandler = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, 300);
  }

  return (
    <div className="p-4 sm:ml-64 bg-blue-50 min-h-[500px]">

      {/* Create Internship Offer */}
      <div className="flex flex-col justify-center items-center w-1/2 mx-auto">

        {/* Heading */}   
        <p className="text-3xl font-bold">Create Offer Listing</p>

        {/* Select offer type */}
        <p className="text-lg mt-8 mr-auto">Choose Offer Type</p>
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
            {projectDomains && (
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
            )}
          </div>

          {/* Offer Stipend */}
          {offerType==='internship' && (
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
          {offerType==='job' && (
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
          <div className="flex gap-2 justify-center w-full">
            <button 
              className="p-4 text-white bg-blue-500 hover:bg-blue-800 rounded-md w-[100px] text-xl" 
              onClick={createOfferHandler}
            >Create</button>
            <button 
              className="p-4 text-white bg-gray-400 hover:bg-gray-600 rounded-md w-[100px] text-xl" 
              onClick={cancelOfferHandler}
            >Cancel</button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CreateOffer