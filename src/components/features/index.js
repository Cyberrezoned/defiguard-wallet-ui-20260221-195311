import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import Icon4 from "../../assets/images/icon-4.png";
import Icon5 from "../../assets/images/icon-5.png";
import Icon6 from "../../assets/images/icon-6.png";

function FeaturesSection() {

    const facts = [
        {
          imgSrc: Icon4,
          number: "1150",
          text: "PROJECT COMPLETED"
        },
        {
          imgSrc: Icon5,
          number: "5223",
          text: "HAPPY CLIENTS"
        },
        {
          imgSrc: Icon6,
          number: "4522",
          text: "WORKERS EMPLOYED"
        }
    ];

    return (
        <div className="features_section layout_padding">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h6 className="features_text">The Cryptocurrency</h6>
                        <h1 className="features_taital">AWESOME FACTS</h1>
                    </div>
                </div>
                <div className="features_section_2">
                    <div className="row">
                        {facts.map((fact, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="icon_4">
                                    <img src={fact.imgSrc} alt={fact.text} />
                                    <span className="padding15">{fact.number}</span>
                                </div>
                                <h6 className="project_text">{fact.text}</h6>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default FeaturesSection;