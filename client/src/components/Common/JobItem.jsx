import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Backend/context/auth-context';
import { useHttpClient } from '../Backend/hooks/http-hook';
import { Link } from "react-router-dom";

const JobItem=({id, stipend, ctc, heading, domain, date, isInternship, userIsAdmin})=>{
	const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const [appliedCount, setAppliedCount] = useState();
  const [approvedCount, setApprovedCount] = useState();
  useEffect(() => {
    const fetchApplied = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/applied/get/count/${isInternship?'internship':'job'}/applied/${id}`
        );
        setAppliedCount(responseData.count);
      } catch (err) {
        console.log("Error in fetching applied count: "+err);
      }
    };
    const fetchApproved = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/applied/get/count/${isInternship?'internship':'job'}/approved/${id}`
        );
        setApprovedCount(responseData.count);
      } catch (err) {
        console.log("Error in fetching approved count: "+err);
      }
    };
    fetchApplied();
    fetchApproved();
  }, []);

  const [hasApplied, setHasApplied] = useState(false);
  useEffect(() => {
    const fetchApplyStatus = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/applied/get/check/${id}/${auth.userId}`
        );
        setHasApplied(responseData.check);
      } catch (err) {
        console.log("Error in fetching application status: "+err);
      }
    };
    fetchApplyStatus();
  }, []);

  const [thisDomain, setThisDomain] = useState();
  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL+`/domains/get/${domain}`
        );
        setThisDomain(responseData.domain);
      } catch (err) {
        console.log("Error in fetching domain: "+err);
      }
    };
    fetchDomain();
  }, []);

  return(
    <>
      
    <div className="bg-white mt-10 h-60 w-80 p-5 flex flex-col justify-between">

      {/* Top Part */}
      <div className="flex justify-between">
        {/* Job Heading */}
        <p className="text-xl underline underline-offset-4">{heading}</p>

        {/* Job Edit Button */}
        {auth.isAdmin && (
          <Link to={`/edit-offer/${id}`} className="ring-1 ring-white hover:ring-gray-300 px-4 rounded-full hover:bg-gray-100">
            <svg
              className="h-5 mt-1 cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" />
            </svg>
            <p className="text-[12px]">Edit</p>
          </Link>
        )}
      </div>

      {/* Middle Part */}
      <div>

        {/* Stipend / CTC */}
        {isInternship ? (
          <p className="text-gray-400 text-sm">{`${stipend==='-' ? `[No Stipend / Performance Based Bonus]` : `Stipend: ${stipend}`}`}</p>
        ) : (
          <p className="text-gray-400 text-sm">{`${ctc==='-' ? `[CTC cannt be disclosed]` : `CTC: ${ctc}`}`}</p>
        )}

        {/* Domain */}
        {thisDomain && (
          <p className="text-gray-400 text-sm">Domain: {thisDomain.name}</p>
        )}
        {!thisDomain && (
          <p className="text-gray-400 text-sm">Domain: ANY</p>
        )}
      </div>

      {/* DATE */}
      <p className="text-sm mt-1 text-gray-700">Last Date to apply: 
        <span className="pl-2 font-bold">
          {date.split('T')[0]}
        </span>
      </p>

      {/* More details and buttons */}
      <div className="flex justify-between mt-4">
        <div className="flex flex-col">
          <span>
            {appliedCount ? (
              <>Applied : {appliedCount}</>
            ) : (
              <>Applied : 0</>
            )}
          </span>
          {userIsAdmin && (
          <span>
            {approvedCount ? (
              <>Approved : {approvedCount}</>
            ) : (
              <>Approved : 0</>
            )}
          </span>
          )}
        </div>
        {auth.isAdmin===true && (
          <button 
            className="bg-violet-500 hover:bg-violet-800 p-2 pl-5 pr-5 rounded-lg text-white mb-4"
            onClick={()=>{navigate('/applications/'+id)}}
          >View</button>
        )}
        {!auth.isAdmin && !hasApplied && (
          <button 
            className="bg-violet-500 hover:bg-violet-800 p-2 pl-5 pr-5 rounded-lg text-white mb-4"
            onClick={() => {
              if (!auth.isMobileOtpVerified) {
                alert("Your Phone number should be OTP verified before you apply to any offer!");
                setTimeout(() => {
                  navigate('/edit-profile/');
                }, 700);
              } else {
                navigate('/apply/' + id);
              }
            }}
          >Apply</button>
        )}
        {!auth.isAdmin && hasApplied && (
          <p 
            className="bg-green-700 p-2 pl-5 pr-5 rounded-lg text-white mb-4"
          >Already Applied</p>
        )}
      </div>
    </div>
    </>
  );
}
export default JobItem;