import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import validateNonWorking from './NonWorkingForm/Validations';
import useFormStore from '../../../store';
import FormButtons from '../../../inc/FormButtons/FormButton'

const initialNonWorkingData = {
  recOtherIncome: '',
  monthlyAmount: '',
  moneyOriginatedFrom: '',
};

const NonWorking = () => {
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const navigate = useNavigate();
  const { applicantId } = useParams();

  const [errors, setErrors] = useState({});
  const errorRef = useRef(null);

  const [hasPartner, setHasPartner] = useState(false);
  const [nonWorkingData, setNonWorkingData] = useState({
    applicant: { ...initialNonWorkingData },
    partner: { ...initialNonWorkingData }
  });

  useEffect(() => {
    fetchFormData("mainDetails", applicantId);
    fetchFormData("nonWorkingData", applicantId);
  }, [fetchFormData, applicantId]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.nonWorkingData) {
      setNonWorkingData({
        applicant: {
          ...initialNonWorkingData,
          ...(formData.nonWorkingData.applicant || {})
        },
        partner: {
          ...initialNonWorkingData,
          ...(formData.nonWorkingData.partner || {})
        }
      });
    }
  }, [formData]);

  const handleChange = (e, person = 'applicant') => {
    let { name, value } = e.target;
    name = name.replace(`${person}-`, '');
    setNonWorkingData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [name]: value,
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanedNonWorkingData = {
      applicant: nonWorkingData.applicant,
      partner: hasPartner ? nonWorkingData.partner : null
    };
  
    const validationErrors = validateNonWorking(cleanedNonWorkingData.applicant, cleanedNonWorkingData.partner, hasPartner);
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return;
    }
  
    const updatedData = { ...cleanedNonWorkingData };
    
    if (updatedData.applicant.recOtherIncome === "No") {
      updatedData.applicant = {
        ...updatedData.applicant,
        monthlyAmount: null,
        moneyOriginatedFrom: null
      };
    }

    if (hasPartner && updatedData.partner?.recOtherIncome === "No") {
      updatedData.partner = {
        ...updatedData.partner,
        monthlyAmount: null,
        moneyOriginatedFrom: null
      };
    }
  
    updateFormData('nonWorkingData', updatedData, applicantId);
    navigate(`/mortgage/add-data/${applicantId}/total-income`)
  };

  const renderNonWorkingForm = (person, title) => {
    const personData = nonWorkingData[person] || { ...initialNonWorkingData };
    
    return (
      <>
        <h4>{title}</h4>
        <div className="form-group">
          <label>Do you receive other income / does someone else cover your expenses?</label>
          <div>
            <label>
              <input
                type="radio"
                name={`${person}-recOtherIncome`}
                value="Yes"
                checked={personData.recOtherIncome === 'Yes'}
                onChange={(e) => handleChange(e, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`${person}-recOtherIncome`}
                value="No"
                checked={personData.recOtherIncome === 'No'}
                onChange={(e) => handleChange(e, person)}
              />
              No
            </label>
          </div>
        </div>
  
        {personData.recOtherIncome === "Yes" && (
          <>
            <div className="form-group">
              <label>Monthly Amount Received:</label>
              <input
                name={`${person}-monthlyAmount`}
                type="number"
                value={personData.monthlyAmount}
                onChange={(e) => handleChange(e, person)}
              />
            </div>
  
            <div className="form-group">
              <label>Please provide details i.e. where the money originated from /or who pays?</label>
              <input
                name={`${person}-moneyOriginatedFrom`}
                type="text"
                value={personData.moneyOriginatedFrom}
                onChange={(e) => handleChange(e, person)}
              />
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
        onNext={()=>navigate(`/mortgage/add-data/${applicantId}/total-income`)}
        onBack={() => navigate(-1)}
      />

      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>

      <h3>Non-Working - Other Income Source</h3>

      {renderNonWorkingForm('applicant', 'Your Details')}

      {hasPartner && renderNonWorkingForm('partner', "Partner's Details")}

      <FormButtons
        onNext={()=>navigate(`/mortgage/add-data/${applicantId}/total-income`)}
        onBack={() => navigate(-1)}
      />
      
    </form>
  );
};

export default NonWorking;