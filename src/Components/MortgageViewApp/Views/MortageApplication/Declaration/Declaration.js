import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from "../../../../MortgageApp/store";
import '../../../Views/DataDisplay.css';

export default function Declaration() {
  const { formData, fetchFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  useEffect(() => {
    fetchFormData("declaration", applicantId);
  }, [fetchFormData, applicantId]);

  const formatBoolean = (value) => {
    return value ? 'Yes' : 'No';
  };

  return (
    <div className="data-display-page">
      <div className="form-buttons">
        <div className="form-buttons-card">
          <button 
            type="button" 
            onClick={() => navigate(-1)} 
            className="back-button"
            aria-label="Go back to previous page"
          >
            Back
          </button>
        </div>
      </div>

      <div className="data-container">
        <div className="details-card">
          <h2>Declaration</h2>
          
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Information Confirmed:</span>
              <span className="detail-value">
                {formatBoolean(formData?.declaration?.confirmInformation)}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Understands Limited Advice:</span>
              <span className="detail-value">
                {formatBoolean(formData?.declaration?.understandLimitedAdvice)}
              </span>
            </div>
            
            <div className="detail-item">
              <span className="detail-label">Understands False Representation:</span>
              <span className="detail-value">
                {formatBoolean(formData?.declaration?.understandFalseRepresentation)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}