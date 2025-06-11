import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from '../../../store';
import FormButtons from '../../../inc/FormButtons/FormButton'
import { validateMonthlyExpenditure } from './MonthlyExpendForm/Validations';

const initialExpenditure = {
  mortgage: '',
  rentBoard: '',
  childCare: '',
  schoolFees: '',
  councilTax: '',
  water: '',
  electricity: '',
  gas: '',
  homePhone: '',
  mobilePhone: '',
  tvLicence: '',
  loans: '',
  creditCards: '',
  hirePurchase: '',
  bankFees: '',
  protectionPolicies: '',
  carInsurance: '',
  buildingInsurance: '',
  petInsurance: '',
  otherInsurance: '',
  food: '',
  cigarettes: '',
  alcohol: '',
  clothes: '',
  householdMaintenance: '',
  travelCosts: '',
  commuting: '',
  savingsPlans: '',
  pensionPlans: '',
  entertainment: '',
  holidays: '',
  membershipFees: '',
  otherItems: '',
  totalExpenditure: ''
};

export const expenditureCategories = {
  committedExpend: [
    { label: 'Mortgage', key: 'mortgage' },
    { label: 'Rent/Board', key: 'rentBoard' },
    { label: 'Child Care/Maintenance Payments', key: 'childCare' },
    { label: 'School Fees/Education Costs', key: 'schoolFees' },
  ],
  utilities: [
    { label: 'Council Tax', key: 'councilTax' },
    { label: 'Water', key: 'water' },
    { label: 'Electricity', key: 'electricity' },
    { label: 'Gas', key: 'gas' },
    { label: 'Home Phone/Broadband', key: 'homePhone' },
    { label: 'Mobile Phone', key: 'mobilePhone' },
    { label: 'TV Licence', key: 'tvLicence'}
  ],
  creditCommits: [
    { label: "Loans", key: 'loans'}, 
    { label: "Credit Cards/Store Cards", key: 'creditCards'},
    { label: "Hire Purchase/Lease/Car Finance", key: 'hirePurchase'},
    { label: "Bank Changes/Monthly Fees", key: 'bankFees'}
  ],
  insurances: [
    { label: 'Existing Protection Policies (Life, CIC, income Protection, ASU, Endowments)', key: 'protectionPolicies'},
    { label: 'Car insurance', key: 'carInsurance'}, 
    { label: 'Building only/Buildings & Contents insurance', key: 'buildingInsurance'}, 
    { label: 'Pet insurance', key: 'petInsurance'}, 
    { label: 'Other Insurance Contracts mobile phone/boiler cover/specialist i.e. jeweliery/bikes', key: 'otherInsurance'}
  ],
  genLivingCosts: [
    { label: "Food & Non-alcoholic Drinks", key: 'food',}, 
    { label: "Cigarettes", key: 'cigarettes',}, 
    { label: "Alcohol", key: 'alcohol',}, 
    { label: "Cloths", key: 'clothes',}, 
    { label: "General Household Maintenance i.e. window cleaner, cleaner, gardner", key: 'householdMaintenance',}, 
    { label: "Travel Costs e.g. Petrol", key: 'travelCosts',}, 
    { label: "Commuting", key: 'commuting',},
  ],
  savingInvest: [
    {label: "Savings Plans", key: 'savingsPlans'}, 
    {label: "Pension Plans", key: 'pensionPlans'}
  ],
  nonCommitExpend: [
    { label: 'Entertainment/Social', key: 'entertainment'}, 
    { label: 'Holidays', key: 'holidays'}, 
    { label: 'Professional Membership Fees/Subsciptions', key: 'membershipFees'}, 
    { label: 'Other Items', key: 'otherItems'}
  ]
};

