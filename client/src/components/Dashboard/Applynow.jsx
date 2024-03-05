import React, {useEffect, useContext, useState} from "react";
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

  const [state, setState] = useState({
    name: auth.firstname+' '+auth.lastname,
    email: auth.email,
    phone: auth.phone,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <>
      {/* Apply offer form */}
      {loadedOffer && (
      <div className="p-4 sm:ml-64 bg-blue-50 ">
        <div className="m-5 p-5 bg-white w-8/9 flex justify-center">
          <div className="m-5 p-5 bg-white w-2/3">
              <h1 className="text-4xl font-bold text-center mb-8">Apply now</h1>
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
                    value={state.name}
                    placeholder={auth.firstname+' '+auth.lastname}
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
                    value={auth.email}
                    type="email"
                    id="email"
                    name="email"
                    placeholder={auth.email}
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
                    type="text"
                    id="number"
                    name="number"
                    value={auth.phone}
                    placeholder={auth.phone}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                {/* Portfolio Link */}
                <div className="mb-4">
                  <label
                    htmlFor="portfolio"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Portfolio Link
                  </label>
                  <input
                    type="text"
                    id="portfolio"
                    name="portfolio"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                {/* Years of Experience */}
                <div className="mb-4">
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
                </div>

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
                    accept=".pdf"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <span className="text-gray-400">PDF or word format</span>
                </div>

                <div className="flex justify-center">
                  <div className="flex items-center">
                    <button
                      className="bg-white border border-black hover:bg-blue-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                      type="button"
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
        <Error text='The offer ID is invalid'/>
      )}
    </>
  );
};

export default Applynow;
