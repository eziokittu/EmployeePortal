import certificateIcon from "../../assets/certificateIcon.png";
import React, {useEffect, useContext, useState} from "react";
import { AuthContext } from "../Backend/context/auth-context";
import { useHttpClient } from '../Backend/hooks/http-hook';
import { Link } from 'react-router-dom';

const Certificate = () => {
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);

  const [loadedCertificates, setLoadedCertificates] = useState();
  const [certificateCount, setCertificateCount] = useState();

  // fetches all the certificates for the user
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/certificates/get/user/${auth.userId}`
        );

        if (responseData.ok===1) {
          setLoadedCertificates(responseData.certificates);
        } else {
          // Offer not found
          console.log('Offer not found');
        }
      } catch (err) {
        // Error occurred while fetching offer
        console.log('Error fetching offer:', err.message);
      }
    };
    const fetchCertificateCount = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_BACKEND_URL}/certificates/get/count/${auth.userId}`
        );

        if (responseData.ok===1) {
          setCertificateCount(responseData.count);
        } else {
          console.log(responseData.message);
        }
      } catch (err) {
        console.log('Error fetching offer:', err);
      }
    };
    fetchCertificates();
    fetchCertificateCount();
  }, []);

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 bg-slate-100 rounded-lg ">
        {/* Certificates Heading Section */}
        <div className="bg-white h-48 rounded-lg text-center mb-4">
          <h1 className="text-4xl font-bold pb-8 pt-14">View Your Certificates</h1>
          <p className="text-lg">Browse and download certificates for your achievements</p>
        </div>
        {/* Certificates List Section */}
        <div className="bg-white rounded-lg text-center">

          {/* Heading */}
          <h2 className="text-3xl font-bold pb-8 pt-14">{`You have ${(!certificateCount || certificateCount===0)?'NO':`${certificateCount}`} Certificates!`}</h2>

          {/* Body */}
          {loadedCertificates && (
            <div className="grid grid-cols-3 gap-4 mx-20">
              {/* Single certificate card */}
              {loadedCertificates.map((c)=>(
              <a 
                href={`${import.meta.env.VITE_ASSETS_URL}/${c.certificate}`} target="_blank" rel="noopener noreferrer"
                className=" mb-6 py-3 border-2 border-gray-300 rounded-lg bg-gray-100 cursor-pointer" 
              >
                <div className="flex justify-center items-center my-4">
                  <img src={certificateIcon} className="w-100" alt="certificate" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Certification Name</h3>
                <p className="text-large text-gray-800">Issued By: RnPSoft</p>
                <p className="text-large text-gray-800">{`Issued Date: ${c.issueDate}`}</p>
              </a>
              ))}
              
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Certificate
