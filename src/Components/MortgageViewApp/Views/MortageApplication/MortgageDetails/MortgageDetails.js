import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function MortgageDetails() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("mortgageDetails", applicantId);
  }, [fetchFormData, applicantId]);

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return '£0';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(amount));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const formatAddress = (addressArray) => {
    if (!addressArray || !Array.isArray(addressArray)) return 'Not specified';
    const filteredAddress = addressArray.filter(part => part && part.trim() !== '');
    return filteredAddress.join(', ') || 'Not specified';
  };

  const formatBoolean = (value) => {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return 'Not specified';
  };

  const renderMortgageSection = (mortgageData, title) => {
    if (!mortgageData) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          {/* Property Section */}
          <div className="detail-item">
            <span className="detail-label">Found Property:</span>
            <span className="detail-value">{mortgageData.foundProperty || 'No'}</span>
          </div>
          
          {mortgageData.foundProperty === 'Yes' && (
            <>
              <div className="detail-item full-width">
                <span className="detail-label">Property Address:</span>
                <span className="detail-value">
                  {mortgageData.propertyAddress || formatAddress(mortgageData.address)}
                  {mortgageData.addressPostcode && `, ${mortgageData.addressPostcode}`}
                </span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Purchase Price:</span>
                <span className="detail-value">{formatCurrency(mortgageData.purchasePrice)}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Deposit Amount:</span>
                <span className="detail-value">{formatCurrency(mortgageData.depositAmount)}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Deposit Source:</span>
                <span className="detail-value">{mortgageData.depositSource || 'Not specified'}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Total Loan Amount:</span>
                <span className="detail-value">{formatCurrency(mortgageData.totalLoanAmount)}</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">Loan-to-Value:</span>
                <span className="detail-value">{mortgageData.loanToValue || '0'}%</span>
              </div>
              
              <div className="detail-item">
                <span className="detail-label">New Build:</span>
                <span className="detail-value">{mortgageData.newBuild || 'No'}</span>
              </div>
              
              {mortgageData.newBuild === 'Yes' && (
                <div className="detail-item">
                  <span className="detail-label">Builder Incentives:</span>
                  <span className="detail-value">{mortgageData.builderIncentives || 'No'}</span>
                </div>
              )}
              
              <div className="detail-item">
                <span className="detail-label">Government Scheme:</span>
                <span className="detail-value">{mortgageData.governmentScheme || 'No'}</span>
              </div>
            </>
          )}
          
          {/* Term Details */}
          <div className="detail-item">
            <span className="detail-label">Preferred Term:</span>
            <span className="detail-value">
              {mortgageData.preferredTermYears || '0'} years {mortgageData.preferredTermMonths || '0'} months
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Mortgage-Free Age:</span>
            <span className="detail-value">{mortgageData.mortgageFreeAge || 'Not specified'}</span>
          </div>
          
          <div className="detail-item full-width">
            <span className="detail-label">Term Reason:</span>
            <span className="detail-value">{mortgageData.termReason || 'Not specified'}</span>
          </div>
          
          <div className="detail-item full-width">
            <span className="detail-label">Use of Disposable Income:</span>
            <span className="detail-value">{mortgageData.useDisposableIncome || 'Not specified'}</span>
          </div>
          
          {/* Personal Details */}
          <div className="detail-item">
            <span className="detail-label">Date of Birth:</span>
            <span className="detail-value">{formatDate(mortgageData.dateOfBirth)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Planned Retirement Age:</span>
            <span className="detail-value">{mortgageData.plannedRetirementAge || 'Not specified'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Term Beyond Retirement:</span>
            <span className="detail-value">{mortgageData.termBeyondRetirement || 'No'}</span>
          </div>
          
          {/* Fee Options */}
          <div className="detail-item">
            <span className="detail-label">Pay Fees Upfront:</span>
            <span className="detail-value">{formatBoolean(mortgageData.payFeesUpfront)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Increase Loan Amount:</span>
            <span className="detail-value">{formatBoolean(mortgageData.increaseLoanAmount)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Pay Fees Partly:</span>
            <span className="detail-value">{formatBoolean(mortgageData.payFeesPartly)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Confirm Fees Interest:</span>
            <span className="detail-value">{formatBoolean(mortgageData.confirmFeesInterest)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/repaying-mortgage`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/mortgage-details`)}
      />

      <div className="data-container">
        {formData?.mortgageDetails?.applicant ? (
          renderMortgageSection(formData.mortgageDetails.applicant, 'Applicant Mortgage Details')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.mortgageDetails?.partner && 
          renderMortgageSection(formData.mortgageDetails.partner, 'Partner Mortgage Details')}
      </div>
    </div>
  );
}