import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from '../../../store';
import FormButtons from '../../../inc/FormButtons/FormButton'
import { validateEstablishBudget } from './EstablishBudgetForm/Validations';

const initialBudgetData = {
  netDisposableIncome: '',
  monthlyMortgageAllocation: '',
};

const EstablishBudget = () => {
  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef(null);
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [hasPartner, setHasPartner] = useState(false);
  const { applicantId } = useParams();

  const [budgetData, setBudgetData] = useState({
    applicant: { ...initialBudgetData },
    partner: { ...initialBudgetData }
  });

  const handleChange = (e, person = 'applicant') => {
    const { name, value } = e.target;
    setBudgetData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [name]: value,
      }
    }));
  };

  useEffect(() => {
    fetchFormData("mainDetails", applicantId);
    fetchFormData("establishBudgetData", applicantId);
  }, [fetchFormData, applicantId]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.establishBudgetData) {
      setBudgetData({
        applicant: {
          ...initialBudgetData,
          ...(formData.establishBudgetData.applicant || {})
        },
        partner: {
          ...initialBudgetData,
          ...(formData.establishBudgetData.partner || {})
        }
      });
    }
  }, [formData.establishBudgetData, formData.mainDetails]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanedBudgetData = {
      ...budgetData,
      partner: hasPartner ? budgetData.partner : null
    };

    const validationErrors = validateEstablishBudget(cleanedBudgetData, hasPartner);
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
    updateFormData('establishBudgetData', cleanedBudgetData, applicantId);
    navigate(`/mortgage/add-data/${applicantId}/mortgage-details`)
  };

  const renderBudgetForm = (person, title) => {
    const personData = budgetData[person] || { ...initialBudgetData };
    
    return (
      <>
        <h4>{title}</h4>
        
        {/* NET Disposable Income */}
        <div className="form-group">
          <label>Available NET Disposable Income</label>
          <input
            type="number"
            name="netDisposableIncome"
            value={personData.netDisposableIncome}
            onChange={(e) => handleChange(e, person)}
          />
        </div>

        {/* Monthly Mortgage Allocation */}
        <div className="form-group">
          <label>How much do you believe you can allocate towards your monthly mortgage payments?</label>
          <input
            type="number"
            name="monthlyMortgageAllocation"
            value={personData.monthlyMortgageAllocation}
            onChange={(e) => handleChange(e, person)}
          />
        </div>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/mortgage-details`)}
      />

      <div className="form-group">
          {Object.keys(errors).length > 0 && (
            <div ref={errorRef} className="error-message">
              {Object.values(errors).join(", ")}
            </div>
          )}
        </div>

      <h3>Establishing a Budget</h3>

      {renderBudgetForm('applicant', 'Your Budget')}

      {hasPartner && renderBudgetForm('partner', "Partner's Budget")}

      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/mortgage-details`)}
      />
    </form>
  );
};

export default EstablishBudget;