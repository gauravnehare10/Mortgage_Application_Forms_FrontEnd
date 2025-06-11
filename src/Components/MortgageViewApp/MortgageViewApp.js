import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import Navbar from './Views/inc/Navbar/Navbar';
import MainDetails from './Views/MainDetails/MainDetails';
import PersonMainDetails from './Views/PersonalDetails/MainDetails/MainDetails';
import OccupationDetails from './Views/PersonalDetails/OccupationDetails/OccupationDetails';
import ResidentialDetails from './Views/PersonalDetails/ResidentialDetails/ResidentialDetails';
import SelfEmpDetails from './Views/PersonalDetails/SelfEmpDetails/SelfEmpDetails';
import SelfEmpIncomeDetails from './Views/PersonalDetails/SelfEmpIncomeDetails/SelfEmpIncomeDetails';
import SecondaryOccupation from './Views/PersonalDetails/SecondaryOccupation/SecondaryOccupation';
import OtherMonthlyIncome from './Views/PersonalDetails/OtherMonthlyIncome/OtherMonthlyIncome';
import EmployerBenefits from './Views/PersonalDetails/EmployerBenefits/EmployerBenefits';
import NonWorkingIncome from './Views/PersonalDetails/NonWorkingIncome/NonWorkingIncome';
import TotalIncome from './Views/PersonalDetails/TotalIncome/TotalIncome';
import CreditCommitments from './Views/PersonalDetails/CreditCommitments/CreditCommitments';
import ExMortgageDetails from './Views/PersonalDetails/ExMortgageDetails/ExMortgageDetails';
import MonthlyExpenditure from './Views/PersonalDetails/MonthlyExpenditure/MonthlyExpenditure';
import EmergencyFunds from './Views/PersonalDetails/EmergencyFunds/EmergencyFunds';
import ApplicationType from './Views/MortageApplication/ApplicationType/ApplicationType';
import EarlyRepayment from './Views/MortageApplication/EarlyRepayment/EarlyRepayment';
import PrioritiseNeeds from './Views/MortageApplication/PrioritiseNeeds/PrioritiseNeeds';
import EstablishingBudget from './Views/MortageApplication/EstablishingBudget/EstablishingBudget';
import MortgageDetails from './Views/MortageApplication/MortgageDetails/MortgageDetails';
import RepayingMortgage from './Views/MortageApplication/RepayingMortgage/RepayingMortgage';
import SolicitorEstateAgent from './Views/MortageApplication/SolicitorEstateAgent/SolicitorEstateAgent';
import Declaration from './Views/MortageApplication/Declaration/Declaration';

export default function MortgageViewApp() {
  const { applicantId } = useParams()
  return (
    <div className='mortgage-view-container'>
      <Navbar applicantId={applicantId} />
      <div className="main-content">
        <Routes>
          <Route path='/main-details' element={<MainDetails />} />
          <Route path='/personal-details' element={<PersonMainDetails />} />
          <Route path='/residential' element={<ResidentialDetails/>} />
          <Route path='/occupation' element={<OccupationDetails />} />
          <Route path='/employer-benefit' element={<EmployerBenefits />} />
          <Route path='/self-employed-details' element={<SelfEmpDetails />} />
          <Route path='/self-employed-income-details' element={<SelfEmpIncomeDetails />} />
          <Route path='/secondary-occupation' element={<SecondaryOccupation />} />
          <Route path='/other-monthly-income' element={<OtherMonthlyIncome />} />
          <Route path='/non-working-income' element={<NonWorkingIncome />} />
          <Route path='/total-income' element={<TotalIncome />} />
          <Route path='/existing-credit-commits' element={<CreditCommitments />} />
          <Route path='/existing-mortgage' element={<ExMortgageDetails />} />
          <Route path='/monthly-expenditure' element={<MonthlyExpenditure />} />
          <Route path='/emergency-fund' element={<EmergencyFunds />} />
          <Route path='/application-type' element={<ApplicationType />}/>
          <Route path='/early-repayment' element={<EarlyRepayment />}/>
          <Route path='/prioritise-your-needs' element={<PrioritiseNeeds />}/>
          <Route path='/establishing-budget' element={<EstablishingBudget />}/>
          <Route path='/mortgage-details' element={<MortgageDetails />}/>
          <Route path='/repaying-mortgage' element={<RepayingMortgage />}/>
          <Route path='/solicitor-estate-agent' element={<SolicitorEstateAgent />}/>
          <Route path='/declaration' element={<Declaration />}/>
        </Routes>
      </div>
    </div>
  );
}