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
		<header className="sticky top-0" >
			<nav className="bg-primary-900 border-gray-200 px-6 py-2.5">
				<div className="flex flex-wrap justify-between items-center mx-auto">
					<a href="https://rnpsoft.com" className="flex items-center">
						<img className="w-100 h-8 " src="https://framerusercontent.com/images/xLOBENWTydKgd9jy7VGqXoMKkww.png" alt="rnpsoft Logo" />
					</a>
					<div className="flex items-center lg:order-2">
						{!auth.token && (
						<>
							<Link to="/" className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2">Log in</Link>
							{/* <Link to="/signup" className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2">Sign in</Link> */}
							{/* <Link to="/dashboard" className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2">Dashboard</Link> */}
						</>
						)}
						{auth.token && (
							<button 
								onClick={userLogout} 
								className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-indigo-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2"
							>Logout</button>
						)}
					</div>
				</div>
			</nav>
		</header>
	)
}

export default Header
