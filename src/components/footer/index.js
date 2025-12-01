import React, { useEffect, useState, useRef } from "react";

import "./index.css";

function Footer() {
    return (
        <>
            {/* Footer Section */}
            <div className="footer_section layout_padding">
                <div className="container">
                    <div className="row">
                        {/* Our Company Links */}
                        <div className="col-lg-3 col-sm-6">
                        <h3 className="useful_text">Our Company</h3>
                        <div className="footer_menu">
                            <ul>
                                <li><a href="/">Home</a></li>
                                <li><a href="about">About</a></li>
                                <li><a href="services">Services</a></li>
                                <li><a href="#">Pricing</a></li>
                                <li><a href="blog">Blog</a></li>
                                <li><a href="contact">Contact</a></li>
                            </ul>
                        </div>
                        </div>

                        {/* Additional Links */}
                        <div className="col-lg-3 col-sm-6">
                            <h3 className="useful_text">Support</h3>
                            <div className="footer_menu">
                                <ul>
                                    <li><a href="#">FAQ</a></li>
                                    <li><a href="#">Terms Of Services</a></li>
                                    <li><a href="#">404</a></li>
                                    <li><a href="#">Register</a></li>
                                    <li><a href="#">Login</a></li>
                                    <li><a href="#">Coming Soon</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Contact Us */}
                        <div className="col-lg-3 col-sm-6">
                            <h3 className="useful_text">Contact Us</h3>
                            <div className="location_text">
                                <ul>
                                    <li>
                                        <a href="#">
                                            <span className="padding_left_10"><i className="fa fa-map-marker" aria-hidden="true"></i></span>
                                            105 Todd Weaver Rd, Alto GA, 30510
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <span className="padding_left_10"><i className="fa fa-phone" aria-hidden="true"></i></span>
                                            (802) 202-1022
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <span className="padding_left_10"><i className="fa fa-envelope" aria-hidden="true"></i></span>
                                            support@defiguard.com
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Newsletter Section */}
                        <div className="col-lg-3 col-sm-6">
                            <h3 className="useful_text">Newsletter</h3>
                            <div className="form-group">
                                <textarea
                                    className="update_mail"
                                    placeholder="Your Email"
                                    rows="3"
                                    name="email"
                                ></textarea>
                                <div className="subscribe_bt">
                                    <a href="#"><i className="fa fa-arrow-right" aria-hidden="true"></i></a>
                                </div>
                            </div>

                            {/* Social Icons */}
                            <div className="footer_social_icon">
                                <ul>
                                    <li><a href="#"><i className="fa fa-facebook" aria-hidden="true"></i></a></li>
                                    <li><a href="#"><i className="fa fa-twitter" aria-hidden="true"></i></a></li>
                                    <li><a href="#"><i className="fa fa-linkedin" aria-hidden="true"></i></a></li>
                                    <li><a href="#"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="copyright_section">
                <div className="container">
                    <p className="copyright_text">
                        2025 All Rights Reserved. Design by <a href="https://html.design">DefiGuard</a>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Footer;

