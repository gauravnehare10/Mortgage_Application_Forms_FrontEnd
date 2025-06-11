import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function MainDetails() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("personalDetails", applicantId);
  }, [fetchFormData, applicantId]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  };

  const renderDependents = (dependents) => {
    if (!dependents || dependents.length === 0) return null;

    return (
      <div className="details-card dependents-card">
        <h2>Dependents</h2>
        <div className="details-grid">
          {dependents.map((dependent, index) => (
            <React.Fragment key={`dependent-${index}`}>
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{dependent.dependentName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date of Birth:</span>
                <span className="detail-value">
                  {formatDate(dependent.dependentDateOfBirth)} (Age {dependent.dependentAge})
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Dependent Of:</span>
                <span className="detail-value">{dependent.dependentOf}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Financial Dependent:</span>
                <span className="detail-value">{dependent.isFinancialDependent}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Resides With:</span>
                <span className="detail-value">{dependent.residesWith}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  const renderPersonDetails = (person, title) => {
    if (!person) return null;

    return (
      <div className={`details-card ${title === 'Partner Details' ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Full Name:</span>
            <span className="detail-value">
              {[person.title, person.forename, person.middleName, person.surname].filter(Boolean).join(' ')}
            </span>
          </div>
          
          {person.previousName && (
            <div className="detail-item">
              <span className="detail-label">Previous Name:</span>
              <span className="detail-value">{person.previousName}</span>
            </div>
          )}
          
          {person.dateOfNameChange && (
            <div className="detail-item">
              <span className="detail-label">Date of Name Change:</span>
              <span className="detail-value">{formatDate(person.dateOfNameChange)}</span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="detail-label">Mother's Maiden Name:</span>
            <span className="detail-value">{person.mothersMaidenName || 'Not provided'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Date of Birth:</span>
            <span className="detail-value">
              {formatDate(person.dateOfBirth)} (Age {person.age})
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Gender:</span>
            <span className="detail-value">
              {person.identifiesAs || person.genderAtBirth || 'Not provided'}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">NI Number:</span>
            <span className="detail-value">{person.niNumber || 'Not provided'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Relationship Status:</span>
            <span className="detail-value">{person.relationshipStatus}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Nationality:</span>
            <span className="detail-value">{person.nationality}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Ex-Patriate:</span>
            <span className="detail-value">{person.isExPatriate}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Public Official:</span>
            <span className="detail-value">{person.isPublicOfficial}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Country of Residence:</span>
            <span className="detail-value">{person.countryOfResidence}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Temporarily Outside UK:</span>
            <span className="detail-value">{person.tempOutsideUK}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Retirement Age:</span>
            <span className="detail-value">{person.retirementAge}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Mobile Number:</span>
            <span className="detail-value">{person.mobileNumber || 'Not provided'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Daytime Number:</span>
            <span className="detail-value">{person.daytimeNumber || 'Not provided'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/residential`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/personal-details`)}
       />

      <div className="data-container">
        {formData?.personalDetails?.mainClientDetails ? (
          renderPersonDetails(formData.personalDetails.mainClientDetails, 'Main Client Details')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.personalDetails?.partnerDetails && 
          renderPersonDetails(formData.personalDetails.partnerDetails, 'Partner Details')}
        
        {formData?.personalDetails?.mainClientDetails?.hasDependents === 'Yes' && 
          renderDependents(formData.personalDetails.mainClientDetails.dependents)}
      </div>
    </div>
  );
}