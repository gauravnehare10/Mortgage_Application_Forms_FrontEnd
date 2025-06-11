import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function SelfEmpDetails() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("selfEmployedData", applicantId);
  }, [fetchFormData, applicantId]);

  const formatAddress = (addressArray) => {
    if (!addressArray || !Array.isArray(addressArray)) return 'Not provided';
    const filteredAddress = addressArray.filter(part => part && part.trim() !== '');
    return filteredAddress.join(', ') || 'Not provided';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderSelfEmpSection = (selfEmpData, title) => {
    if (!selfEmpData || Object.keys(selfEmpData).length === 0) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Business Name:</span>
            <span className="detail-value">{selfEmpData.businessName || 'Not provided'}</span>
          </div>
          
          <div className="detail-item full-width">
            <span className="detail-label">Business Address:</span>
            <span className="detail-value">
              {formatAddress(selfEmpData.businessAddress)}
              {selfEmpData.businessPostcode && `, ${selfEmpData.businessPostcode}`}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Position in Business:</span>
            <span className="detail-value">{selfEmpData.positionInBusiness || 'Not provided'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Start Date:</span>
            <span className="detail-value">{formatDate(selfEmpData.startDate)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Years of Accounts:</span>
            <span className="detail-value">{selfEmpData.yearsOfAccounts || 'Not provided'}</span>
          </div>
          
          {selfEmpData.accountantDetails && (
            <div className="detail-item full-width">
              <span className="detail-label">Accountant Details:</span>
              <span className="detail-value">{selfEmpData.accountantDetails}</span>
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
        onNext={() => navigate(`/mortgage/${applicantId}/self-employed-income-details`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/self-employed-details`)}
      />

      <div className="data-container">
        {formData?.selfEmployedData?.client ? (
          renderSelfEmpSection(formData.selfEmployedData.client, 'Client Self-Employment Details')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.selfEmployedData?.partner && 
          renderSelfEmpSection(formData.selfEmployedData.partner, 'Partner Self-Employment Details')}
      </div>
    </div>
  );
}