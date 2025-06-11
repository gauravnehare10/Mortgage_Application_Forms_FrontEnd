import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from '../../../store';
import FormButtons from '../../../inc/FormButtons/FormButton'
import { validateTotalIncome } from './TotalIncomeForm/Validations';

const initialIncomeData = {
  annualGrossMainIncome: '',
  netProfitBeforeTax: '',
  annualOtherIncome: '',
  totalAnnualIncome: '',
  totalNetMonthlyIncome: '',
};

const TotalIncome = () => {
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef(null);
  const navigate = useNavigate();
  const [hasPartner, setHasPartner] = useState(false);
  const { applicantId } = useParams();

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

  useEffect(() => {
    fetchFormData("mainDetails", applicantId);
    fetchFormData("totalIncomeData", applicantId);
    fetchFormData("occupationData", applicantId);
  }, [fetchFormData, applicantId]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.totalIncomeData) {
      setIncomeData({
        applicant: {
          ...initialIncomeData,
          ...(formData.totalIncomeData.applicant || {})
        },
        partner: {
          ...initialIncomeData,
          ...(formData.totalIncomeData.partner || {})
        }
      });
    }
  }, [formData]);

  const calculateTotalIncome = (person = 'applicant') => {
    const personData = incomeData[person];
    const grossMainIncome = parseFloat(personData.annualGrossMainIncome) || 0;
    const otherIncome = parseFloat(personData.annualOtherIncome) || 0;
    const profitBeforeTax = parseFloat(personData.netProfitBeforeTax) || 0;

    const totalAnnualIncome = grossMainIncome + otherIncome + profitBeforeTax;
    
    const taxRate = 0.2;
    const totalTax = totalAnnualIncome * taxRate;
    const netAnnualIncome = totalAnnualIncome - totalTax;
    const netMonthlyIncome = netAnnualIncome / 12;

    handleChange('totalAnnualIncome', totalAnnualIncome.toFixed(2), person);
    handleChange('totalNetMonthlyIncome', netMonthlyIncome.toFixed(2), person);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanedIncomeData = {
      ...incomeData,
      partner: hasPartner ? incomeData.partner : null
    };
    const validationErrors = validateTotalIncome(cleanedIncomeData, hasPartner);
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
    updateFormData('totalIncomeData', cleanedIncomeData, applicantId);
    navigate(`/mortgage/add-data/${applicantId}/existing-credit-commits`)
  };

  const renderIncomeForm = (person, title) => {
    const personData = incomeData[person] || { ...initialIncomeData };
    
    return (
      <>
        <h4>{title}</h4>
        <div className="form-group">
          <label>Total Annual Gross Main Employed Income:</label>
          <input
            type="number"
            value={personData.annualGrossMainIncome}
            onChange={(e) => handleChange('annualGrossMainIncome', e.target.value, person)}
          />
        </div>

        <div className="form-group">
          <label>Net Profit before Tax</label>
          <input
            type="number"
            value={personData.netProfitBeforeTax}
            onChange={(e) => handleChange('netProfitBeforeTax', e.target.value, person)}
          />
        </div>

        <div className="form-group">
          <label>Total Annual Other Income (Including Non-Working):</label>
          <input
            type="number"
            value={personData.annualOtherIncome}
            onChange={(e) => handleChange('annualOtherIncome', e.target.value, person)}
          />
        </div>
        <div className="form-group">
          <button 
            className="calc-button" 
            type="button" 
            onClick={() => calculateTotalIncome(person)}
          >
            Calculate for {title}
          </button>
        </div>

        <div className="form-group">
          <label>Total Annual Income:</label>
          <input type="number" value={personData.totalAnnualIncome} readOnly />
        </div>

        <div className="form-group">
          <label>Total Net Monthly Income:</label>
          <input type="number" value={personData.totalNetMonthlyIncome} readOnly />
        </div>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/existing-credit-commits`)}
      />

        <div className="form-group">
          {Object.keys(errors).length > 0 && (
            <div ref={errorRef} className="error-message">
              {Object.values(errors).join(", ")}
            </div>
          )}
        </div>

      <h3>Total Income Details</h3>

      {renderIncomeForm('applicant', 'Your Income')}

      {hasPartner && renderIncomeForm('partner', "Partner's Income")}

      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/existing-credit-commits`)}
      />
    </form>
  );
};

export default TotalIncome;