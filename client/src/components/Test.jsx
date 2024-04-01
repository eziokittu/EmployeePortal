import React, { useState, useEffect, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { firebaseAuth } from './firebase/firebase-config';

// import { initializeApp } from 'firebase/app';
// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// // Firebase config - replace with your own config
// const firebaseConfig = {
//   apiKey: "AIzaSyCb9uireOMfRCFfJpWWr1WmKdP629rNcCk",
//   authDomain: "trial-34ed7.firebaseapp.com",
//   projectId: "trial-34ed7",
//   storageBucket: "trial-34ed7.appspot.com",
//   messagingSenderId: "71628620493",
//   appId: "1:71628620493:web:7c44729da8f9c541e55f84",
//   measurementId: "G-N9GPF8ZQMZ"
// };

// // Initialize Firebase App
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

function Test() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  let confirmationResult = useRef(null);

  useEffect(() => {
    configureCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      setMobile(value);
    } else if (name === 'otp') {
      setOtp(value);
    }
  };

  const configureCaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'sign-in-button', {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
      }
    }, firebaseAuth);
  };

  const onSignInSubmit = async (e) => {
    e.preventDefault();
    const phoneNumber = "+91" + mobile;
    console.log(phoneNumber);
    const appVerifier = window.recaptchaVerifier;
    try {
      confirmationResult.current = await signInWithPhoneNumber(firebaseAuth, phoneNumber, appVerifier);
      console.log("OTP has been sent");
    } catch (error) {
      console.error("SMS not sent", error);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    try {
      const result = await confirmationResult.current.confirm(otp);
      const user = result.user;
      console.log(JSON.stringify(user));
      alert("User is verified");
    } catch (error) {
      console.error("User couldn't sign in (bad verification code?)", error);
    }
  };

  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={onSignInSubmit}>
        <div id="sign-in-button"></div>
        <input type="text" name="mobile" placeholder="Mobile number" required onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>

      <h2>Enter OTP</h2>
      <form onSubmit={onSubmitOTP}>
        <input type="text" name="otp" placeholder="OTP Number" required onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Test;
