import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import Image1 from "../../assets/images/img-1.png";
import Image2 from "../../assets/images/img-2.png";
import Image3 from "../../assets/images/img-3.png";

function BlogSection() {

    const workSteps = [
        {
          imgSrc: Image1,
          title: "MAKE PAYMENTS",
          description: "Send and receive secure payments instantly with blockchain technology",
          active: false
        },
        {
          imgSrc: Image2,
          title: "CREATE YOUR WALLET",
          description: "Easily create a secure blockchain wallet for your digital assets",
          active: true
        },
        {
          imgSrc: Image3,
          title: "BUY OR SELL ORDERS",
          description: "Place buy or sell orders instantly on our secure blockchain platform",
          active: false
        }
    ];

    return (
        <div className="work_section layout_padding">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="work_main">
                            <hr className="border" />
                            <h1 className="services_taital">How It Works</h1>
                            <hr className="border" />
                        </div>
                        <p className="work_text">
                            Our blockchain platform ensures secure, transparent, and fast digital transactions.
                        </p>
                    </div>
                </div>
                <div className="work_section_2">
                    <div className="row">
                        {workSteps.map((step, index) => (
                        <div className="col-md-4" key={index}>
                            <div className={`work_box ${step.active ? 'active' : ''}`}>
                                <div className="work_img">
                                    <img src={step.imgSrc} alt={step.title} />
                                </div>
                                <h3 className={`payments_text ${step.active ? 'active' : ''}`}>
                                    {step.title}
                                </h3>
                                <p className={`lorem_text ${step.active ? 'active' : ''}`}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                        ))}
                    </div>
                    <div className="read_bt">
                        <a href="#">Read More</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogSection;