import React from 'react';
import "./Mortgage.css";
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../utils/authStore';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';

export default function Mortgage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="home-wrapper bg-light py-5 w-100 min-vh-100">
      <Container fluid style={{ paddingTop: '60px' }}>
        <Row className="justify-content-center">
          <Col md={10} lg={10}>
            <Card className="shadow-lg rounded-4 border-0">
              <Card.Body className="p-5">
                <h2 className="text-center mb-4 text-primary fw-bold">Welcome to AAI Financials</h2>
                <div style={{ textAlign: 'justify' }}>
                  <p className="text-muted text-center fs-5">
                    Where we prioritize your financial journey with <strong>trust, transparency, and expertise</strong>.
                  </p>
                  <p>
                    As independent mortgage advisors, we have a holistic view of the mortgage market, giving us access
                    to a wide range of lenders and products. This allows us to tailor solutions that best fit your unique needs.
                  </p>
                  <p>
                    Whether you're buying your first home, remortgaging, or exploring investment opportunities,
                    we are here to secure the best deal for you. Our commitment is to guide you every step of the way,
                    making the process smooth and stress-free while ensuring you achieve your homeownership goals with confidence.
                  </p>
                  <p className="fw-semibold text-center">Let's build your future together.</p>
                </div>

                <div className="d-flex gap-3 mt-4 justify-content-center flex-wrap">
                  {/* <Button variant="primary" size="lg" onClick={() => navigate('/mortgage/add-data/main-details')}>
                    Add Mortgage Application
                  </Button> */}
        
                  <Button variant="outline-primary" size="lg" onClick={() => navigate('/applicant-details')}>
                    View Applications
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
