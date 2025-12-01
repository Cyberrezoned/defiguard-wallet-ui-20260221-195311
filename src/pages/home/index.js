import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import Header from "../../components/header";
import Banner from "../../components/banner";
import ServicesSection from "../../components/services";
import BlogSection from "../../components/blog";
import FeaturesSection from "../../components/features";
import TeamSection from "../../components/team";
import ContactSection from "../../components/contact";
import ClientSection from "../../components/client";
import Footer from "../../components/footer";

function Home() {
	return (
		<div>
			<div className="header_section">
				<Header />
				<Banner />
			</div>
			<ServicesSection />
			<BlogSection />
			<FeaturesSection />
			<TeamSection />
			<ContactSection />
			<ClientSection />
			<Footer />
		</div>
	);
}


export default Home;