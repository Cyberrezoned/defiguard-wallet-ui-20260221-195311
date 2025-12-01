import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import AppLogo from "../../assets/images/logo.png"

function Header() {
    return (
        <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="/">
                    <img src={AppLogo} />
                </a>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-toggle="collapse" 
                    data-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav ml-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="services">Services</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="about">About</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="features">Features</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="team">Team</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="blog">Blog</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="contact">Contact</a>
                        </li>
                    </ul>
                    <form className="form-inline my-2 my-lg-0">
                        <div className="search_bt">
                            <a href="#"><i className="fa fa-search" aria-hidden="true"></i></a>
                        </div>
                    </form>
               </div>
            </nav>
         </div>
    );
}


export default Header;