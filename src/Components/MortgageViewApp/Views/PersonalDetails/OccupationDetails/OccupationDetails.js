import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function OccupationDetails() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("occupationData", applicantId);
  }, [fetchFormData, applicantId]);

  const formatAddress = (addressArray) => {
    if (!addressArray || !Array.isArray(addressArray)) return 'Not provided';
    const filteredAddress = addressArray.filter(part => part && part.trim() !== '');
    return filteredAddress.join(', ') || 'Not provided';
  };

  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return 'Not provided';
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(amount));
  };

  const renderOccupationSection = (person, title) => {
    if (!person) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Employment Status:</span>
            <span className="detail-value">{person.status || 'Not provided'}</span>
          </div>
          
          {person.jobTitle && (
            <div className="detail-item">
              <span className="detail-label">Job Title:</span>
              <span className="detail-value">{person.jobTitle}</span>
            </div>
          )}
          
          {person.employmentType && (
            <div className="detail-item">
              <span className="detail-label">Employment Type:</span>
              <span className="detail-value">{person.employmentType}</span>
            </div>
          )}
          
          {person.selfEmployedType && (
            <div className="detail-item">
              <span className="detail-label">Self-Employed Type:</span>
              <span className="detail-value">{person.selfEmployedType}</span>
            </div>
          )}
          
          {person.employerName && (
            <div className="detail-item">
              <span className="detail-label">Employer Name:</span>
              <span className="detail-value">{person.employerName}</span>
            </div>
          )}
          
          <div className="detail-item full-width">
            <span className="detail-label">Employer Address:</span>
            <span className="detail-value">
              {formatAddress(person.employerAddress)}
              {person.employerPostcode && `, ${person.employerPostcode}`}
            </span>
          </div>
          
          {person.annualIncome && (
            <div className="detail-item">
              <span className="detail-label">Annual Income:</span>
              <span className="detail-value">{formatCurrency(person.annualIncome)}</span>
            </div>
          )}
          
          {person.totalGrossIncome && (
            <div className="detail-item">
              <span className="detail-label">Total Gross Income:</span>
              <span className="detail-value">{formatCurrency(person.totalGrossIncome)}</span>
            </div>
          )}
          
          {person.totalNetIncome && (
            <div className="detail-item">
              <span className="detail-label">Total Net Income:</span>
              <span className="detail-value">{formatCurrency(person.totalNetIncome)}</span>
            </div>
          )}
          
          {person.previousEmployment?.length > 0 ? (
            <div className="detail-item full-width">
              <span className="detail-label">Previous Employment:</span>
              <div className="previous-employment-list">
                {person.previousEmployment.map((job, index) => (
                  <div key={`prev-job-${index}`} className="previous-job">
                    {job.employerName && <div>Employer: {job.employerName}</div>}
                    {job.jobTitle && <div>Position: {job.jobTitle}</div>}
                    {job.duration && <div>Duration: {job.duration}</div>}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="detail-item full-width">
              <span className="detail-label">Previous Employment:</span>
              <span className="detail-value">None</span>
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
        onNext={() => navigate(`/mortgage/${applicantId}/employer-benefit`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/occupation`)}
       />

      <div className="data-container">
        {formData?.occupationData?.client ? (
          renderOccupationSection(formData.occupationData.client, 'Client Occupation Details')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.occupationData?.partner && 
          renderOccupationSection(formData.occupationData.partner, 'Partner Occupation Details')}
      </div>
    </div>
  );
}