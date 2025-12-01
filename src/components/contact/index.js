import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import CoinImg from "../../assets/images/coin-img.png";

function ContactSection() {

    // State to manage form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // You can add form submission logic here (like sending the data to an API)
        alert('Form submitted!'); // Temporary alert
    };

    return (
        <div className="contact_section layout_padding">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="contact_taital">REQUEST A CALL BACK</h1>
                    </div>
                </div>
                <div className="contact_section_2">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="mail_section map_form_container">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className="mail_text"
                                                placeholder="Your Name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className="mail_text"
                                                placeholder="Email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className="mail_text"
                                                placeholder="Phone Number"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <input
                                                type="text"
                                                className="mail_text"
                                                placeholder="Subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <textarea
                                        className="massage-bt"
                                        placeholder="Message"
                                        rows="5"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                    />
                                    <div className="btn_main">
                                        <div className="send_bt active">
                                            <a type="submit">Send</a>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="contact_img">
                                <img src={CoinImg} alt="Coin" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactSection;