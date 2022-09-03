import { useState } from "react";
import logo from "../../src/logo.svg";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Deso from "deso-protocol";
const deso = new Deso();
export default function NavBar({ pitchDesk, create }) {
  const [navbar, setNavbar] = useState(false);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [loadingLoginStatus, setLoadingLoginStatus] = useState(true);
  useEffect(() => {
    const loggedInKey = localStorage.getItem("loggedInKey");
    if (loggedInKey) {
      setHasLoggedIn(true);
      setPublicKey(loggedInKey);
    }
    setLoadingLoginStatus(false);
  }, []);

  const handleDesoLogin = async () => {
    const response = await deso.identity.login(4);
    if (response.key) {
      localStorage.setItem("loggedInKey", response.key);
      //reloading page cuz i am lazy to add cases to make it work without load as SPA
      window.location.reload();
    }
  };
  return (
    <nav className='w-full  shadow-sm fixed bg-white border-b'>
      <div className='justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8'>
        <div>
          <div className='flex items-center justify-between py-3  md:block'>
            <div className='flex items-center space-x-1'>
              <img src={logo} alt='logo' className='w-auto h-14 ' />
              <a href='/'>
                <h2 className='text-2xl font-bold'>SheFunds</h2>
              </a>
            </div>
            <div className='md:hidden'>
              <button
                className='p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border'
                onClick={() => setNavbar(!navbar)}>
                {navbar ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-6 h-6'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-6 h-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {!loadingLoginStatus && (
        <div>
          <div
            className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
              navbar ? "block" : "hidden"
            }`}>
            <ul className='items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0'>
              {pitchDesk && (
                <li className='text-gray-600 hover:text-blue-600'>
                  <Link to='/home'>Pitch Deck</Link>
                </li>
              )}
              {create && (
                <li className='text-gray-600 hover:text-blue-600'>
                  <Link
                    to='/pitch'
                    className='bg-blue-500 text-white px-6 py-3 rounded-md shadow-sm hover:bg-blue-700'>
                    Pitch <span className="mx-1 fas fa-pen"></span>
                  </Link>
                </li>
              )}

              {!hasLoggedIn && (
                <li className='text-gray-600 hover:text-blue-600'>
                  <button
                    className='px-8 py-2 primaryColor text-white rounded-md shadow-md hover:shadow-xl'
                    onClick={handleDesoLogin}>
                    Login
                  </button>
                </li>
              )}
              {hasLoggedIn && (
                <li className='text-gray-600 hover:text-blue-600 flex justify-center space-x-1 items-center'>
                  <button
                    id='dropdownDefault'
                    data-dropdown-toggle='dropdown'
                    onClick={() => setDropdown(!dropdown)}>
                    <img
                      src={`https://node.deso.org/api/v0/get-single-profile-picture/${publicKey}?fallback=https://diamondapp.com/assets/img/default_profile_pic.png`}
                      className='w-9 h-9 rounded-full'
                      alt='profile'
                    />
                  </button>

                  {dropdown && (
                    <button
                    className='px-6 py-2  text-red-500 underline hover:text-red-700'
                    onClick={() => {
                      localStorage.removeItem("loggedInKey");
                      window.location.reload();
                    }}>
                    Logout
                  </button>
                  )}
                </li>
              )}

              
            </ul>
          </div>
        </div>
        )}
      </div>
    </nav>
  );
}
