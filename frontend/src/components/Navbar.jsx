import React from "react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="custom-navbar py-3">
      <div className="container">
        <ul className="d-flex align-items-center list-unstyled mb-0">
          <li>
            <a className={location.pathname === "/" ? 'active' : ''} href="/">Home</a>
          </li>
          <li>
            <a className={location.pathname === "/search-history" ? 'active' : ''} href="/search-history">Search History</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
