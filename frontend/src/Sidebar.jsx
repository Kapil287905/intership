import React, { useState } from 'react';
import './Sidebar.css'; // Create this CSS file for custom styles

const Sidebar = () => {
    const [showOffcanvas, setShowOffcanvas] = useState(false);

    const handleToggleOffcanvas = () => {
        setShowOffcanvas(!showOffcanvas);
    };

    return (
        <>
            {/* Navbar for toggling offcanvas on smaller screens */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light d-lg-none">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <span className="logo_name">Logo</span>
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={handleToggleOffcanvas}
                        aria-controls="offcanvasNavbar"
                        aria-expanded={showOffcanvas ? "true" : "false"}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>

            {/* Offcanvas for small screens */}
            <div
                className={`offcanvas offcanvas-start bg-dark text-white ${showOffcanvas ? 'show' : ''}`}
                tabIndex="-1"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                        <span className="logo_name">Logo</span>
                    </h5>
                    <button
                        type="button"
                        className="btn-close text-reset btn-close-white"
                        onClick={handleToggleOffcanvas}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li className="nav-item">
                            <a className="nav-link active text-white" aria-current="page" href="/department" onClick={handleToggleOffcanvas}>
                                <i className="uil uil-building"></i>
                                <span className="link-name ms-2">Departments</span>
                            </a>
                        </li>                                              
                        <li className="mb-2">
                            <a href="/role" className="text-decoration-none text-white d-flex align-items-center" onClick={handleToggleOffcanvas}>
                                <i className="uil uil-users-alt fs-5"></i>
                                <span className="link-name ms-3">Role</span>
                            </a>
                        </li>                     
                    </ul>
                    <ul className="logout-mode navbar-nav">
                        {/* You can add a logout button or mode toggle here */}
                        <li className="nav-item">
                            <div className="mode-toggle">
                                {/* Your mode toggle switch */}
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Static Sidebar for large screens and up */}
            <nav className="d-none d-lg-block sidebar bg-dark text-white p-3" style={{ width: '250px', height: '100vh', position: 'fixed', top: 0, left: 0 }}>
                <div className="logo-name mb-4">
                    <span className="logo_name fs-4 fw-bold">Logo</span>
                </div>

                <div className="menu-items">
                    <ul className="nav-links list-unstyled" style={{ paddingLeft: "0rem" }}>
                        <li className="mb-2">
                            <a href="/department" className="text-decoration-none text-white d-flex align-items-center">
                                <i className="uil uil-building fs-5"></i>
                                <span className="link-name ms-3">Departments</span>
                            </a>
                        </li>               
                        <li className="mb-2">
                            <a href="/role" className="text-decoration-none text-white d-flex align-items-center">
                                <i className="uil uil-users-alt fs-5"></i>
                                <span className="link-name ms-3">Role</span>
                            </a>
                        </li>                    
                    </ul>

                    <ul className="logout-mode list-unstyled mt-auto">
                        <li>
                            <div className="mode-toggle">
                                {/* Your mode toggle switch */}
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;