import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import Header from "../../components/header";
import Banner from "../../components/banner";
import Footer from "../../components/footer";

function About() {
	return (
		<div>
			<div className="header_section">
				<Header />
				<Banner />
			</div>
			<Footer />
		</div>
	);
}


export default About;