const MonthlyExpenditure = () => {
  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef();
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [hasPartner, setHasPartner] = useState(false);
  const { applicantId } = useParams();

  const [expenditureData, setExpenditureData] = useState({
    applicant: { ...initialExpenditure },
    partner: { ...initialExpenditure }
  });

  const handleChange = (field, value, person = 'applicant') => {
    setExpenditureData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [field]: value
      }
    }));
  };

  useEffect(() => {
    fetchFormData("mainDetails", applicantId);
    fetchFormData("expenditureData", applicantId);
  }, [fetchFormData, applicantId]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.expenditureData) {
      setExpenditureData({
        applicant: {
          ...initialExpenditure,
          ...(formData.expenditureData.applicant || {})
        },
        partner: {
          ...initialExpenditure,
          ...(formData.expenditureData.partner || {})
        }
      });
    }
  }, [formData.expenditureData, formData.mainDetails]);

  const calculateTotal = (person = 'applicant') => {
    const { totalExpenditure, ...fields } = expenditureData[person];
    const total = Object.values(fields).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    handleChange('totalExpenditure', total.toFixed(2), person);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanedExpenditureData = {
      ...expenditureData,
      partner: hasPartner ? expenditureData.partner : null
    };
  
    const validationErrors = validateMonthlyExpenditure(cleanedExpenditureData, hasPartner);
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
    updateFormData('expenditureData', cleanedExpenditureData, applicantId);
    navigate(`/mortgage/add-data/${applicantId}/emergency-fund`)
  };

  const renderExpenditureForm = (person, title) => {
    const personData = expenditureData[person] || { ...initialExpenditure };
    
    return (
      <>
        <h4>{title}</h4>
        
        <h4>Committed Expenditure</h4>
        {expenditureCategories.committedExpend.map(({ label, key }) => (
          <div className="form-group" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              value={personData[key]}
              onChange={(e) => handleChange(key, e.target.value, person)}
            />
          </div>
        ))}

        <h4>Utilities</h4>
        {expenditureCategories.utilities.map(({ label, key }) => (
          <div className="form-group" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              value={personData[key]}
              onChange={(e) => handleChange(key, e.target.value, person)}
            />
          </div>
        ))}

        <h4>Credit Commitments</h4>
        {expenditureCategories.creditCommits.map(({ label, key }) => (
          <div className="form-group" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              value={personData[key]}
              onChange={(e) => handleChange(key, e.target.value, person)}
            />
          </div>
        ))}

        <h4>Insurances</h4>
        {expenditureCategories.insurances.map(({ label, key }) => (
          <div className="form-group" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              value={personData[key]}
              onChange={(e) => handleChange(key, e.target.value, person)}
            />
          </div>
        ))}

        <h4>General Living Costs</h4>
        {expenditureCategories.genLivingCosts.map(({label, key}) => (
          <div className="form-group" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              value={personData[key]}
              onChange={(e) => handleChange(key, e.target.value, person)}
            />
          </div>
        ))}

        <h4>Savings and Investments</h4>
        {expenditureCategories.savingInvest.map(({label, key}) => (
          <div className="form-group" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              value={personData[key]}
              onChange={(e) => handleChange(key, e.target.value, person)}
            />
          </div>
        ))}

        <h4>Non-Committed Expenditure</h4>
        {expenditureCategories.nonCommitExpend.map(({label, key}) => (
          <div className="form-group" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              value={personData[key]}
              onChange={(e) => handleChange(key, e.target.value, person)}
            />
          </div>
        ))}

        <div className="form-group">
          <label>Total Monthly Expenditure:</label>
          <input type="number" value={personData.totalExpenditure} readOnly />
        </div>
        <div className="form-group">
          <button 
            className="calc-button" 
            type="button" 
            onClick={() => calculateTotal(person)}
          >
            Calculate for {title}
          </button>
        </div>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/emergency-fund`)}
      />

      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>

      <h3>Monthly Expenditure Details</h3>

      {renderExpenditureForm('applicant', 'Your Expenditure')}

      {hasPartner && renderExpenditureForm('partner', "Partner's Expenditure")}

      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/emergency-fund`)}
      />
    </form>
  );
};

export default MonthlyExpenditure;