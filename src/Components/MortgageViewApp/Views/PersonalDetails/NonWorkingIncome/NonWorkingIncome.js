import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function NonWorkingIncome() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("nonWorkingData", applicantId);
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

  const renderIncomeSection = (incomeData, title) => {
    if (!incomeData || incomeData.recOtherIncome !== 'Yes') return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Receives Other Income:</span>
            <span className="detail-value">Yes</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Monthly Amount:</span>
            <span className="detail-value">{formatCurrency(incomeData.monthlyAmount)}</span>
          </div>
          
          {incomeData.moneyOriginatedFrom && (
            <div className="detail-item full-width">
              <span className="detail-label">Source of Income:</span>
              <span className="detail-value">{incomeData.moneyOriginatedFrom}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/total-income`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/other-income-source`)}
       />

      <div className="data-container">
        {formData?.nonWorkingData?.applicant ? (
          renderIncomeSection(formData.nonWorkingData.applicant, 'Applicant Non-Working Income')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.nonWorkingData?.partner && 
          renderIncomeSection(formData.nonWorkingData.partner, 'Partner Non-Working Income')}
      </div>
    </div>
  );
}