import React, { useState, useEffect } from 'react';
import { useHttpClient } from '../Backend/hooks/http-hook';
import Card from '../Common/Card'
import totalProjects from '../../assets/dashboard/total-project.png'
import ongoingProjects from '../../assets/dashboard/ongoing-project.png'
import completedProjects from '../../assets/dashboard/completed-project.png'
import totalUser from '../../assets/dashboard/group.png'
import totalInternships from '../../assets/dashboard/id-card.png'
import totalJobs from '../../assets/dashboard/job-search.png'
import totalApplications from '../../assets/dashboard/window.png'
import totalCertificates from '../../assets/dashboard/medal.png'
import totalEmployees from '../../assets/dashboard/team1.png'

const Dashboard = () => {
	const { sendRequest } = useHttpClient();

	// States
	const [jobCount, setJobCount] = useState(0);
	const [internshipCount, setInternshipCount] = useState(0);
	const [allProjectsCount, setAllProjectsCount] = useState(0);
	const [ongoingProjectsCount, setOngoingProjectsCount] = useState(0);
	const [completedProjectsCount, setCompletedProjectsCount] = useState(0);
	const [applicationsCount, setApplicationsCount] = useState(0);
	const [userCount, setUserCount] = useState(0);
	const [employeeCount, setEmployeeCount] = useState(0);
	const [certificatesCount, setCertificatesCount] = useState(0);

	// Function to get the application count
	const getApplicationCount = async event => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/applied/get/count/applications`
			);
			if (responseData.ok===1){
				setApplicationsCount(responseData.count);
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while fetching applications count!");
		}
	}
	
	// Function to get the toatal certificates issued
	const getCertificatesCount = async event => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/certificates/get/count/`
			);
			if (responseData.ok===1){
				setCertificatesCount(responseData.count);
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while fetching certificates count!");
		}
	}

	// Function to get the total registered user count
	const getUserCount = async event => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/count/`
			);
			if (responseData.ok===1){
				setUserCount(responseData.count);
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while fetching user count!");
		}
	}

	// Function to get the Employee count
	const getEmployeeCount = async event => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/empcount/`
			);
			if (responseData.ok===1){
				setEmployeeCount(responseData.count);
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while fetching Employee count!");
		}
	}
	
	// Function to get the Job count
	const getJobCount = async event => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/offers/get/jobcount`
			);
			if (responseData.ok===1){
				setJobCount(responseData.count);
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while fetching job count!");
		}
	}
	
	// Function to get the internship count
	const getInternshipCount = async event => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/offers/get/internshipcount`
			);
			if (responseData.ok===1){
				setInternshipCount(responseData.count);
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while fetching internship count!");
		}
	}

	// Function to get all projects count
	const getAllProjectsCount = async event => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/projects/count`
			);
			if (responseData.ok===1){
				setAllProjectsCount(responseData.count);
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while fetching all projects count!");
		}
	}

	// Function to get all projects count
	const getOngoingProjectsCount = async event => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/projects/count/ongoing`
			);
			if (responseData.ok===1){
				setOngoingProjectsCount(responseData.count);
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while fetching ongoing projects count!");
		}
	}

	// Function to get all projects count
	const getCompletedProjectsCount = async event => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/projects/count/completed`
			);
			if (responseData.ok===1){
				setCompletedProjectsCount(responseData.count);
			}
			else {
				console.log(responseData.message);
			}
		} catch (err) {
			console.log("Something went wrong while fetching completed projects count!");
		}
	}

	useEffect(() => {
		getApplicationCount();
		getCertificatesCount();
		getUserCount();
		getEmployeeCount();
		getJobCount();
		getInternshipCount();
		getAllProjectsCount();
		getOngoingProjectsCount();
		getCompletedProjectsCount();
	}, []);
	
	return (
		<div className="p-4 sm:ml-64">
			<div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700">
				<h1 className='text-center text-4xl font-bold mt-2 mb-6'>Dashboard</h1>
				<div className="grid grid-cols-3 gap-4 mb-4">
					<Card name='Total Projects' value={allProjectsCount} imgValue={totalProjects} bgColor='bg-indigo-100' />
					<Card name='Ongoing Projects' value={ongoingProjectsCount} imgValue={ongoingProjects} bgColor='bg-red-100' />
					<Card name='Completed Project' value={completedProjectsCount} imgValue={completedProjects} bgColor='bg-green-100' />
				</div>
				<div className="grid grid-cols-2 gap-4 mb-4">
					<Card name={'Total Registered Users'} 
						value={(userCount<1000 ? (userCount<100 ? 'less than 100' : '100+') : (userCount<10000 ? '1000+' : '10,000+'))} 
						imgValue={totalUser} 
						bgColor='bg-yellow-200' 
					/>
					<Card name={'Total Employees'} value={employeeCount} imgValue={totalEmployees} bgColor='bg-purple-300' />
				</div>
				<div className="grid grid-cols-2 gap-4 mb-4 rounded bg-gray-50 dark:bg-gray-800">
					<Card name='Total Jobs' value={jobCount} imgValue={totalJobs} bgColor='bg-lime-200' />
					<Card name='Total Internships' value={internshipCount} imgValue={totalInternships} bgColor='bg-primary-200' />
				</div>
				<div className="grid grid-cols-2 gap-4">
					<Card name='Total Applications' value={applicationsCount} imgValue={totalApplications} bgColor='bg-red-200' />

					<Card name='Total Certificates' value={certificatesCount} imgValue={totalCertificates} bgColor='bg-sky-300' />


				</div>
			</div>
		</div>
	)
}

export default Dashboard
