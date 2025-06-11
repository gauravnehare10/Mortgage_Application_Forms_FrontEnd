import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Card, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../../utils/authStore';

const API_URL = 'http://127.0.0.1:8000/mortgage/applicants';

const ApplicantDetails = () => {
  const [applicants, setApplicants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', mobile: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicants = async () => {
        try {
            const accessToken = useAuthStore.getState().getAccessToken();
            
            if (!accessToken) {
                console.error('No access token available');
                return;
            }

            const response = await axios.get(API_URL, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            setApplicants(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    fetchApplicants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const accessToken = useAuthStore.getState().getAccessToken();
        
        if (!accessToken) {
            console.error('No access token available');
            return;
        }

        const response = await axios.post(API_URL, formData, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const newApplicant = { ...formData, _id: response.data.id };
        setApplicants(prev => [...prev, newApplicant]);
        setFormData({ name: '', email: '', mobile: '' });
        setShowForm(false);
        navigate(`/mortgage/add-data/${response.data.id}/main-details/`);
    } catch (error) {
        console.error('Error saving applicant:', error);
    }
  };

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h2 className="mb-4 text-center">Applicants List</h2>
          <Card className="mb-4">
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile No</th>
                  </tr>
                </thead>
                <tbody>
                  {applicants.length > 0 ? (
                    applicants.map((applicant, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                            <a href='' onClick={(e) => {
                              e.preventDefault();
                              navigate(`/mortgage/${applicant._id}/main-details`);
                            }}>
                                {applicant._id}
                            </a>
                        </td>
                        <td>{applicant.name}</td>
                        <td>{applicant.email}</td>
                        <td>{applicant.mobile}</td>
                      </tr>
                    ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No applicants found</td>
                      </tr>
                    )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {showForm && (
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Add New Applicant</h5>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      required
                      onChange={handleChange}
                      placeholder="Enter name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      required
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mobile No.</Form.Label>
                    <Form.Control
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      required
                      pattern="[0-9]{10}"
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                    />
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100">Save Applicant</Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          <div className="text-center">
            <Button variant={showForm ? 'secondary' : 'primary'} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add Applicant'}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ApplicantDetails;
