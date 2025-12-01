import React, { useEffect, useState, useRef } from "react";
import { Carousel } from 'react-bootstrap';

import "./index.css";


function Banner() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <div className="banner_section layout_padding">
            <div className="container">
                <Carousel activeIndex={index} onSelect={handleSelect} id="banner_slider">
                    <Carousel.Item>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="banner_taital_main">
                                    <h1 className="banner_taital">
                                        Blockchain{" "}
                                        <span style={{ color: "#02a763" }}>Development</span>
                                    </h1>
                                    <p className="banner_text">
                                        Build your own blockchain-based platform tailored to your
                                        business needs
                                    </p>
                                    <div className="btn_main">
                                        <div className="started_bt active">
                                            <a href="#">Get A Quote</a>
                                        </div>
                                        <div className="buy_bt">
                                            <a href="#">About Us</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="banner_taital_main">
                                    <h1 className="banner_taital">
                                        Smart Contract{" "}
                                        <span style={{ color: "#02a763" }}>Solutions</span>
                                    </h1>
                                    <p className="banner_text">
                                        Automate and secure your business transactions with smart
                                        contracts
                                    </p>
                                    <div className="btn_main">
                                        <div className="started_bt active">
                                            <a href="#">Get A Quote</a>
                                        </div>
                                        <div className="buy_bt">
                                            <a href="#">About Us</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Carousel.Item>
                    <Carousel.Item>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="banner_taital_main">
                                    <h1 className="banner_taital">
                                        Tokenization{" "}
                                        <span style={{ color: "#02a763" }}>NFT Solutions</span>
                                    </h1>
                                    <p className="banner_text">
                                        Create and manage custom tokens or NFTs for digital assets and
                                        trading
                                    </p>
                                    <div className="btn_main">
                                        <div className="started_bt active">
                                            <a href="#">Get A Quote</a>
                                        </div>
                                        <div className="buy_bt">
                                            <a href="#">About Us</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Carousel.Item>
                </Carousel>
            </div>
        </div>
    );
}


export default Banner;