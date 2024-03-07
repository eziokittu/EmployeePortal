import React, {useEffect, useContext, useState, useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHttpClient } from '../Backend/hooks/http-hook';
import Error from "../Error/Error";
import { AuthContext } from "../Backend/context/auth-context";

const Applynow = () => {
	const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const { oid } = useParams(); // Assuming you're correctly extracting the offer ID from the route params
  const navigate = useNavigate();

  // State to hold the loaded offer
  const [loadedOffer, setLoadedOffer] = useState(null);

  // fetches all the details of the offer that is being applied
  useEffect(() => {
    console.log("OfferID: "+oid);
    const fetchOffer = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/offers/get/offer/${oid}`
        );

        if (responseData.offer) {
          // Offer found
          setLoadedOffer(responseData.offer);
        } else {
          // Offer not found
          console.log('Offer not found');
        }
      } catch (err) {
        // Error occurred while fetching offer
        console.log('Error fetching offer:', err.message);
      }
    };

    fetchOffer();
  }, [oid, sendRequest]); // Make sure to include oid and sendRequest in the dependency list

  const [file, setFile] = useState();
  const [isValid, setIsValid] = useState(false);
  const [inputFile, setInputFile] = useState(null);
  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = event => {
    let pickedFile;
    if (event.target.files && event.target.files.length === 1 && isValidFile(event.target.files[0])) 
    {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
    setInputFile(pickedFile);
  };

  const isValidFile = file => {
    const allowedFileTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return allowedFileTypes.includes(file.type);
  };

  // Method to apply in an offer
  const applyOffer = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('file', inputFile);
      formData.append('link', link);
      formData.append('uid', auth.userId);
      formData.append('oid', oid);
      const responseData = await sendRequest(
        `${import.meta.env.VITE_BACKEND_URL}/applied/post`,
        'POST',
        formData
      );
      setTimeout(() => {
        window.location.reload(false);
      }, 1500);
      console.log("Successfully applied to the "+ loadedOffer.type+"!");
    } catch (err) {
      console.log("ERROR applying for this "+ loadedOffer.type+"!");
    }
  };

  return (
    <>
      {/* Apply offer form */}
      {loadedOffer && (
      <div className="p-4 sm:ml-64 bg-blue-50 ">
        <div className="m-5 p-5 bg-white w-8/9 flex justify-center">
          <div className="m-5 p-5 bg-white w-2/3">

            {/* Heading */}
            <h1 className="text-4xl font-bold text-center mb-8">Apply now</h1>

            {/* Internship Details */}
            <div className="mb-4 text-gray-700 text-sm font-bold border-2 border-gray-200 p-4">
              <div className="block mb-2">
                Offer : <span className="font-normal">{loadedOffer.type}</span>
              </div>
              <div className="block mb-2">
                Title : <span className="font-normal">{loadedOffer.heading}</span>
              </div>
              <div className="block mb-2">
                {loadedOffer.type === 'job' ? (
                  <>CTC : <span className="font-normal">{loadedOffer.ctc}</span></>
                ) : (
                  <>Stipend : <span className="font-normal">{loadedOffer.stipend}</span></>
                )}
              </div>
              <div className="block mb-2">
                Last Date to apply : <span className="font-normal">{loadedOffer.date_end.split('T')[0]}</span>
              </div>
            </div>

            {/* Apply form */}
            <form>
              {/* Name */}
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-gray-700 text-sm font-bold mb-2"
                  >
                  Name
                </label>
                <input
                  disabled
                  value={auth.firstname+' '+auth.lastname}
                  type="text"
                  id="name"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email
                </label>
                <input
                  disabled
                  value={auth.email}
                  type="email"
                  id="email"
                  name="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Phone */}
              <div className="mb-4">
                <label
                  htmlFor="number"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Number
                </label>
                <input
                  disabled
                  type="text"
                  id="number"
                  name="number"
                  value={auth.phone}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Button to edit above details */}
              <div className="mb-10 flex justify-center items-center">
                <button
                  onClick={()=>{navigate('/edit-profile')}}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                >
                  Edit Profile Details
                </button>
              </div>

              {/* Portfolio Link */}
              <div className="mb-4">
                <label
                  htmlFor="portfolio"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Portfolio/Website Link (optional)
                </label>
                <input
                  type="text"
                  id="portfolio"
                  name="portfolio"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              {/* Years of Experience */}
              {/* <div className="mb-4">
                <label
                  htmlFor="experience"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Years of Experience
                </label>
                <select
                  id="experience"
                  name="experience"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5+">5+ years</option>
                </select>
              </div> */}

              {/* Resume upload */}
              <div className="mb-4">
                <label
                  htmlFor="resume"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Resume
                </label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                <span className="text-gray-400">PDF or word format</span>
              </div>

              {/* Buttons */}
              <div className="flex justify-center">
                <div className="flex items-center">
                  <button
                    className="bg-white border border-black hover:bg-blue-700 text-black hover:text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline mr-2"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
      )}
      {!loadedOffer && (
        <Error text='No Internship/Job Offer exists with this ID'/>
      )}
    </>
  );
};

export default Applynow;
