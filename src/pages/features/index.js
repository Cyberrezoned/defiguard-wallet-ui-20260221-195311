import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import Header from "../../components/header";
import FeaturesSection from "../../components/features";
import Footer from "../../components/footer";

function Features() {
	return (
		<div>
			<div className="header_section">
				<Header />
			</div>
			<FeaturesSection />
			<Footer />
		</div>
	);
}


export default Features;