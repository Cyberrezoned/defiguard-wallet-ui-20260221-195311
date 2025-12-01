import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import Icon1 from "../../assets/images/icon-1.png";
import Icon2 from "../../assets/images/icon-2.png";
import Icon3 from "../../assets/images/icon-3.png";

function ServicesSection() {

    const services = [
        {
            imgSrc: Icon1,
            title: "Bitcoin Transaction",
            description: "A Bitcoin transaction is a digital transfer of BTC between wallets using blockchain technology. It is verified by miners, recorded on a public ledger, and requires a sender, receiver, and digital signature.",
            active: false
        },
        {
            imgSrc: Icon2,
            title: "Bitcoin Exchange",
            description: "A Bitcoin exchange is a platform where users buy, sell, and trade Bitcoin for fiat or other cryptocurrencies. It provides real-time pricing, secure transactions, and liquidity for seamless crypto trading.",
            active: true
        },
        {
            imgSrc: Icon3,
            title: "Bitcoin Mining",
            description: "Bitcoin mining is the process of validating transactions and adding them to the blockchain by solving complex cryptographic puzzles. Miners earn BTC rewards for securing the network using computational power.",
            active: false
        }
    ];

    return (
        <div className="services_section layout_padding">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="services_main">
                            <hr className="border" />
                            <h1 className="services_taital">Services We Provide</h1>
                            <hr className="border" />
                        </div>
                    </div>
                </div>
                <div className="services_section_2">
                    <div className="row">
                        {services.map((service, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="icon_img">
                                    <img src={service.imgSrc} alt={service.title} />
                                </div>
                                <h3 className="bitcoin_text">{service.title}</h3>
                                <p className="services_text">{service.description}</p>
                                <div className={`readmore_btn ${service.active ? 'active' : ''}`}>
                                    <a href="#">Read More</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ServicesSection;