import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from '../../../store';
import FormButtons from '../../../inc/FormButtons/FormButton'
import { validateApplicationType } from './ApplicationTypeForm/Validations';

const initialApplicationType = {
  loanPurpose: [],
  loanType: '',
};

export const loanPurposes = [
  'Buying First Home', 'Business Purpose', 'Moving House', 'Other Property Purchase',
  'Looking for new mortgage deal', 'Financing home improvements', 'Financing car purchase',
  'Debt Consolidation', 'Divorce Settlement', 'School Fees', 'Tax Bill', 'Other'
];

export const loanTypes = [
  'Bridging Loan', 'BTL Further Advance', 'BTL Product Transfer', 'BTL Purchase',
  'BTL Remortgage', 'BTL Secured Loan', 'First Time Buyer', 'Further Advance',
  'Holiday Home', 'Holiday Let', 'Let To Buy', 'Mover', 'Product Transfer',
  'Remortgage', 'Right To Buy', 'Right To Buy Remortgage', 'Second Charge Mortgage',
  'Second Home', 'Self Build', 'Self Build Remortgage', 'Shared Ownership', 'Shared Ownership Remortgage'
];

const ApplicationType = () => {
  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef();
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [hasPartner, setHasPartner] = useState(false);
  const { applicantId } = useParams();

  const [applicationTypeData, setApplicationTypeData] = useState({
    applicant: { ...initialApplicationType },
    partner: { ...initialApplicationType }
  });

  useEffect(() => {
    fetchFormData("mainDetails", applicantId);
    fetchFormData("applicationTypeData", applicantId);
  }, [fetchFormData, applicantId]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.applicationTypeData) {
      setApplicationTypeData({
        applicant: {
          ...initialApplicationType,
          ...(formData.applicationTypeData.applicant || {})
        },
        partner: {
          ...initialApplicationType,
          ...(formData.applicationTypeData.partner || {})
        }
      });
    }
  }, [formData.applicationTypeData, formData.mainDetails]);

  const handleChange = (e, person = 'applicant') => {
    const { name, value, type, checked } = e.target;

    setApplicationTypeData(prev => {
      const updatedData = { ...prev };
      
      if (type === 'checkbox') {
        updatedData[person] = {
          ...prev[person],
          loanPurpose: checked
            ? [...prev[person].loanPurpose, value]
            : prev[person].loanPurpose.filter(item => item !== value)
        };
      } else {
        updatedData[person] = {
          ...prev[person],
          [name]: value
        };
      }
      
      return updatedData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanedApplicationTypeData = {
      ...applicationTypeData,
      partner: hasPartner ? applicationTypeData.partner : null
    };
  
    const validationErrors = validateApplicationType(cleanedApplicationTypeData, hasPartner);
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
    updateFormData('applicationTypeData', cleanedApplicationTypeData, applicantId);
    navigate(`/mortgage/add-data/${applicantId}/early-repayment`);
  };

  const renderApplicationTypeForm = (person, title) => {
    const personData = applicationTypeData[person] || { ...initialApplicationType };
    
    return (
      <>
        <h4>{title}</h4>
        
        {/* Loan Purpose (Checkboxes) */}
        <div className="form-group">
          <label>What is the purpose of the loan? (Select all that apply)</label>
          <div className='employer-check-box'>
            {loanPurposes?.map((purpose) => (
              <label key={purpose}>
                <input
                  type="checkbox"
                  name="loanPurpose"
                  value={purpose}
                  checked={personData.loanPurpose?.includes(purpose)}
                  onChange={(e) => handleChange(e, person)}
                />
                {purpose}
              </label>
            ))}
          </div>
        </div>

        {/* Loan Type (Dropdown) */}
        <div className="form-group">
          <label>Type of Loan?</label>
          <select
            name="loanType"
            value={personData.loanType}
            onChange={(e) => handleChange(e, person)}
            required
          >
            <option value="">Select Loan Type</option>
            {loanTypes?.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/early-repayment`)}
      />

      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>

      <h3>Application Type Details</h3>

      {renderApplicationTypeForm('applicant', 'Your Application Details')}

      {hasPartner && renderApplicationTypeForm('partner', "Partner's Application Details")}

      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/early-repayment`)}
      />
    </form>
  );
};

export default ApplicationType;