import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function EmployerBenefits() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  const [occupationData, setOccupationData] = useState({
      client: {},
      partner: {}
    });

  useEffect(() => {
    fetchFormData("employerBenefitData", applicantId);
    fetchFormData("occupationData", applicantId);
  }, [fetchFormData, applicantId]);

   // Initialize occupation data
  useEffect(() => {
    if (formData.occupationData) {
      setOccupationData({
        client: { ...formData.occupationData.client },
        partner: { ...formData.occupationData.partner }
      });
    }
  }, [formData.occupationData]);

  // Handle navigation based on occupation status
  const handleNext = () => {
    if (occupationData.client.status === "Self-Employed") {
      navigate(`/mortgage/add-data/${applicantId}/self-employed-details`);
    } else {
      navigate(`/mortgage/add-data/${applicantId}/secondary-occupation`)
    }
  };

  const renderBenefitsSection = (benefitsData, title) => {
    if (!benefitsData) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Sick Pay Other Than SSP:</span>
            <span className="detail-value">{benefitsData.sickPayOtherThanSSP || 'Not provided'}</span>
          </div>
          
          {benefitsData.employerBenefits?.length > 0 ? (
            <div className="detail-item">
              <span className="detail-label">Employer Benefits:</span>
              <div className="benefits-list">
                {benefitsData.employerBenefits.map((benefit, index) => (
                  <div key={`benefit-${index}`} className="benefit-item">
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="detail-item">
              <span className="detail-label">Employer Benefits:</span>
              <span className="detail-value">None</span>
            </div>
          )}
          
          {benefitsData.furtherDetails && (
            <div className="detail-item full-width">
              <span className="detail-label">Further Details:</span>
              <span className="detail-value">{benefitsData.furtherDetails}</span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="detail-label">Other Flexible Benefits:</span>
            <span className="detail-value">{benefitsData.otherFlexibleBenefits || 'Not provided'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Include in Shortfall:</span>
            <span className="detail-value">{benefitsData.includeInShortfall || 'Not specified'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={handleNext}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/employer-benefit`)}
       />

      <div className="data-container">
        {formData?.employerBenefitData?.client ? (
          renderBenefitsSection(formData.employerBenefitData.client, 'Client Employer Benefits')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.employerBenefitData?.partner && 
          renderBenefitsSection(formData.employerBenefitData.partner, 'Partner Employer Benefits')}
      </div>
    </div>
  );
}