import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import useFormStore from "../../store";



const Navbar = ({ applicantId }) => {
  const { formData, fetchFormData } = useFormStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen((prev) => !prev);

  const mortgageNav = [
    { path: `/mortgage/add-data/${applicantId}/application-type`, label: "Application Type" },
    { path: `/mortgage/add-data/${applicantId}/early-repayment`, label: "Early Repayment/Moving Home/Product Types" },
    { path: `/mortgage/add-data/${applicantId}/prioritise-your-needs`, label: "Prioritise Your Needs" },
    { path: `/mortgage/add-data/${applicantId}/establish-budget`, label: "Establishing a Budget" },
    { path: `/mortgage/add-data/${applicantId}/mortgage-details`, label: "Mortgage Details" },
    { path: `/mortgage/add-data/${applicantId}/repaying-mortgage`, label: "Repaying Mortgage" },
    { path: `/mortgage/add-data/${applicantId}/solicitor-estate-agent`, label: "Solicitor/Estate Agent Details" },
    { path: `/mortgage/add-data/${applicantId}/declaration`, label: "Declaration" }
  ]

  const NavItem = ({ path, label }) => (
    <li style={{ paddingLeft: "20px" }}>
      <NavLink to={path} className={({ isActive }) => (isActive ? "active-link" : "")}>
        {label}
      </NavLink>
    </li>
  );

  useEffect(()=>{
    fetchFormData("occupationData", applicantId)
  },[fetchFormData, applicantId])

  const baseNav = [
    { path: `/mortgage/add-data/${applicantId}/personal-details`, label: "Main Details" },
    { path: `/mortgage/add-data/${applicantId}/residential`, label: "Residential Details" },
    { path: `/mortgage/add-data/${applicantId}/occupation`, label: "Occupation Details" },
    { path: `/mortgage/add-data/${applicantId}/employer-benefit`, label: "Employer Benefit" },
    { path: `/mortgage/add-data/${applicantId}/secondary-occupation`, label: "Secondary Occupation Details" },
    { path: `/mortgage/add-data/${applicantId}/other-monthly-income`, label: "Other Monthly Income" },
    { path: `/mortgage/add-data/${applicantId}/other-income-source`, label: "Non-Working - Other Income Source" },
    { path: `/mortgage/add-data/${applicantId}/total-income`, label: "Total Income Details" },
    { path: `/mortgage/add-data/${applicantId}/existing-credit-commits`, label: "Liabilities - Credit Commitments" },
    { path: `/mortgage/add-data/${applicantId}/existing-mortgage`, label: "Liabilities - Existing Mortgage" },
    { path: `/mortgage/add-data/${applicantId}/monthly-expenditure`, label: "Monthly Expenditure Details" },
    { path: `/mortgage/add-data/${applicantId}/emergency-fund`, label: "Emergency Fund/Health & Will Detail" },
  ];

  const employerBenefitIndex = baseNav.findIndex(
    (item) => item.label === "Employer Benefit"
  );

  const mainDetails = [
    { path: `/mortgage/add-data/${applicantId}/main-details`, label: "Main Details" },
  ]

  const personalNav = [
    ...baseNav.slice(0, employerBenefitIndex + 1),
    ...(formData.occupationData?.client?.status === "Self-Employed" || 
        formData.occupationData?.partner?.status === "Self-Employed"
      ? [
          { path: `/mortgage/add-data/${applicantId}/self-employed-details`, label: "Self Employed Details" },
          { path: `/mortgage/add-data/${applicantId}/self-employed-income-details`, label: "Self Employed Income Details" },
        ]
      : []),
    ...baseNav.slice(employerBenefitIndex + 1),
  ];


  return (
    <>
      {/* Toggle Button */}
      <button
        className="nav-toggle"
        onClick={toggleNavbar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? "←" : "→"}
      </button>

      {/* Left Fixed Navbar */}
      <nav className={`mortgage-navbar ${isOpen ? "open" : ""}`}>
        <details open>
          <summary>Main Details</summary>
          <ul className="mort-nav-links">
            {mainDetails.map((item) => (
              <NavItem key={item.path} path={item.path} label={item.label} />
            ))}
          </ul>
        </details>
        <details open>
          <summary>Personal Details</summary>
          <ul className="mort-nav-links">
            {personalNav.map((item) => (
              <NavItem key={item.path} path={item.path} label={item.label} />
            ))}
          </ul>
        </details>
        <details open>
          <summary>Mortage</summary>
          <ul className="mort-nav-links">
            {mortgageNav.map((item) => (
              <NavItem key={item.path} path={item.path} label={item.label} />
            ))}
          </ul>
        </details>
      </nav>
    </>
  );
};

export default Navbar;
