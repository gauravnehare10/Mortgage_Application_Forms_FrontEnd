import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import useFormStore from "../../../../MortgageApp/store";

const Navbar = ({ applicantId }) => {
  const { formData, fetchFormData } = useFormStore();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    fetchFormData("occupationData", applicantId);
  }, [fetchFormData, applicantId]);

  // Mortgage navigation items
  const mortgageNav = [
    { path: `/mortgage/${applicantId}/application-type`, label: "Application Type" },
    { path: `/mortgage/${applicantId}/early-repayment`, label: "Early Repayment/Moving Home/Product Types" },
    { path: `/mortgage/${applicantId}/prioritise-your-needs`, label: "Prioritise Your Needs" },
    { path: `/mortgage/${applicantId}/establishing-budget`, label: "Establishing a Budget" },
    { path: `/mortgage/${applicantId}/mortgage-details`, label: "Mortgage Details" },
    { path: `/mortgage/${applicantId}/repaying-mortgage`, label: "Repaying Mortgage" },
    { path: `/mortgage/${applicantId}/solicitor-estate-agent`, label: "Solicitor/Estate Agent Details" },
    { path: `/mortgage/${applicantId}/declaration`, label: "Declaration" }
  ];

  // Base navigation items
  const baseNav = [
    { path: `/mortgage/${applicantId}/personal-details`, label: "Main Details" },
    { path: `/mortgage/${applicantId}/residential`, label: "Residential Details" },
    { path: `/mortgage/${applicantId}/occupation`, label: "Occupation Details" },
    { path: `/mortgage/${applicantId}/employer-benefit`, label: "Employer Benefit" },
    { path: `/mortgage/${applicantId}/secondary-occupation`, label: "Secondary Occupation Details" },
    { path: `/mortgage/${applicantId}/other-monthly-income`, label: "Other Monthly Income" },
    { path: `/mortgage/${applicantId}/non-working-income`, label: "Non-Working - Other Income Source" },
    { path: `/mortgage/${applicantId}/total-income`, label: "Total Income Details" },
    { path: `/mortgage/${applicantId}/existing-credit-commits`, label: "Liabilities - Credit Commitments" },
    { path: `/mortgage/${applicantId}/existing-mortgage`, label: "Liabilities - Existing Mortgage" },
    { path: `/mortgage/${applicantId}/monthly-expenditure`, label: "Monthly Expenditure Details" },
    { path: `/mortgage/${applicantId}/emergency-fund`, label: "Emergency Fund/Health & Will Detail" },
  ];

  // Main details navigation
  const mainDetails = [
    { path: `/mortgage/${applicantId}/main-details`, label: "Main Details" },
  ];

  const employerBenefitIndex = baseNav.findIndex(
    (item) => item.label === "Employer Benefit"
  );

  // Personal navigation with conditional self-employed routes
  const personalNav = [
    ...baseNav.slice(0, employerBenefitIndex + 1),
    ...(formData.occupationData?.client?.status === "Self-Employed" || 
        formData.occupationData?.partner?.status === "Self-Employed"
      ? [
          { path: `/mortgage/${applicantId}/self-employed-details`, label: "Self Employed Details" },
          { path: `/mortgage/${applicantId}/self-employed-income-details`, label: "Self Employed Income Details" },
        ]
      : []),
    ...baseNav.slice(employerBenefitIndex + 1),
  ];

  // NavItem component
  const NavItem = ({ path, label }) => (
    <li style={{ paddingLeft: "20px" }}>
      <NavLink 
        to={path} 
        className={({ isActive }) => (isActive ? "active-link" : "")}
      >
        {label}
      </NavLink>
    </li>
  );

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