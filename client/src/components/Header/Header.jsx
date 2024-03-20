import React, { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom"

import { AuthContext } from "../Backend/context/auth-context"

const Header = () => {
	const auth = useContext(AuthContext);
	const navigate = useNavigate();

	const userLogout = () => {
		setTimeout(() => {
			auth.logout();
			// window.location.reload(false);
			navigate('/')
		}, 1000);
	}

	return (
		<header className="sticky top-0 z-10" >
			<nav className="bg-primary-900 border-gray-200 px-6 py-2.5">
				<div className="flex flex-wrap justify-between items-center mx-auto overflow-hidden">
					<Link to="/">
						<div className='flex items-center'>
							<img className="w-100 h-8 " src="https://framerusercontent.com/images/xLOBENWTydKgd9jy7VGqXoMKkww.png" alt="rnpsoft Logo" />
						</div>
					</Link>
					<Link to='/'>
						<div className='text-white text-3xl font-bold'>Employee Portal</div>
					</Link>
					<div className="flex items-center lg:order-2">
						{!auth.token && (
						<>
							<Link to="/" className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2"
							>Log in / Sign up</Link>
						</>
						)}
						{auth.token && !auth.isAdmin && (
							<>
								{/* Image */}
								<button 
									onClick={()=> {navigate('/account-settings')}}
								>
									<img 
										className='max-w-10 h-10 rounded-lg border-2 border-gray-800 hover:border-gray-400 mr-2'
										src={`${import.meta.env.VITE_ASSETS_URL}/${auth.image}`}
										alt='Profile'
									/>
								</button>

								{/* Name */}
								<button 
									onClick={()=> {navigate('/account-settings')}} 
									className="text-white hover:underline underline-offset-2 decoration-gray-200 focus:ring-2 focus:ring-gray-400 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2"
								>{auth.firstname} {auth.lastname}</button>

								{/* Logout button */}
								<button 
									onClick={userLogout} 
									className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2"
								>Logout</button>
							</>
						)}
						{auth.token && auth.isAdmin && (
							<>
								<p className='text-red-600 text-xl font-bold px-4 lg:px-5 py-2 lg:py-2.5 mr-2'>ADMIN</p>
								<button 
									onClick={userLogout} 
									className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2"
								>Logout</button>
							</>
						)}
					</div>
				</div>
			</nav>
		</header>
	)
}

export default Header
