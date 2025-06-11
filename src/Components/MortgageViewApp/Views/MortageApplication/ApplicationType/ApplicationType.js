import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function ApplicationType() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("applicationTypeData", applicantId);
  }, [fetchFormData, applicantId]);

  const formatLoanPurposes = (purposes) => {
    if (!purposes || !Array.isArray(purposes)) return 'Not specified';
    return purposes.join(', ');
  };

  const renderApplicationTypeSection = (appData, title) => {
    if (!appData) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item full-width">
            <span className="detail-label">Loan Purpose(s):</span>
            <span className="detail-value">{formatLoanPurposes(appData.loanPurpose)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Loan Type:</span>
            <span className="detail-value">{appData.loanType || 'Not specified'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/early-repayment`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/application-type`)}
      />

      <div className="data-container">
        {formData?.applicationTypeData?.applicant ? ( 
          renderApplicationTypeSection(formData.applicationTypeData.applicant, 'Applicant Application Type')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.applicationTypeData?.partner && 
          renderApplicationTypeSection(formData.applicationTypeData.partner, 'Partner Application Type')}
      </div>
    </div>
  );
}