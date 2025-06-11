import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function TotalIncome() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("totalIncomeData", applicantId);
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
    if (!incomeData) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Annual Gross Income:</span>
            <span className="detail-value">{formatCurrency(incomeData.annualGrossMainIncome)}</span>
          </div>
          
          {incomeData.netProfitBeforeTax && (
            <div className="detail-item">
              <span className="detail-label">Net Profit Before Tax:</span>
              <span className="detail-value">{formatCurrency(incomeData.netProfitBeforeTax)}</span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="detail-label">Annual Other Income:</span>
            <span className="detail-value">{formatCurrency(incomeData.annualOtherIncome)}</span>
          </div>
          
          <div className="detail-item highlight">
            <span className="detail-label">Total Annual Income:</span>
            <span className="detail-value">{formatCurrency(incomeData.totalAnnualIncome)}</span>
          </div>
          
          <div className="detail-item highlight">
            <span className="detail-label">Total Net Monthly Income:</span>
            <span className="detail-value">{formatCurrency(incomeData.totalNetMonthlyIncome)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/existing-credit-commits`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/total-income`)}
      />

      <div className="data-container">
        {formData?.totalIncomeData?.applicant ? (
          renderIncomeSection(formData.totalIncomeData.applicant, 'Applicant Total Income')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.totalIncomeData?.partner && 
          renderIncomeSection(formData.totalIncomeData.partner, 'Partner Total Income')}
      </div>
    </div>
  );
}