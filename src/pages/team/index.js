import React, { useEffect, useState, useRef } from "react";

import "./index.css";

import Header from "../../components/header";
import TeamSection from "../../components/team";
import Footer from "../../components/footer";

function Team() {
	return (
		<div>
			<div className="header_section">
				<Header />
			</div>
			<TeamSection />
			<Footer />
		</div>
	);
}


export default Team;