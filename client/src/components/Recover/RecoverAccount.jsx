import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useHttpClient } from '../Backend/hooks/http-hook';
import { AuthContext } from '../Backend/context/auth-context';

import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseAuth } from '../firebase/firebase-config';

const RecoverAccount = () => {
	const { sendRequest } = useHttpClient();
	const auth = useContext(AuthContext);
	const navigate = useNavigate();
	let confirmationResult = useRef(null);

	const [inputEmail, setInputEmail] = useState('');
	const [inputPhone, setInputPhone] = useState('');
	const [inputPassword, setInputPassword] = useState('');
	const [isPasswordUpdated, SetsPasswordUpdated] = useState(false);

  const [clickedOnGeneratePassword, setClickedOnGeneratePassword] = useState(false);

	const validateInput1 = () => {
    let alerts = [];

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputEmail.trim() || !emailRegex.test(inputEmail)) {
      alerts.push('Enter a valid email');
    }

    // Phone Validation
    const phoneRegex = /^\+?[0-9]{10}(?:[0-9]{2})?$/;
		if (!inputPhone.trim() || !phoneRegex.test(inputPhone)) {
			alerts.push('Enter a valid phone number (only numbers or \'+\' allowed, minimum length 10, maximum length 13)');
		}

    return alerts; // Return the alerts array directly
  };

  const validateInput2 = () => {
    let alerts = [];

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!inputEmail.trim() || !emailRegex.test(inputEmail)) {
      alerts.push('Enter a valid email');
    }

    // Phone Validation
    const phoneRegex = /^\+?[0-9]{10}(?:[0-9]{2})?$/;
		if (!inputPhone.trim() || !phoneRegex.test(inputPhone)) {
			alerts.push('Enter a valid phone number (only numbers or \'+\' allowed, minimum length 10, maximum length 13)');
		}

    // Password validation
    if (!inputPassword.trim() || inputPassword.length < 6) {
      alerts.push('Enter a Valid pasword [min length 6] --');
    }

    return alerts; // Return the alerts array directly
  };

	useEffect(() => {
		configureCaptcha();
	}, []);

	const configureCaptcha = () => {
		window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'phone', {
			'size': 'invisible',
			'callback': (response) => {
				// reCAPTCHA solved, allow signInWithPhoneNumber.
				onSignInSubmit();
			}
		}, firebaseAuth);
	};

  const generatePasswordHandler = async event => {
    event.preventDefault();

    // Checking for invalid input
    const validationAlerts = validateInput1()
    if (validationAlerts.length > 0) {
      alert(`Please correct the following input errors:\n- ${validationAlerts.join('\n- ')}`);
      return;
    }

		// Verify if the credentials are correct!
		try {
			const responseData = await sendRequest(
				import.meta.env.VITE_BACKEND_URL+`/users/recovery/verify-details`,
				'POST',
				JSON.stringify({
					email: inputEmail,
					phone: inputPhone,
				}),
				{
					'Content-Type': 'application/json'
				}
			);
			if (responseData.ok===1){
				console.log('User Details are correct');
				alert(`${responseData.message}\n... Generating OTP ...`);
			}
			else {
				alert(responseData.message);
			}
		} catch (err) {
			console.log('ERROR verifying details');
		}

		// getting the phoneNumber
		let phoneNumber;
		if (inputPhone.length === 10) {
			phoneNumber = "+91" + inputPhone;
		}
		else if (inputPhone.length <= 13 && inputPhone[0]!=='+'){
			phoneNumber = "+"+inputPhone;
		}
		else {
			phoneNumber = inputPhone;
		}

		try {
			const appVerifier = window.recaptchaVerifier;
			confirmationResult.current = await signInWithPhoneNumber(firebaseAuth, phoneNumber, appVerifier);
			console.log("OTP has been sent to the number: " + phoneNumber);
			alert("Enter the OTP sent to this number: " + phoneNumber);
			setClickedOnGeneratePassword(true);
		} catch (error) {
			console.error("SMS not sent", error);
			return; // Stop execution on error
		}
		// console.log(confirmationResult.current.verificationId.toString())
	};

	const updatePassword = async event => {
		try {
			const responseData = await sendRequest(
				`${import.meta.env.VITE_BACKEND_URL}/users/recovery/generate-password`,
				'PATCH',
				JSON.stringify({
					email: inputEmail,
					phone: inputPhone,
					password: inputPassword
				}),
				{
					'Content-Type': 'application/json'
				}
			);
	
			if (responseData.ok === 1) {
				console.log(`Password is updated as OTP to database`);
				SetsPasswordUpdated(true);
			} else {
				console.error('ERROR generating and saving password');
			}
		} catch (err) {
			console.error('ERROR generating and saving password');
		}
	}

	const login = async event => {
		try {
			const responseData = await sendRequest(
				import.meta.env.VITE_BACKEND_URL+`/users/login`,
				'POST',
				JSON.stringify({
					email: inputEmail,
					password: inputPassword,
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
				responseData.isMobileOtpVerified,

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
			console.log('ERROR logging in!');
		}
	}
	
	const otpSubmitHandler = async event => {
    event.preventDefault();

		// Checking for invalid input
    const validationAlerts = validateInput2()
    if (validationAlerts.length > 0) {
      alert(`Please correct the following input errors:\n- ${validationAlerts.join('\n- ')}`);
      return;
    }

		// Verify if the otp is correct
		try {
			const result = await confirmationResult.current.confirm(inputPassword);
			console.log("OTP is verified");
			alert("OTP is verified");
			updatePassword();
		} catch (error) {
			alert("Wrong OTP entered OR auth code has expired! Try Again!")
			console.error("User couldn't sign in (bad verification code?)", error);
			return;
		}
  };

	useEffect(() => {
		if (isPasswordUpdated) {
			login();
		}
	}, [isPasswordUpdated]);
	
	
	return (
		<div className="bg-primary-800 min-h-[500px]">
			<div className="flex flex-col items-center justify-center px-6 mx-auto md:h-screen lg:py-0">
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
							Recover Account
						</h1>
						<form 
							className="space-y-4 md:space-y-6" 
						>

							{/* Email */}
							<div>
								<label for="email" className="block text-sm font-medium text-gray-900 ">Enter your email</label>
								<input 
									onChange={(event) => setInputEmail(event.target.value)}
									type="email" 
									name="email" 
									id="email" 
									className="bg-gray-50 border border-gray-400 text-gray-900 sm:text-sm rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
									placeholder="E-mail" 
									required="" 
								/>
							</div>

							{/* Phone */}
							<div>
								<label for="phone" className="block text-sm font-medium text-gray-900 ">Enter phone linked to email</label>
								<input 
									onChange={(event) => setInputPhone(event.target.value)}
									type="number" 
									name="phone" 
									id="phone" 
									placeholder="Phone" 
									className="bg-gray-50 border border-gray-400 text-gray-900 sm:text-sm rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
									required="" 
								/>
							</div>

							{/* Password */}
              {clickedOnGeneratePassword && (
							<div>
								<label for="password" className="block text-sm font-medium text-gray-900 ">Enter Generated Password</label>
								<input 
									onChange={(event) => setInputPassword(event.target.value)}
									type="password" 
									name="password" 
									id="password" 
									placeholder="Password" 
									className="bg-gray-50 border border-gray-400 text-gray-900 sm:text-sm rounded-3xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
									required="" 
								/>
							</div>
              )}

              {/* Login Button */}
              {!clickedOnGeneratePassword && (
                <button 
                  onClick={generatePasswordHandler}
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-3xl text-sm px-5 py-2.5 text-center"
                >
                  Generate Random Password
                </button>
              )}

              {clickedOnGeneratePassword && (
                <button 
                  onClick={otpSubmitHandler}
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-3xl text-sm px-5 py-2.5 text-center"
                >
                  Login with generated OTP as password
                </button>
              )}

							<p className="text-sm font-light text-gray-500 dark:text-gray-400">
								Remember your password? <Link to="/" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
							</p>

						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default RecoverAccount