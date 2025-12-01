import React from "react";

import "./index.css";

import Header from "../../components/header";
import ContactSection from "../../components/contact";
import Footer from "../../components/footer";

function Contact() {
	return (
		<div>
			<div className="header_section">
				<Header />
			</div>
			<ContactSection />
			<Footer />
		</div>
	);
}


export default Contact;