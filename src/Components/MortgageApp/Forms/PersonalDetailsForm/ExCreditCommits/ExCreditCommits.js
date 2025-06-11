import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormStore from '../../../store';
import FormButtons from '../../../inc/FormButtons/FormButton'
import { validateCreditCommitments } from './ExCreditCommitsForm/Validations';

const initialCreditCommitment = {
  creditType: '',
  lenderName: '',
  amountOutstanding: '',
  monthlyRepayment: '',
  monthsOutstanding: '',
  consideringConsolidation: '',
  repayBeforeMortgage: '',
};

const ExCreditCommits = () => {
  const navigate = useNavigate();
  const [ errors, setErrors ] = useState([]);
  const errorRef = useRef();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const [hasPartner, setHasPartner] = useState(false);
  const { applicantId } = useParams();

  const [creditData, setCreditData] = useState({
    applicant: {
      hasExCreditCommit: '',
      creditCommitments: []
    },
    partner: {
      hasExCreditCommit: '',
      creditCommitments: []
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cleanedCreditData = {
      ...creditData,
      partner: hasPartner ? creditData.partner : null
    };
  
    const validationErrors = validateCreditCommitments(cleanedCreditData, hasPartner);
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
  
    updateFormData('creditCommitmentsData', cleanedCreditData, applicantId);
    navigate(`/mortgage/add-data/${applicantId}/existing-mortgage`)
  };

  const handleCreditCommitChange = (value, person = 'applicant') => {
    setCreditData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        hasExCreditCommit: value,
        creditCommitments: value === 'Yes' && prev[person].creditCommitments.length === 0 
          ? [{ ...initialCreditCommitment }] 
          : value === 'No' 
            ? [] 
            : prev[person].creditCommitments
      }
    }));
  };

  useEffect(() => {
    fetchFormData("mainDetails", applicantId);
    fetchFormData("creditCommitmentsData", applicantId);
  }, [fetchFormData, applicantId]);

  useEffect(() => {
    if (formData.mainDetails) {
      setHasPartner(formData.mainDetails.partners?.length > 0);
    }
    
    if (formData.creditCommitmentsData) {
      setCreditData({
        applicant: {
          hasExCreditCommit: formData.creditCommitmentsData.applicant?.hasExCreditCommit || "",
          creditCommitments: formData.creditCommitmentsData.applicant?.creditCommitments || []
        },
        partner: {
          hasExCreditCommit: formData.creditCommitmentsData.partner?.hasExCreditCommit || "",
          creditCommitments: formData.creditCommitmentsData.partner?.creditCommitments || []
        }
      });
    }
  }, [formData.creditCommitmentsData, formData.mainDetails]);

  const addCreditCommitment = (person = 'applicant') => {
    setCreditData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        creditCommitments: [
          ...prev[person].creditCommitments,
          { ...initialCreditCommitment }
        ]
      }
    }));
  };

  const deleteCreditCommitment = (index, person = 'applicant') => {
    setCreditData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        creditCommitments: prev[person].creditCommitments.filter((_, i) => i !== index)
      }
    }));
  };

  const handleCreditCommitmentChange = (index, field, value, person = 'applicant') => {
    setCreditData(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        creditCommitments: prev[person].creditCommitments.map((commitment, i) => {
          if (i === index) {
            if (field === 'consideringConsolidation' && value === 'Yes') {
              return {
                ...commitment,
                [field]: value,
                repayBeforeMortgage: 'No',
              };
            }
            return {
              ...commitment,
              [field]: value,
            };
          }
          return commitment;
        })
      }
    }));
  };

  const renderCreditCommitments = (person, title) => {
    const personData = creditData[person] || { hasExCreditCommit: '', creditCommitments: [] };
    
    return (
      <>
        <h4>{title}</h4>
        <div className="form-group">
          <label>Do you have any existing credit commitments?</label>
          <div>
            <label>
              <input
                type="radio"
                name={`hasExCreditCommit-${person}`}
                value="Yes"
                checked={personData.hasExCreditCommit === 'Yes'}
                onChange={(e) => handleCreditCommitChange(e.target.value, person)}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name={`hasExCreditCommit-${person}`}
                value="No"
                checked={personData.hasExCreditCommit === 'No'}
                onChange={(e) => handleCreditCommitChange(e.target.value, person)}
              />
              No
            </label>
          </div>
        </div>

        {personData.hasExCreditCommit === 'Yes' && (
          <>
            {personData.creditCommitments?.map((commitment, index) => (
              <div key={index} className="credit-commitment-card">
                <h4>Credit Commitment {index + 1}</h4>

                <div className="form-group">
                  <label>Type of Credit:</label>
                  <select
                    value={commitment.creditType}
                    onChange={(e) =>
                      handleCreditCommitmentChange(index, 'creditType', e.target.value, person)
                    }
                  >
                    <option value="">Select Type</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Car Loan">Car Loan</option>
                    <option value="Hire Purchase">Hire Purchase</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Name of Lender:</label>
                  <input
                    type="text"
                    value={commitment.lenderName}
                    onChange={(e) =>
                      handleCreditCommitmentChange(index, 'lenderName', e.target.value, person)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Amount Outstanding or Redemption/Settlement Figure:</label>
                  <input
                    type="number"
                    value={commitment.amountOutstanding}
                    onChange={(e) =>
                      handleCreditCommitmentChange(index, 'amountOutstanding', e.target.value, person)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Regular Monthly Repayment Amount:</label>
                  <input
                    type="number"
                    value={commitment.monthlyRepayment}
                    onChange={(e) =>
                      handleCreditCommitmentChange(index, 'monthlyRepayment', e.target.value, person)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Number of Months Outstanding or End Date (Fixed Term):</label>
                  <input
                    type="text"
                    value={commitment.monthsOutstanding}
                    onChange={(e) =>
                      handleCreditCommitmentChange(index, 'monthsOutstanding', e.target.value, person)
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Considering Consolidation:</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`consideringConsolidation-${person}-${index}`}
                        value="Yes"
                        checked={commitment.consideringConsolidation === 'Yes'}
                        onChange={(e) =>
                          handleCreditCommitmentChange(index, 'consideringConsolidation', e.target.value, person)
                        }
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`consideringConsolidation-${person}-${index}`}
                        value="No"
                        checked={commitment.consideringConsolidation === 'No'}
                        onChange={(e) =>
                          handleCreditCommitmentChange(index, 'consideringConsolidation', e.target.value, person)
                        }
                      />
                      No
                    </label>
                  </div>
                </div>
                {commitment.consideringConsolidation === "No" &&
                <div className="form-group">
                  <label>Are you looking to repay this liability prior to your new mortgage borrowing?</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name={`repayBeforeMortgage-${person}-${index}`}
                        value="Yes"
                        checked={commitment.repayBeforeMortgage === 'Yes'}
                        onChange={(e) =>
                          handleCreditCommitmentChange(index, 'repayBeforeMortgage', e.target.value, person)
                        }
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={`repayBeforeMortgage-${person}-${index}`}
                        value="No"
                        checked={commitment.repayBeforeMortgage === 'No'}
                        onChange={(e) =>
                          handleCreditCommitmentChange(index, 'repayBeforeMortgage', e.target.value, person)
                        }
                      />
                      No
                    </label>
                  </div>
                </div>
                }
                <div className="form-group">
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteCreditCommitment(index, person)}
                  >
                    Delete Credit Commitment
                  </button>
                </div>
              </div>
            ))}
            <div className="form-group">
              <button 
                type="button" 
                className="calc-button" 
                onClick={() => addCreditCommitment(person)}
              >
                Add Another Credit Commitment
              </button>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/existing-mortgage`)}
      />

      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>

      <h3>Liabilities - Credit Commitments</h3>

      {renderCreditCommitments('applicant', 'Your Credit Commitments')}

      {hasPartner && renderCreditCommitments('partner', "Partner's Credit Commitments")}

      <FormButtons
          onBack={() => navigate(-1)}
          onNext={()=>navigate(`/mortgage/add-data/${applicantId}/existing-mortgage`)}
      />
    </form>
  );
};

export default ExCreditCommits;