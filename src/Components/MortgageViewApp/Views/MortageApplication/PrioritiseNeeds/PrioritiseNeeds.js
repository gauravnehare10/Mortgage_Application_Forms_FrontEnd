import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function PrioritiseNeeds() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("prioritiseNeedsData", applicantId);
  }, [fetchFormData, applicantId]);

  const renderNeedsSection = (needsData, title) => {
    if (!needsData) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item full-width">
            <span className="detail-label">Important Features:</span>
            <span className="detail-value">{needsData.importantFeatures || 'Not specified'}</span>
          </div>
          
          <div className="detail-item full-width">
            <span className="detail-label">Reason for Importance:</span>
            <span className="detail-value">{needsData.importanceReason || 'Not specified'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/establishing-budget`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/prioritise-your-needs`)}
      />

      <div className="data-container">
        {formData?.prioritiseNeedsData?.applicant ? (
          renderNeedsSection(formData.prioritiseNeedsData.applicant, 'Applicant Priorities')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.prioritiseNeedsData?.partner && 
          renderNeedsSection(formData.prioritiseNeedsData.partner, 'Partner Priorities')}
      </div>
    </div>
  );
}