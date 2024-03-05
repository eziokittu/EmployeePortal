import React, { useContext } from 'react'
import { AuthContext } from '../Backend/context/auth-context'

const Footer = () => {
  const auth = useContext(AuthContext);
  return (
    <footer className={`${auth.token ? 'sm:ml-64' : ''} bg-white`}>
      <div className="w-full mx-auto max-w-screen-xl p-4 text-center">
        <span className="text-sm text-gray-500">© 2024 <a href="https://rnpsoft.com/" className="hover:underline">RnPsoft</a>. All Rights Reserved.
        </span>
      </div>
    </footer>

  )
}

export default Footer
