import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function RepayingMortgage() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("repaymentMortgageData", applicantId);
  }, [fetchFormData, applicantId]);

  const renderRepaymentSection = (repaymentMortgageData, title) => {
    if (!repaymentMortgageData) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Plans to Repay Early:</span>
            <span className="detail-value">{repaymentMortgageData.mortgageRepaymentCertainty}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Plans to Move Home:</span>
            <span className="detail-value">{repaymentMortgageData.repaymentMethod}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/solicitor-estate-agent`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/repaying-mortgage`)}
      />

      <div className="data-container">
        {formData?.repaymentMortgageData?.applicant ? (
          renderRepaymentSection(formData.repaymentMortgageData.applicant, 'Applicant Repayment Mortgage Details')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.repaymentMortgageData?.partner && 
          renderRepaymentSection(formData.repaymentMortgageData.partner, 'Partner Repayment Mortgage Details')}
      </div>
    </div>
  );
}