import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileOtpVerified, setIsMobileOtpVerified] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);

  const [userName, setUserName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [image, setImage] = useState(null);

  const login = useCallback((
      uid, 
      token, 
      isEmployee, 
      isAdmin, 
      isMobileOtpVerified, 

      userName, 
      firstname, 
      lastname, 
      email, 
      phone, 
      bio, 
      role,
      image,

      expirationDate
    ) => {
    setToken(token);
    setIsEmployee(isEmployee);
    setIsAdmin(isAdmin);
    setIsMobileOtpVerified(isMobileOtpVerified);
    setUserId(uid);

    setUserName(userName);
    setFirstname(firstname);
    setLastname(lastname);
    setEmail(email);
    setPhone(phone);
    setBio(bio);
    setRole(role);
    setImage(image);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2); // 2 days
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        isEmployee: isEmployee,
        isAdmin: isAdmin,
        isMobileOtpVerified: isMobileOtpVerified,

        userName: userName,
        firstname: firstname,
        lastname: lastname,
        email: email,
        phone: phone,
        bio: bio,
        role: role,
        image: image,

        expiration: tokenExpirationDate.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setIsEmployee(false);
    setIsAdmin(false);
    setIsMobileOtpVerified(false);

    setUserName(null);
    setFirstname(null);
    setLastname(null);
    setEmail(null);
    setPhone(null);
    setBio(null);
    setRole(null);
    setImage(null);

    localStorage.removeItem('userData');
  }, []);

  const updateUser = useCallback((_userName, _firstname, _lastname, _email, _phone, _bio, _role, _image, _isMobileOtpVerified) => {
    // Update state variables
    setUserName(_userName);
    setFirstname(_firstname);
    setLastname(_lastname);
    setEmail(_email);
    setPhone(_phone);
    setBio(_bio);
    setRole(_role);
    setImage(_image);
    setIsMobileOtpVerified(_isMobileOtpVerified);
  
    // Update localStorage
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData) {
      localStorage.setItem(
        'userData',
        JSON.stringify({
          ...storedData,
          userName: _userName,
          firstname: _firstname,
          lastname: _lastname,
          email: _email,
          phone: _phone,
          bio: _bio,
          role: _role,
          image: _image,
          isMobileOtpVerified: _isMobileOtpVerified
        })
      );
    }
  }, []);  

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId, 
        storedData.token, 
        storedData.isEmployee, 
        storedData.isAdmin, 
        storedData.isMobileOtpVerified, 

        storedData.userName, 
        storedData.firstname, 
        storedData.lastname, 
        storedData.email, 
        storedData.phone, 
        storedData.bio, 
        storedData.role, 
        storedData.image, 

        new Date(storedData.expiration));
    }
  }, [login]);

  return { 
    token, 
    login, 
    logout, 
    userId, 
    isEmployee, 
    isAdmin,
    isMobileOtpVerified,

    userName,
    firstname,
    lastname,
    email,
    phone,
    bio,
    role,
    image,

    updateUser, // add updateUser to the returned object
  };
};