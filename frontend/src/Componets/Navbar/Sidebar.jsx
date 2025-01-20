import React, { useEffect, useState } from 'react'
import logo from "../../Assets/logo.png"
import './sidebar.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectUser } from '../../Feature/Userslice';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

function Sidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
const navigate=useNavigate()
  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sidebarOpen && !e.target.closest('.sidebar') && !e.target.closest('.open-btn')) {
        closeSidebar();
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [sidebarOpen]);
  const logoutFunction=()=>{
    signOut(auth)
    navigate("/")
  
}
  const user=useSelector(selectUser)
  return (
    <>
      <div className="App2 -mt-2 overflow-hidden">
        <Link to="/">
          <img src={logo} alt="" id='nav2-img' className="h-10" />
        </Link>
        <div className={`sidebar ${sidebarOpen ? 'open' : ''} w-64 bg-white shadow-lg h-full fixed top-0 left-0 transition-transform transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <span className="cursor-pointer close-btn text-2xl" onClick={closeSidebar}>
            &times;
          </span>
          {user ? (
            <>
              <div className="profile text-center">
                <Link to={"/profile"}>
                  <img className='rounded-full justify-center w-16 h-16' src={user.photo} alt="" />
                </Link>
                <p className='text-center'>Profile name <span className='font-bold text-blue-500'>{user?.name}</span></p>
              </div>
            </>
          ) : (
            <div className="auth"></div>
          )}
          <Link to="/internship" className="block p-2 hover:bg-gray-200">Internships</Link>
          <Link to="/Jobs" className="block p-2 hover:bg-gray-200">Jobs</Link>
          <Link to={"/"} className='small block p-2 hover:bg-gray-200'>Contact Us</Link>
          <hr />
          {user ? (
            <>
              <div className="addmore">
                <Link to={"/userapplication"} className="block p-2 hover:bg-gray-200">
                  <p>My Applications</p>
                </Link>
                <Link className="block p-2 hover:bg-gray-200">
                  <p>View Resume</p>
                </Link>
                <Link className="block p-2 hover:bg-gray-200">
                  <p>More</p>
                </Link>
                <button className='bt-log block w-full text-left p-2 hover:bg-gray-200' onClick={logoutFunction}>
                  Logout <i className="bi bi-box-arrow-right"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="addmore">
              <p>Register - As a Student</p>
              <p>Register - As an Employer</p>
              <br />
              <br />
            </div>
          )}
        </div>

        <div className="main">
          <span style={{ fontSize: "22px" }} className="open-btn cursor-pointer" onClick={openSidebar}>
            &#9776;
          </span>
        </div>

        <div className="search2 flex items-center mt-4">
          <i className="bi bi-search"></i>
          <input type="search" placeholder='Search' className="border-2 rounded-md p-1 ml-2" />
        </div>

        {user ? (
          <>
            {/* Additional user-specific content can go here */}
          </>
        ) : (
          <>
            <div className="reg">
              <Link to="/register">
                <button className='btn4 bg-blue-500 text-white py-2 px-4 rounded'>
                  Register
                </button>
              </Link>
            </div>
            <div className="admin">
              <Link to={"/adminLog"}>
                <button id='admin' className='bg-blue-500 text-white py-2 px-4 rounded'>Admin Login</button>
              </Link>
            </div>
          </>
        )}

        <p className='text-red-300'>Hire Talent</p>
      </div>
    </>
  );
};

export default Sidebar
