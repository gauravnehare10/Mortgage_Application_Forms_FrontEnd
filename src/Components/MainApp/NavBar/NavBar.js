import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import useAuthStore from '../../../utils/authStore';
import Profile from '../Profile/FloatingProfile/FloatingProfile';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const { isAuthenticated, logout } = useAuthStore();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      <nav className="custom-navbar">
        <div className="logo">AAI Fin</div>

        <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
          <span></span><span></span><span></span>
        </div>

        <ul className={`nav-links ${isOpen ? "nav-active" : ""}`}>
          {isAuthenticated ? (
            <>
              <li><Link to="/" onClick={() => setIsOpen(false)}>Home</Link></li>
              <li>
                <Link
                  className="btn btn-link nav-link" 
                  onClick={() => {
                    setShowProfileCard(!showProfileCard);
                    setIsOpen(false);
                  }}
                >
                  Profile
                </Link>
              </li>
              <li><Link onClick={handleLogout}>Logout</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/login" onClick={() => setIsOpen(false)}>Login</Link></li>
              <li><Link to="/register" onClick={() => setIsOpen(false)}>Register</Link></li>
            </>
          )}
        </ul>
      </nav>

      {showProfileCard && <Profile onClose={() => setShowProfileCard(false)} />}
    </>
  );
};

export default NavBar;
