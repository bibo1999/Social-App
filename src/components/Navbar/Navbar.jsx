import style from "./Navbar.module.css"
import { Link, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react';
import { UserData } from "../../Context/UserData";
import logo from "../../assets/fb-profile.png"

export default function Navbar() {
  const navigate = useNavigate();
  let { Token, setToken } = useContext(UserData);

  // State to toggle dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function signout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  return (
    <nav className="bg-neutral-primary w-full dark border-b border-default">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* navlogo */}
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">Social App</span>
        </Link>

        {/* Profile menu */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative">
          {Token !== null ? (
            <>
              <button
                type="button"
                className="flex text-sm bg-neutral-primary rounded-full md:me-0 focus:ring-4 focus:ring-neutral-tertiary"
                onClick={() => setDropdownOpen(!dropdownOpen)} // toggle dropdown
              >
                <span className="sr-only">Open user menu</span>
                <img className="w-8 h-8 rounded-full" src={logo} alt="user photo" />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 z-50 bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44" id="user-dropdown">
                  <div className="px-4 py-3 text-sm border-b border-default">
                    <span className="block text-heading font-medium">Joseph McFall</span>
                    <span className="block text-body truncate">name@flowbite.com</span>
                  </div>
                  <ul className="p-2 text-sm text-body font-medium">
                    <li>
                      <Link
                        to="profile"
                        className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                        onClick={() => setDropdownOpen(false)} // close on click
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <span
                        onClick={() => { signout(); setDropdownOpen(false); }}
                        className="cursor-pointer inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                      >
                        Sign out
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <ul className="text-white flex gap-x-8">
              <li><Link to="login">Login</Link></li>
              <li><Link to="register">Register</Link></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}
