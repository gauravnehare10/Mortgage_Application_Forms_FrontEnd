// FormButtons.jsx
import React from 'react';

const FormButtons = ({ onBack, editData, onNext }) => {
  return (
    <div className="form-buttons">
      <div className="form-buttons-card">
        <button className="back-button" type="button" onClick={onBack}>
          Back
        </button>
      </div>
      <div className="form-buttons-card">
        <button className="form-submit" type="submit" onClick={editData}>
          Add / Edit
        </button>
        <button className="next-button" type="button" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default FormButtons;