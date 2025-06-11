import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function SecondaryOccupation() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("secondaryOccupationData", applicantId);
  }, [fetchFormData, applicantId]);

  const formatAddress = (addressArray) => {
    if (!addressArray || !Array.isArray(addressArray)) return 'Not provided';
    const filteredAddress = addressArray.filter(part => part && part.trim() !== '');
    return filteredAddress.join(', ') || 'Not provided';
  };

  const renderSecondaryOccupation = (data, title) => {
    if (!data || data.hasAddEarnedIncome !== 'Yes') return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Employment Status:</span>
            <span className="detail-value">{data.secondaryEmploymentStatus || 'Not provided'}</span>
          </div>
          
          {data.selfEmployedType && (
            <div className="detail-item">
              <span className="detail-label">Self-Employed Type:</span>
              <span className="detail-value">{data.selfEmployedType}</span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="detail-label">Occupation Status:</span>
            <span className="detail-value">{data.occupationStatus || 'Not provided'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Job Title:</span>
            <span className="detail-value">{data.secondaryOccupationTitle || 'Not provided'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Hours of Work:</span>
            <span className="detail-value">{data.hoursOfWork ? `${data.hoursOfWork} hours` : 'Not provided'}</span>
          </div>
          
          {data.secondaryEmployerName && (
            <div className="detail-item">
              <span className="detail-label">Employer Name:</span>
              <span className="detail-value">{data.secondaryEmployerName}</span>
            </div>
          )}
          
          <div className="detail-item full-width">
            <span className="detail-label">Employer Address:</span>
            <span className="detail-value">
              {formatAddress(data.secondaryEmployerAddress)}
              {data.secondaryEmployerPostcode && `, ${data.secondaryEmployerPostcode.toUpperCase()}`}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/other-monthly-income`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/secondary-occupation`)}
      />

      <div className="data-container">
        {formData?.secondaryOccupationData?.applicant?.hasAddEarnedIncome === 'Yes' ? (
          renderSecondaryOccupation(formData.secondaryOccupationData.applicant, 'Applicant Secondary Occupation')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.secondaryOccupationData?.partner?.hasAddEarnedIncome === 'Yes' && 
          renderSecondaryOccupation(formData.secondaryOccupationData.partner, 'Partner Secondary Occupation')}
      </div>
    </div>
  );
}