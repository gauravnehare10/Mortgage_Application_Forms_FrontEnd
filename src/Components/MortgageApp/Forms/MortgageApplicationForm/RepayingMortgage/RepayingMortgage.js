import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from '../../../store';
import FormButtons from '../../../inc/FormButtons/FormButton'
import { validateRepayingMortgage } from './RepayingMortgageForm/Validations';

const RepayingMortgage = () => {
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef(null);
  const navigate = useNavigate();
  const [hasPartner, setHasPartner] = useState(false);
  const { applicantId } = useParams();
  
  const initialRepaymentData = {
    mortgageRepaymentCertainty: '',
    repaymentMethod: '',
  };

  const [repaymentData, setRepaymentData] = useState({
    applicant: { ...initialRepaymentData },
    partner: { ...initialRepaymentData }
  });

  const handleChange = (e, person = 'applicant') => {
    const { name, value, type } = e.target;
    
    const cleanFieldName = name.replace(`${person}-`, '');
    
    if (['mortgageRepaymentCertainty', 'repaymentMethod'].includes(cleanFieldName)) {
      setRepaymentData(prev => ({
        ...prev,
        [person]: {
          ...prev[person],
          [cleanFieldName]: value,
        }
      }));
    }
  };

  useEffect(() => {
    fetchFormData("repaymentMortgageData", applicantId);
    fetchFormData("mainDetails", applicantId);
  }, [fetchFormData, applicantId]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.repaymentMortgageData) {
      setRepaymentData({
        applicant: {
          ...initialRepaymentData,
          ...(formData.repaymentMortgageData.applicant || {})
        },
        partner: {
          ...initialRepaymentData,
          ...(formData.repaymentMortgageData.partner || {})
        }
      });
    }
  }, [formData.repaymentMortgageData, formData.mainDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanedRepaymentData = {
      ...repaymentData,
      partner: hasPartner ? repaymentData.partner : null
    };
  
    const validationErrors = validateRepayingMortgage(cleanedRepaymentData, hasPartner);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }, 100);
      return;
    }
    updateFormData('repaymentMortgageData', cleanedRepaymentData, applicantId);
    navigate(`/mortgage/add-data/${applicantId}/solicitor-estate-agent`)
  };

  const renderRepaymentForm = (person, title) => {
    const personData = repaymentData[person] || { ...initialRepaymentData };
    
    return (
      <div className="person-section">
        <h4>{title}</h4>

        <div className="form-group">
          <label>Is it important for you to be certain that your mortgage will be repaid at the end of term?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name={`${person}-mortgageRepaymentCertainty`}
                value="Yes"
                checked={personData.mortgageRepaymentCertainty === 'Yes'}
                onChange={(e) => handleChange(e, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${person}-mortgageRepaymentCertainty`}
                value="No"
                checked={personData.mortgageRepaymentCertainty === 'No'}
                onChange={(e) => handleChange(e, person)}
              />
              No
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>How do you intend to repay your mortgage?</label>
          <select 
            name={`${person}-repaymentMethod`}
            value={personData.repaymentMethod}
            onChange={(e) => handleChange(e, person)}
          >
            <option value="">Select method</option>
            <option value="Capital Repayment">Capital Repayment</option>
            <option value="Interest Only">Interest Only</option>
            <option value="Part and Part">Part and Part</option>
          </select>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/solicitor-estate-agent`)}
      />

        <div className="form-group">
          {Object.keys(errors).length > 0 && (
            <div ref={errorRef} className="error-message">
              {Object.values(errors).join(", ")}
            </div>
          )}
        </div>

      <h3>Repaying Mortgage Details</h3>

      {renderRepaymentForm('applicant', 'Your Details')}

      {hasPartner && renderRepaymentForm('partner', "Partner's Details")}

      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/solicitor-estate-agent`)}
      />
    </form>
  );
};

export default RepayingMortgage;