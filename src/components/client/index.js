import React, { useEffect, useState, useRef } from "react";
import { Carousel } from 'react-bootstrap';

import "./index.css";

import ClientImg from "../../assets/images/client-img.png";

function ClientSection() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <div className="client_section layout_padding">
            <div className="container">
                {/* Indicators (Custom) */}
                <ol className="carousel-indicators">
                    <li
                        className={index === 0 ? 'active' : ''}
                        onClick={() => setIndex(0)}
                    ></li>
                    <li
                        className={index === 1 ? 'active' : ''}
                        onClick={() => setIndex(1)}
                    ></li>
                    <li
                        className={index === 2 ? 'active' : ''}
                        onClick={() => setIndex(2)}
                    ></li>
                </ol>
                <Carousel activeIndex={index} onSelect={handleSelect}>
                    <Carousel.Item>
                        <h1 className="client_taital">What Is Says Our Clients One</h1>
                        <p className="client_text">
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                        </p>
                        <div className="client_img">
                            <img src={ClientImg} alt="Client 1" />
                        </div>
                        <h3 className="magna_text">Magna Aliqua.</h3>
                        <p className="consectetur_text">
                            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        </p>
                    </Carousel.Item>

                    <Carousel.Item>
                        <h1 className="client_taital">What Is Says Our Clients Two</h1>
                        <p className="client_text">
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                        </p>
                        <div className="client_img">
                            <img src={ClientImg} alt="Client 2" />
                        </div>
                        <h3 className="magna_text">Magna Aliqua.</h3>
                        <p className="consectetur_text">
                            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        </p>
                    </Carousel.Item>

                    <Carousel.Item>
                        <h1 className="client_taital">What Is Says Our Clients Three</h1>
                        <p className="client_text">
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                        </p>
                        <div className="client_img">
                            <img src={ClientImg} alt="Client 3" />
                        </div>
                        <h3 className="magna_text">Magna Aliqua.</h3>
                        <p className="consectetur_text">
                            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        </p>
                    </Carousel.Item>
                </Carousel>
            </div>
        </div>
    );
}

export default ClientSection;