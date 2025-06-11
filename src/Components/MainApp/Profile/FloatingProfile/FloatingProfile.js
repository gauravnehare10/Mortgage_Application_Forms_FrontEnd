import React, { useEffect, useState } from 'react';
import './FloatingProfile.css';
import axios from 'axios';
import useAuthStore from '../../../../utils/authStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';

const FloatingProfile = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const { getAccessToken } = useAuthStore();

  useEffect(() => {
    const access_token = getAccessToken();
    axios
      .get('https://mortgage-application-form-backend.onrender.com/user/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((response) => setUser(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="floating-card shadow rounded">
      <div className="card-body position-relative">
        <button className="btn-close position-absolute top-0 end-0 mt-2 me-2" onClick={onClose}></button>
        <div className="text-center mb-3">
          <FontAwesomeIcon icon={faUserAlt} size="2x" className="mb-2 text-primary" />
          <h5 className="mb-0">{user?.username}</h5>
          <small className="text-muted">{user?.name}</small>
        </div>
        <hr />
        <div className="text-start">
          <p className="mb-2">
            <FontAwesomeIcon icon={faEnvelope} className="me-2 text-secondary" />
            <span>{user?.email}</span>
          </p>
          <p className="mb-0">
            <FontAwesomeIcon icon={faPhone} className="me-2 text-secondary" />
            <span>{user?.contactnumber}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FloatingProfile;
