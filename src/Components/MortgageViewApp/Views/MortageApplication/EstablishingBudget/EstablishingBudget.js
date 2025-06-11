import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function EstablishingBudget() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("establishBudgetData", applicantId);
  }, [fetchFormData, applicantId]);

  const renderBudgetSection = (establishBudgetData, title) => {
    if (!establishBudgetData) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Plans to Repay Early:</span>
            <span className="detail-value">{establishBudgetData.netDisposableIncome}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Plans to Move Home:</span>
            <span className="detail-value">{establishBudgetData.monthlyMortgageAllocation}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/mortgage-details`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/establish-budget`)}
      />

      <div className="data-container">
        {formData?.establishBudgetData?.applicant ? (
          renderBudgetSection(formData.establishBudgetData.applicant, 'Applicant Budget')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.establishBudgetData?.partner && 
          renderBudgetSection(formData.establishBudgetData.partner, 'Partner Budget')}
      </div>
    </div>
  );
}