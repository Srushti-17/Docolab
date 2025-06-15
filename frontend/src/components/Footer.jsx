import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <h5 className="mb-0">Docolab</h5>
            <p className="text-muted small mb-0">Collaborative Document Editing with AI</p>
          </Col>
          <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
            <div className="d-flex justify-content-center justify-content-md-end">
              <a href="#" className="text-light mx-2">
                <FaGithub size={20} />
              </a>
              <a href="#" className="text-light mx-2">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-light mx-2">
                <FaLinkedin size={20} />
              </a>
            </div>
            <p className="text-muted mt-2 mb-0 small">© {new Date().getFullYear()} DocCollab. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;