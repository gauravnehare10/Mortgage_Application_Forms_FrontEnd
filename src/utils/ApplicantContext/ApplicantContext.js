// Create a new file ApplicantContext.js
import { createContext, useContext, useState } from 'react';

const ApplicantContext = createContext();

export function ApplicantProvider({ children }) {
  const [applicantId, setApplicantId] = useState(null);
  
  return (
    <ApplicantContext.Provider value={{ applicantId, setApplicantId }}>
      {children}
    </ApplicantContext.Provider>
  );
}

export function useApplicant() {
  return useContext(ApplicantContext);
}