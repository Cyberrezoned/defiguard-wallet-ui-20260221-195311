import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import Team1 from "../../assets/images/team-img1.png";
import Team2 from "../../assets/images/team-img2.png";
import Team3 from "../../assets/images/team-img3.png";


function TeamSection() {

    const teamMembers = [
        {
          imgSrc: Team1,
          name: "Daniel Canup",
          role: "CEO & Founder",
        },
        {
          imgSrc: Team2,
          name: "James Hess",
          role: "Head of Operations",
        },
        {
          imgSrc: Team3,
          name: "Steven Gauerke",
          role: "Engineering",
        },
    ];

    const socialLinks = [
        { icon: "fa-facebook", url: "#" },
        { icon: "fa-twitter", url: "#" },
        { icon: "fa-linkedin", url: "#" },
        { icon: "fa-instagram", url: "#" },
    ];

    return (
        <div className="team_section layout_padding">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="team_main">
                            <hr className="border" />
                            <h1 className="services_taital">Excellent Team Workers</h1>
                            <hr className="border" />
                        </div>
                    </div>
                </div>
                <div className="team_section_2">
                    <div className="row">
                        {teamMembers.map((member, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="client_box">
                                    <div className="team_img">
                                        <img src={member.imgSrc} alt={member.name} />
                                    </div>
                                    <h3 className="client_name">{member.name}</h3>
                                    <p className="passages_text">{member.role}</p>
                                </div>
                                <div className="team_social_icon">
                                    <ul>
                                        {socialLinks.map((link, i) => (
                                            <li key={i}>
                                                <a href={link.url}>
                                                    <i className={`fa ${link.icon}`} aria-hidden="true"></i>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamSection;