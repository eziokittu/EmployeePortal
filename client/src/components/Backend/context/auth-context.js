import { createContext } from 'react';

export const AuthContext = createContext({
  isLoggedIn: false,
  isEmployee: false,
  isAdmin: false,
  isMobileOtpVerified: false,
  isTerminated: false,
  userId: null,
  token: null,

  firstname: "",
  lastname: "",
  email: "",
  userName: "",
  phone: "",
  bio: "",
  role: "",
  image: "",
  
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  updateIsMobileOtpVerified: () => {}
});
