import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const Login = () => {
	const auth = useContext(AuthContext);
	const [inputEmail, setInputEmail] = useState('');
	const [inputPassword, setInputPassword] = useState('');
	const { sendRequest } = useHttpClient();
	const navigate = useNavigate();

	const authSubmitHandler = async event => {
    event.preventDefault();
		try {
			const responseData = await sendRequest(
				import.meta.env.VITE_BACKEND_URL+`/users/login`,
				'POST',
				JSON.stringify({
					email: inputEmail,
					password: inputPassword
				}),
				{
					'Content-Type': 'application/json'
				}
			);
			auth.login(responseData.userId, responseData.token, responseData.isEmployee, responseData.isAdmin, false);
			console.log('Login successful!');
			navigate('/dashboard');
		} catch (err) {
			console.log('ERROR logging in!');
		}  
  };

	return (
		<div>

			<div className="bg-primary-800">
				<div className="flex flex-col items-center justify-center p-6 mx-auto md:h-screen lg:py-0">
					<a href="https://rnpsoft.com" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
						{/* <img className="w-100 h-12 bg-primary-600 py-2 px-4 rounded-xl" src="https://framerusercontent.com/images/xLOBENWTydKgd9jy7VGqXoMKkww.png" alt="logo" /> */}
						<img className="w-100 h-12" src="https://framerusercontent.com/images/xLOBENWTydKgd9jy7VGqXoMKkww.png" alt="logo" />
					</a>
					<div className="w-full bg-white rounded-xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0 ">
						<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
							<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2x">
								Login
							</h1>
							<form 
								className="space-y-4 md:space-y-6" 
								onSubmit={authSubmitHandler}
							>
								<div>
									<input 
										onChange={(event) => setInputEmail(event.target.value)}
										type="text" 
										name="" 
										id="login-input-email" 
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
										placeholder="email" 
										required="" 
									/>
								</div>
								<div>
									<input 
										onChange={(event) => setInputPassword(event.target.value)}
										type="password" 
										name="" 
										id="login-input-password" 
										placeholder="password" 
										className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
										required="" 
									/>
								</div>

								<div className="flex items-center justify-center">
									<a href="#" className="text-sm font-medium text-primary-600 hover:underline">Forgot password?</a>
								</div>
								<button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-3xl text-sm px-5 py-2.5 text-center ">Log in</button>
								<p className="text-sm font-light text-gray-500 dark:text-gray-400">
									Don't have an account yet? <Link to="/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
								</p>
							</form>

							{/* Temporary Button */}
							{/* <button 
								onClick={auth.logout}
								className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-3xl text-sm px-5 py-2.5 text-center "
							>Log out</button> */}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login
