import React from "react";

import "./index.css";

import Header from "../../components/header";
import Banner from "../../components/banner";
import ServicesSection from "../../components/services";
import Footer from "../../components/footer";

function Services() {
	return (
		<div>
			<div className="header_section">
				<Header />
			</div>
			<ServicesSection />
			<Footer />
		</div>
	);
}


export default Services;