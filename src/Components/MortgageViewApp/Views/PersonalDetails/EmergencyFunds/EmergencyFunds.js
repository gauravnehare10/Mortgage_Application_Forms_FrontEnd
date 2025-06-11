import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function EmergencyFunds() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("emergencyFundData", applicantId);
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

  const renderEmergencyFundsSection = (fundData, title) => {
    if (!fundData) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Emergency Capital:</span>
            <span className="detail-value">{formatCurrency(fundData.emergencyCapital)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Medical Issues:</span>
            <span className="detail-value">{fundData.medicalIssues || 'Not specified'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Smoker Status:</span>
            <span className="detail-value">{fundData.smokerStatus || 'Not specified'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Has Will:</span>
            <span className="detail-value">{fundData.hasWill || 'No'}</span>
          </div>
          
          {fundData.hasWill === 'No' && (
            <div className="detail-item">
              <span className="detail-label">Refer for Will:</span>
              <span className="detail-value">{fundData.referForWill || 'No'}</span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="detail-label">Power of Attorney:</span>
            <span className="detail-value">{fundData.powerOfAttorney || 'No'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/application-type`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/emergency-fund`)}
       />

      <div className="data-container">
        {formData?.emergencyFundData?.applicant ? (
          renderEmergencyFundsSection(formData.emergencyFundData.applicant, 'Applicant Emergency Funds / Health and Will Details')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.emergencyFundData?.partner && 
          renderEmergencyFundsSection(formData.emergencyFundData.partner, 'Partner Emergency Funds / Health and Will Details')}
      </div>
    </div>
  );
}