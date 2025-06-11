import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from '../../../store';
import FormButtons from '../../../inc/FormButtons/FormButton'
import { validateOtherMonthlyIncome } from './OtherMonthlyIncForm/Validations';

const initialIncomeData = {
  occupationalPension: '',
  personalPension: '',
  statePension: '',
  investments: '',
  maintenance: '',
  rentalIncome: '',
  receivesStateBenefits: '',
  totalOtherIncome: '',
  stateBenefits: {
    childBenefit: '',
    childTaxCredits: '',
    workingTaxCredits: '',
    disabilityLivingAllowance: '',
    attendanceAllowance: '',
    housingBenefit: '',
    employmentSupportAllowance: '',
    other: '',
  },
};

const OtherMonthlyInc = () => {
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();

  const [errors, setErrors] = useState({})
  const errorRef = useRef();
  const { applicantId } = useParams();

  const [hasPartner, setHasPartner] = useState(false);
  const [incomeData, setIncomeData] = useState({
    applicant: { ...initialIncomeData },
    partner: { ...initialIncomeData }
  });

  const handleChange = (field, value, person = 'applicant') => {
    setIncomeData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: value
      }
    }));
  };

  const handleStateBenefitsChange = (field, value, person = 'applicant') => {
    setIncomeData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        stateBenefits: {
          ...prev[person].stateBenefits,
          [field]: value
        }
      }
    }));
  };

  const calculateTotalIncome = (person = 'applicant') => {
    const personData = incomeData[person];
    const total = [
      personData.occupationalPension,
      personData.personalPension,
      personData.statePension,
      personData.investments,
      personData.maintenance,
      personData.rentalIncome,
      ...(personData.receivesStateBenefits === 'Yes'
        ? Object.values(personData.stateBenefits)
        : []),
    ].reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

    handleChange('totalOtherIncome', total.toFixed(2), person);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanedIncomeData = {
      applicant: incomeData.applicant,
      partner: hasPartner ? incomeData.partner : null
    };
    const validationErrors = validateOtherMonthlyIncome(cleanedIncomeData, hasPartner);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setTimeout(() => {
        if (errorRef.current) {
          errorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
      return;
    }
    const updatedData = { ...cleanedIncomeData };
    
    if (updatedData.applicant.receivesStateBenefits === "No") {
      updatedData.applicant = {
        ...updatedData.applicant,
        stateBenefits: { ...initialIncomeData.stateBenefits }
      };
    }
  
    if (hasPartner && updatedData.partner?.receivesStateBenefits === "No") {
      updatedData.partner = {
        ...updatedData.partner,
        stateBenefits: { ...initialIncomeData.stateBenefits }
      };
    }

    setIncomeData(updatedData);
    updateFormData('otherMonthlyIncome', updatedData, applicantId);
    navigate(`/mortgage/add-data/${applicantId}/other-income-source`)
  };

  useEffect(() => {
    fetchFormData("mainDetails", applicantId);
    fetchFormData("otherMonthlyIncome", applicantId);
  }, [fetchFormData, applicantId]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.otherMonthlyIncome) {
      setIncomeData({
        applicant: {
          ...initialIncomeData,
          ...(formData.otherMonthlyIncome.applicant || {})
        },
        partner: {
          ...initialIncomeData,
          ...(formData.otherMonthlyIncome.partner || {})
        }
      });
    }
  }, [formData]);

  const renderIncomeForm = (person, title) => {
    const personData = incomeData[person] || { ...initialIncomeData };
    
    return (
      <>
        <h4>{title}</h4>
        {[
          'occupationalPension',
          'personalPension',
          'statePension',
          'investments',
          'maintenance',
          'rentalIncome',
        ].map((field, idx) => (
          <div key={idx} className="form-group">
            <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</label>
            <input
              type="number"
              value={personData[field]}
              onChange={(e) => handleChange(field, e.target.value, person)}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Do you receive any State Benefits?</label>
          <div>
            <label>
              <input
                type="radio"
                name={`stateBenefits-${person}`}
                value="Yes"
                checked={personData.receivesStateBenefits === 'Yes'}
                onChange={(e) => handleChange('receivesStateBenefits', e.target.value, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`stateBenefits-${person}`}
                value="No"
                checked={personData.receivesStateBenefits === 'No'}
                onChange={(e) => handleChange('receivesStateBenefits', e.target.value, person)}
              />
              No
            </label>
          </div>
        </div>

        {personData.receivesStateBenefits === 'Yes' && (
          <>
            <h5>State Benefits Details</h5>
            {[
              'childBenefit',
              'childTaxCredits',
              'workingTaxCredits',
              'disabilityLivingAllowance',
              'attendanceAllowance',
              'housingBenefit',
              'employmentSupportAllowance',
              'other',
            ].map((field, idx) => (
              <div key={idx} className="form-group">
                <label>
                  {field
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (str) => str.toUpperCase())}:
                </label>
                <input
                  type="number"
                  value={personData.stateBenefits?.[field] || 0}
                  onChange={(e) => handleStateBenefitsChange(field, e.target.value, person)}
                />
              </div>
            ))}
          </>
        )}
        <div className="form-group">
          <button 
            type="button" 
            className="calc-button"
            onClick={() => calculateTotalIncome(person)}
          >
            Calculate Total Income
          </button>
        </div>

        <div className="form-group">
          <label>Total of Other Monthly Income:</label>
          <input type="number" value={personData.totalOtherIncome} readOnly />
        </div>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/other-income-source`)}
      />

      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}  
      </div>

      <h3>Other Monthly Income Details</h3>

      {renderIncomeForm('applicant', 'Your Income')}

      {hasPartner && renderIncomeForm('partner', "Partner's Income")}

      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/other-income-source`)}
      />
    </form>
  );
};

export default OtherMonthlyInc;