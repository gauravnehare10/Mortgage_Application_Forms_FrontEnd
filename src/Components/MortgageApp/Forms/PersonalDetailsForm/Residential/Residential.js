import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import useFormStore from '../../../store';
import FormButtons from '../../../inc/FormButtons/FormButton'
import ResidenceForm from './ResidentialForm/ResidentialForm';
import { validateResidentialDetails } from './ResidentialForm/Validations';

const Residential = () => {
  const [errors, setErrors] = useState({});
  const errorRef = useRef(null);
  const navigate = useNavigate();
  const { formData, fetchFormData, updateFormData } = useFormStore();
  const { applicantId } = useParams();

  // Initialize residential data structure with proper fallbacks
  const [residentialData, setResidentialData] = useState(() => ({
    client: formData?.residentialData?.client || [
      { address: ['', '', '', '', ''], status: '', dateMovedIn: '', postcode: '' }
    ],
    partner: formData?.residentialData?.partner || [
      { address: ['', '', '', '', ''], status: '', dateMovedIn: '', postcode: '' }
    ]
  }));

  // Check if partner has any residential data
  const hasPartnerResidentialData = residentialData.partner?.some(residence => {
    return (
      residence.address.some(addr => addr.trim() !== '') ||
      residence.status.trim() !== '' ||
      residence.dateMovedIn.trim() !== '' ||
      residence.postcode.trim() !== ''
    );
  });

  // Check if partner exists in main details
  const hasPartnerInMainDetails = formData?.mainDetails?.partners?.length > 0;

  // Final hasPartner value considering both main details and residential data
  const hasPartner = hasPartnerInMainDetails && hasPartnerResidentialData;

  const isLessThanThreeYearsAgo = (date) => {
    if (!date) return false;
    const movedInDate = new Date(date);
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    return movedInDate >= threeYearsAgo;
  };

  // Handle changes for either client or partner
  const handleChange = (type, index, field, value) => {
    setResidentialData(prev => {
      const updatedTypeData = [...(prev[type] || [])];
      updatedTypeData[index] = {
        ...updatedTypeData[index],
        [field]: value
      };
      
      // Auto-add new entry if needed
      if (field === 'dateMovedIn') {
        if (isLessThanThreeYearsAgo(value) && index === updatedTypeData.length - 1) {
          updatedTypeData.push({ address: ['', '', '', '', ''], status: '', dateMovedIn: '', postcode: '' });
        } else if (!isLessThanThreeYearsAgo(value) && updatedTypeData.length > 1) {
          return { ...prev, [type]: updatedTypeData.slice(0, index + 1) };
        }
      }
      
      return { ...prev, [type]: updatedTypeData };
    });
  };

  useEffect(() => {
    fetchFormData("residentialData", applicantId);
    fetchFormData("mainDetails", applicantId);
  }, [fetchFormData, applicantId]);
  
  useEffect(() => {
    if (formData?.residentialData) {
      // Check if partner data exists and has any values
      const partnerData = formData.residentialData.partner || [];
      const hasStoredPartnerData = partnerData.some(residence => {
        return (
          residence.address.some(addr => addr.trim() !== '') ||
          residence.status.trim() !== '' ||
          residence.dateMovedIn.trim() !== '' ||
          residence.postcode.trim() !== ''
        );
      });

      setResidentialData({
        client: formData.residentialData.client || [
          { address: ['', '', '', '', ''], status: '', dateMovedIn: '', postcode: '' }
        ],
        partner: hasStoredPartnerData ? partnerData : []
      });
    }
  }, [formData]);

  // Find address for either client or partner
  const findAddress = async (type, index) => {
    const postcode = residentialData[type]?.[index]?.postcode?.trim();
    if (!postcode) {
      alert('Please enter a postcode.');
      return;
    }

    try {
      const response = await axios.get(`https://api.postcodes.io/postcodes/${postcode}`);
      const { admin_district, admin_ward } = response.data.result || {};
      const updatedAddress = ['', admin_district || '', '', admin_ward || '', 'United Kingdom'];
      
      setResidentialData(prev => {
        const updatedTypeData = [...(prev[type] || [])];
        updatedTypeData[index] = {
          ...updatedTypeData[index],
          address: updatedAddress
        };
        return { ...prev, [type]: updatedTypeData };
      });
    } catch (error) {
      alert('Error fetching address. Please check the postcode and try again.');
      console.error('Address lookup error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up partner data if no residential details are provided
    const cleanedResidentialData = {
      client: residentialData.client,
      partner: hasPartnerResidentialData ? residentialData.partner : []
    };

    const validationErrors = validateResidentialDetails(cleanedResidentialData, hasPartner);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      setTimeout(() => {
        const firstError = document.querySelector('.error-message');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      return;
    }

    updateFormData("residentialData", cleanedResidentialData, applicantId);
    navigate(`/mortgage/add-data/${applicantId}/occupation`)
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <FormButtons
        onBack={() => navigate(-1)}
        onNext={()=>navigate(`/mortgage/add-data/${applicantId}/occupation`)}
      />

      {/* Main Client Section */}
      <h3>Client 1 Residential Details</h3>
      <div className="form-group">
        {Object.keys(errors).length > 0 && (
          <div ref={errorRef} className="error-message">
            {Object.values(errors).join(", ")}
          </div>
        )}
      </div>
      {(residentialData.client || []).map((residence, index) => (
        <ResidenceForm
          key={`client-${index}`}
          residence={residence}
          index={index}
          handleChange={(index, field, value) => handleChange('client', index, field, value)}
          findAddress={() => findAddress('client', index)}
        />
      ))}

      {/* Partner Section (conditionally rendered) */}
      {hasPartnerInMainDetails && (
        <>
          <h3>Client 2 Residential Details</h3>
          {(residentialData.partner || []).map((residence, index) => (
            <ResidenceForm
              key={`partner-${index}`}
              residence={residence}
              index={index}
              handleChange={(index, field, value) => handleChange('partner', index, field, value)}
              findAddress={() => findAddress('partner', index)}
            />
          ))}
        </>
      )}

      <FormButtons
        onBack={() => navigate(-1)}
        onNext={()=>navigate(`/mortgage/add-data/${applicantId}/occupation`)}
      />
    </form>
  );
};

export default Residential;