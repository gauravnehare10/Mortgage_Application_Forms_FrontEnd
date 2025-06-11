import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import Navbar from './inc/Navbar/Navbar';
import "./MortgageApp.css";
import "./FormCss.css";
import PersonalDetails from './Forms/PersonalDetailsForm/PersonalDetails/PersonalDetails';
import Residential from './Forms/PersonalDetailsForm/Residential/Residential';
import OccupationDetails from './Forms/PersonalDetailsForm/OccupationDetails/OccupationDetails';
import EmployerBenefit from './Forms/PersonalDetailsForm/EmployerBenefit/EmployerBenefit';
import SecOccupation from './Forms/PersonalDetailsForm/Details/SecOccupation';
import OtherMonthlyInc from './Forms/PersonalDetailsForm/OtherMonthlyInc/OtherMonthlyInc';
import NonWorking from './Forms/PersonalDetailsForm/NonWorking/NonWorking';
import TotalIncome from './Forms/PersonalDetailsForm/TotalIncome/TotalIncome';
import ExCreditCommits from './Forms/PersonalDetailsForm/ExCreditCommits/ExCreditCommits';
import ExMortgage from './Forms/PersonalDetailsForm/ExMortgage/ExMortgage';
import MonthlyExpenditure from './Forms/PersonalDetailsForm/MonthlyExpenditure/MonthlyExpenditure';
import EmergencyFund from './Forms/PersonalDetailsForm/EmergencyFund/EmergencyFund';
import ApplicationType from './Forms/MortgageApplicationForm/ApplicationType/ApplicationType';
import EarlyRepayment from './Forms/MortgageApplicationForm/EarlyRepayment/EarlyRepayment';
import PrioritiseNeeds from './Forms/MortgageApplicationForm/PrioritiseNeeds/PrioritiseNeeds';
import EstablishBudget from './Forms/MortgageApplicationForm/EstablishBudget/EstablishBudget';
import MortgageDetails from './Forms/MortgageApplicationForm/MortgageDetails/MortgageDetails';
import RepayingMortgage from './Forms/MortgageApplicationForm/RepayingMortgage/RepayingMortgage';
import SolicitorAgent from './Forms/MortgageApplicationForm/SolicitorAgent/SolicitorAgent';
import Declaration from './Forms/MortgageApplicationForm/Declaration/Declaration';
import SelfEmployedDetails from './Forms/MortgageApplicationForm/SelfEmployedDetails/SelfEmployedDetails';
import SelfEmpIncomeDetails from './Forms/MortgageApplicationForm/SelfEmpIncomeDetails/SelfEmpIncomeDetails';
import MainDetails from './Forms/MainDetails/MainDetails';

export default function MortgageDataApp() {
  const { applicantId } = useParams();
  return (
    <div className="mortgage-container">
      <Navbar applicantId={applicantId} />
      <div className="main-content">
        <Routes>
          <Route path='/main-details' element={<MainDetails />} />
          <Route path='/personal-details' element={<PersonalDetails />} />
          <Route path='/residential' element={<Residential />} />
          <Route path="/occupation" element={<OccupationDetails />} />
          <Route path="/employer-benefit" element={<EmployerBenefit />} />
          <Route path='/self-employed-details' element={<SelfEmployedDetails />} />
          <Route path='/self-employed-income-details' element={<SelfEmpIncomeDetails />} />
          <Route path='/secondary-occupation' element={<SecOccupation />} />
          <Route path='/other-monthly-income' element={<OtherMonthlyInc />} />
          <Route path='/other-income-source' element={<NonWorking />} />
          <Route path='/total-income' element={<TotalIncome />} />
          <Route path='/existing-credit-commits' element={<ExCreditCommits />} />
          <Route path='/existing-mortgage' element={<ExMortgage />} />
          <Route path='/monthly-expenditure' element={<MonthlyExpenditure />} />
          <Route path='/emergency-fund' element={<EmergencyFund />} />
          <Route path='/application-type' element={<ApplicationType />} />
          <Route path='/early-repayment' element={<EarlyRepayment />} />
          <Route path='/prioritise-your-needs' element={<PrioritiseNeeds />} />
          <Route path='/establish-budget' element={<EstablishBudget />} />
          <Route path='/mortgage-details' element={<MortgageDetails />} />
          <Route path='/repaying-mortgage' element={<RepayingMortgage />} />
          <Route path='/solicitor-estate-agent' element={<SolicitorAgent />} />
          <Route path='/declaration' element={<Declaration />} />
        </Routes>
      </div>
    </div>
  );
}
