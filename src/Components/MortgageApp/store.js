import { create } from 'zustand';
import useAuthStore from '../../utils/authStore';

const useFormStore = create((set, get) => ({
  formData: {},

  fetchFormData: async (formName, applicantId) => {
    try {
      const accessToken = useAuthStore.getState().getAccessToken();
      const response = await fetch(
        `https://mortgage-application-form-backend.onrender.com/mortgage/get-form-data/${formName}/${applicantId}`,
        {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch form data');
      }

      const result = await response.json();
      if (result) {
        set((state) => ({
          formData: {
            ...state.formData,
            [formName]: result,
          },
        }));
      }
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  },

  updateFormData: async (formName, data, applicantId) => {
    try {
      const accessToken = useAuthStore.getState().getAccessToken();
      const response = await fetch(
        'https://mortgage-application-form-backend.onrender.com/mortgage/save-form-data',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify({ 
            formName, 
            data, 
            applicantId 
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update form data');
      }

      const result = await response.json();
      console.log('Data saved to MongoDB:', result);
      
      set((state) => ({
        formData: {
          ...state.formData,
          [formName]: data,
        },
      }));
    } catch (error) {
      console.error('Error updating form data:', error);
    }
  },

  clearFormData: () => {
    set({ formData: {} });
  },
}));

export default useFormStore;