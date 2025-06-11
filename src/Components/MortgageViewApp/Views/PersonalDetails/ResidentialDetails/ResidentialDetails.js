import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';
import FormButtons from '../../inc/FormButtons/FormButton';

export default function ResidentialDetails() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("residentialData", applicantId);
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

  const renderResidentialSection = (residences, title) => {
    if (!residences || residences.length === 0) return null;

    return (
      <div className={`details-card ${title.includes('Partner') ? 'partner-card' : ''}`}>
        <h2>{title}</h2>
        
        <div className="residences-list">
          {residences.map((residence, index) => (
            <div key={`residence-${index}`} className="residence-item">
              <div className="details-grid">
                <div className="detail-item full-width">
                  <span className="detail-label">Address-{index+1} :</span>
                  <span className="detail-value">{formatAddress(residence.address)}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Postcode:</span>
                  <span className="detail-value">{residence.postcode || 'Not provided'}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">{residence.status || 'Not provided'}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Date Moved In:</span>
                  <span className="detail-value">{formatDate(residence.dateMovedIn)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="data-display-page">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={() => navigate(`/mortgage/${applicantId}/occupation`)}
        editData={() => navigate(`/mortgage/add-data/${applicantId}/residential`)}
       />

      <div className="data-container">
        {formData?.residentialData?.client ? ( 
          renderResidentialSection(formData.residentialData.client, 'Client Residential History')
        ):(
          <span className="no-detail-label">No data provided</span>
        )}
        
        {formData?.residentialData?.partner && 
          renderResidentialSection(formData.residentialData.partner, 'Partner Residential History')}
      </div>
    </div>
  );
}