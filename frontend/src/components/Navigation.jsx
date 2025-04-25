import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog, FaPlus } from 'react-icons/fa';
import img from "../assets/logo.png";
import img1 from "../assets/logo1.png";

const Navigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Get username from token or local storage
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    navigate('/');
  };

  const createNewDocument = () => {
    navigate('/editor');
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img 
            src={img} 
            alt="Docolab" 
            height="30" 
            className="me-2 size-[50px]" 
          />
          <span className="fw-bold text-primary">Docolab</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isLoggedIn && (
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            )}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <>
                <Button 
                  variant="success" 
                  className="me-3 d-flex align-items-center" 
                  onClick={createNewDocument}
                >
                  <FaPlus className="me-1" /> New Document
                </Button>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" id="dropdown-basic" className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-1" style={{ width: '30px', height: '30px' }}>
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <span>{username}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      <FaUser className="me-2" /> Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/dashboard">
                      <FaCog className="me-2" /> My Documents
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" className="me-2">Login</Button>
                <Button as={Link} to="/register" variant="primary">Sign Up</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;