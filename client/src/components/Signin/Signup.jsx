import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

const Signup = () => {
	const auth = useContext(AuthContext);
	const [inputEmail, setInputEmail] = useState('');
	const [inputFirstname, setInputFirstname] = useState('');
	const [inputLastname, setInputLastname] = useState('');
	const [inputPassword, setInputPassword] = useState('');
	const [inputConfirmPassword, setInputConfirmPassword] = useState('');
	const { sendRequest } = useHttpClient();
	const navigate = useNavigate();

	const authSubmitHandler = async event => {
    event.preventDefault();

		if (inputConfirmPassword !== inputPassword){
			console.log("Password does not match with confirm password!");
			return;
		}

		// console.log(inputEmail, inputPassword, inputFirstname, inputLastname);

		// console.log(import.meta.env.VITE_BACKEND_URL);
		try {
			const responseData = await sendRequest(
				import.meta.env.VITE_BACKEND_URL+`/users/signup`,
				'POST',
				JSON.stringify({
					email: inputEmail,
					password: inputPassword,
					firstname: inputFirstname,
					lastname: inputLastname,
				}),
				{
					'Content-Type': 'application/json'
				}
			);
			auth.login(
				responseData.userId, 
				responseData.token, 
				responseData.isEmployee, 
				responseData.isAdmin,

				responseData.userName, 
				responseData.firstname, 
				responseData.lastname, 
				responseData.email, 
				responseData.phone, 
				responseData.bio, 
				responseData.role,
				responseData.image,

				false
			);
			console.log('Sign in successful!');
			navigate('/dashboard');
		} catch (err) {
			console.log('ERROR signing in!');
		}
  };
	
	return (
		<div className="bg-primary-800 py-10">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
				<a href="https://rnpsoft.com" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 ">
					<img className="w-100 h-12 " src="https://framerusercontent.com/images/xLOBENWTydKgd9jy7VGqXoMKkww.png" alt="logo" />
				</a>
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
							Create an Account
						</h1>
						<form 
							className="space-y-4 md:space-y-6" 
							onSubmit={authSubmitHandler}
						>

							{/* First name */}
							<div>
								{/* <label for="first-name" className="block mb-2 text-sm font-medium text-gray-900 ">First Name</label> */}
								<input 
									onChange={(event) => setInputFirstname(event.target.value)}
									type="text" 
									name="first-name" 
									id="first-name" 
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
									placeholder="First name" 
									required="" 
								/>
							</div>

							{/* Last Name */}
							<div>
								{/* <label for="last-name" className="block mb-2 text-sm font-medium text-gray-900 ">Last Name</label> */}
								<input 
									onChange={(event) => setInputLastname(event.target.value)}
									type="text" 
									name="last-name" 
									id="last-name" 
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
									placeholder="Last name" 
									required="" 
								/>
							</div>
							{/* <div>
								<input type="text" name="employee-id" id="employee-id" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" placeholder="Employee Id" required="" />
							</div> */}

							{/* Email */}
							<div>
								{/* <label for="email" className="block mb-2 text-sm font-medium text-gray-900 ">Your email</label> */}
								<input 
									onChange={(event) => setInputEmail(event.target.value)}
									type="email" 
									name="email" 
									id="email" 
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
									placeholder="E-mail" 
									required="" 
								/>
							</div>

							{/* Password */}
							<div>
								{/* <label for="password" className="block mb-2 text-sm font-medium text-gray-900 ">Password</label> */}
								<input 
									onChange={(event) => setInputPassword(event.target.value)}
									type="password" 
									name="password" 
									id="password" 
									placeholder="Password" 
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
									required="" 
								/>
							</div>

							{/* Confirm Password */}
							<div>
								{/* <label for="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 ">Confirm password</label> */}
								<input 
									onChange={(event) => setInputConfirmPassword(event.target.value)}
									type="password" 
									name="confirm-password" 
									id="confirm-password" 
									placeholder="Confirm Password" 
									className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
									required="" 
								/>
							</div>

							<button 
								type="submit" 
								className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-3xl text-sm px-5 py-2.5 text-center"
							>Create an account</button>
							<p className="text-sm font-light text-gray-500 dark:text-gray-400">
								Already have an account? <Link to="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Signup
