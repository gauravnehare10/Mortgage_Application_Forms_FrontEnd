import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function SelfEmpIncomeDetails() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("selfEmployedIncomeData", applicantId);
  }, [fetchFormData, applicantId]);

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return 'Not provided';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(amount));
  };

  const renderIncomeSection = (incomeData, title) => {
    if (!incomeData || Object.keys(incomeData).length === 0) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Is Director:</span>
            <span className="detail-value">{incomeData.isDirector || 'Not provided'}</span>
          </div>
          
          {incomeData.isDirector === 'Yes' && (
            <div className="detail-item">
              <span className="detail-label">Shareholding Percentage:</span>
              <span className="detail-value">{incomeData.shareholdingPercentage || '0'}%</span>
            </div>
          )}
          
          <div className="section-divider">
            <h3>Annual Net Profit</h3>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Last Year:</span>
            <span className="detail-value">{formatCurrency(incomeData.annualNetProfitLastYear)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">2 Years Ago:</span>
            <span className="detail-value">{formatCurrency(incomeData.annualNetProfit2YearsAgo)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">3 Years Ago:</span>
            <span className="detail-value">{formatCurrency(incomeData.annualNetProfit3YearsAgo)}</span>
          </div>
          
          <div className="section-divider">
            <h3>Dividends</h3>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Last Year:</span>
            <span className="detail-value">{formatCurrency(incomeData.dividendsLastYear)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">2 Years Ago:</span>
            <span className="detail-value">{formatCurrency(incomeData.dividends2YearsAgo)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">3 Years Ago:</span>
            <span className="detail-value">{formatCurrency(incomeData.dividends3YearsAgo)}</span>
          </div>
          
          <div className="section-divider">
            <h3>PAYE Salary</h3>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Last Year:</span>
            <span className="detail-value">{formatCurrency(incomeData.payeSalaryLastYear)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">2 Years Ago:</span>
            <span className="detail-value">{formatCurrency(incomeData.payeSalary2YearsAgo)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">3 Years Ago:</span>
            <span className="detail-value">{formatCurrency(incomeData.payeSalary3YearsAgo)}</span>
          </div>
          
          <div className="section-divider">
            <h3>Current Income</h3>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Net Monthly Income:</span>
            <span className="detail-value">{formatCurrency(incomeData.currentNetMonthlyIncome)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/secondary-occupation`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/self-employed-income-details`)}
      />

      <div className="data-container">
        {formData?.selfEmployedIncomeData?.client ? (
          renderIncomeSection(formData.selfEmployedIncomeData.client, 'Client Self-Employment Income Details')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.selfEmployedIncomeData?.partner && 
          renderIncomeSection(formData.selfEmployedIncomeData.partner, 'Partner Self-Employment Income Details')}
      </div>
    </div>
  );
}