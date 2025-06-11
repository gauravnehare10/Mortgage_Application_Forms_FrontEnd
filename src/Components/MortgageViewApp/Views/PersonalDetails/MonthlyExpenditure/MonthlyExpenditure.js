import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function MonthlyExpenditure() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("expenditureData", applicantId);
  }, [fetchFormData, applicantId]);

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '£0';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Number(amount));
  };

  const renderExpenditureSection = (expenditureData, title) => {
    if (!expenditureData) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          {/* Housing */}
          <div className="expenditure-category">
            <h3>Housing</h3>
            <div className="detail-item">
              <div className="detail-label">
                <span>Mortgage: </span>
                <span>{formatCurrency(expenditureData.mortgage)} </span>
              </div>
              <div className="detail-label">
                <span>Rent/Board: </span>
                <span>{formatCurrency(expenditureData.rentBoard)} </span>
              </div>
              <div className="detail-label">
                <span>Council Tax: </span>
                <span>{formatCurrency(expenditureData.councilTax)} </span>
              </div>
              <div className="detail-label">
                <span>Building Insurance: </span>
                <span>{formatCurrency(expenditureData.buildingInsurance)} </span>
              </div>
            </div>
          </div>

          {/* Utilities */}
          <div className="expenditure-category">
            <h3>Utilities</h3>
            <div className="detail-item">
              <div className="detail-label">
                <span>Water: </span>
                <span>{formatCurrency(expenditureData.water)} </span>
              </div>
              <div className="detail-label">
                <span>Electricity: </span>
                <span>{formatCurrency(expenditureData.electricity)} </span>
              </div>
              <div className="detail-label">
                <span>Gas: </span>
                <span>{formatCurrency(expenditureData.gas)} </span>
              </div>
              <div className="detail-label">
                <span>Home Phone: </span>
                <span>{formatCurrency(expenditureData.homePhone)} </span>
              </div>
              <div className="detail-label">
                <span>Mobile Phone: </span>
                <span>{formatCurrency(expenditureData.mobilePhone)} </span>
              </div>
              <div className="detail-label">
                <span>TV Licence: </span>
                <span>{formatCurrency(expenditureData.tvLicence)} </span>
              </div>
            </div>
          </div>

          {/* Insurance */}
          <div className="expenditure-category">
            <h3>Insurance</h3>
            <div className="detail-item">
              <div className="detail-label">
                <span>Car Insurance: </span>
                <span>{formatCurrency(expenditureData.carInsurance)} </span>
              </div>
              <div className="detail-label">
                <span>Pet Insurance: </span>
                <span>{formatCurrency(expenditureData.petInsurance)} </span>
              </div>
              <div className="detail-label">
                <span>Other Insurance: </span>
                <span>{formatCurrency(expenditureData.otherInsurance)} </span>
              </div>
            </div>
          </div>

          {/* Debt Payments */}
          <div className="expenditure-category">
            <h3>Debt Payments</h3>
            <div className="detail-item">
              <div className="detail-label">
                <span>Loans: </span>
                <span>{formatCurrency(expenditureData.loans)} </span>
              </div>
              <div className="detail-label">
                <span>Credit Cards: </span>
                <span>{formatCurrency(expenditureData.creditCards)} </span>
              </div>
              <div className="detail-label">
                <span>Hire Purchase: </span>
                <span>{formatCurrency(expenditureData.hirePurchase)} </span>
              </div>
              <div className="detail-label">
                <span>Bank Fees: </span>
                <span>{formatCurrency(expenditureData.bankFees)} </span>
              </div>
            </div>
          </div>

          {/* Living Costs */}
          <div className="expenditure-category">
            <h3>Living Costs</h3>
            <div className="detail-item">
              <div className="detail-label">
                <span>Food: </span>
                <span>{formatCurrency(expenditureData.food)} </span>
              </div>
              <div className="detail-label">
                <span>Clothes: </span>
                <span>{formatCurrency(expenditureData.clothes)} </span>
              </div>
              <div className="detail-label">
                <span>Household Maintenance: </span>
                <span>{formatCurrency(expenditureData.householdMaintenance)} </span>
              </div>
              <div className="detail-label">
                <span>Cigarettes: </span>
                <span>{formatCurrency(expenditureData.cigarettes)} </span>
              </div>
              <div className="detail-label">
                <span>Alcohol: </span>
                <span>{formatCurrency(expenditureData.alcohol)} </span>
              </div>
            </div>
          </div>

          {/* Transport */}
          <div className="expenditure-category">
            <h3>Transport</h3>
            <div className="detail-item">
              <div className="detail-label">
                <span>Travel Costs: </span>
                <span>{formatCurrency(expenditureData.travelCosts)} </span>
              </div>
              <div className="detail-label">
                <span>Commuting: </span>
                <span>{formatCurrency(expenditureData.commuting)} </span>
              </div>
            </div>
          </div>

          {/* Savings & Investments */}
          <div className="expenditure-category">
            <h3>Savings & Investments</h3>
            <div className="detail-item">
              <div className="detail-label">
                <span>Savings Plans: </span>
                <span>{formatCurrency(expenditureData.savingsPlans)} </span>
              </div>
              <div className="detail-label">
                <span>Pension Plans: </span>
                <span>{formatCurrency(expenditureData.pensionPlans)} </span>
              </div>
            </div>
          </div>

          {/* Leisure */}
          <div className="expenditure-category">
            <h3>Leisure</h3>
            <div className="detail-item">
              <div className="detail-label">
                <span>Entertainment: </span>
                <span>{formatCurrency(expenditureData.entertainment)} </span>
              </div>
              <div className="detail-label">
                <span>Holidays: </span>
                <span>{formatCurrency(expenditureData.holidays)} </span>
              </div>
              <div className="detail-label">
                <span>Membership Fees: </span>
                <span>{formatCurrency(expenditureData.membershipFees)} </span>
              </div>
            </div>
          </div>

          {/* Other */}
          <div className="expenditure-category">
            <h3>Other</h3>
            <div className="detail-item">
              <div className="detail-label">
                <span>Child Care: </span>
                <span>{formatCurrency(expenditureData.childCare)} </span>
              </div>
              <div className="detail-label">
                <span>School Fees: </span>
                <span>{formatCurrency(expenditureData.schoolFees)} </span>
              </div>
              <div className="detail-label">
                <span>Protection Policies: </span>
                <span>{formatCurrency(expenditureData.protectionPolicies)} </span>
              </div>
              <div className="detail-label">
                <span>Other Items: </span>
                <span>{formatCurrency(expenditureData.otherItems)} </span>
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="expenditure-total">
            <h3>Total Monthly Expenditure</h3>
            <div className="total-amount">
              {formatCurrency(expenditureData.totalExpenditure)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/emergency-fund`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/monthly-expenditure`)}
       />

      <div className="data-container">
        {formData?.expenditureData?.applicant ? (
          renderExpenditureSection(formData.expenditureData.applicant, 'Applicant Monthly Expenditure')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.expenditureData?.partner && 
          renderExpenditureSection(formData.expenditureData.partner, 'Partner Monthly Expenditure')}
      </div>
    </div>
  );
}