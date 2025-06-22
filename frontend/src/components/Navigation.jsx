import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaCog, FaPlus } from 'react-icons/fa';
import axios from 'axios';
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

  const API_BASE_URL = "http://localhost:5000"; // Update this with your backend URL

  const createNewDocument = async() => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/documents`, 
        { title: 'Untitled Document', content: '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/editor/${response.data._id}`);
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };

  return (
    <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: '#F5F5F5' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          {/*<img 
            src={img} 
            alt="Docolab" 
            height="30" 
            className="me-2 size-[50px]" 
          />*/}
          <span className="text-[30px] font-bold" style={{ color: '#1E3A8A' }}>Docolab</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              style={{ color: '#1E3A8A', fontWeight: '500' }}
              className="hover:text-[#3B82F6] transition-colors"
            >
              Home
            </Nav.Link>
            {isLoggedIn && (
              <Nav.Link 
                as={Link} 
                to="/dashboard"
                style={{ color: '#1E3A8A', fontWeight: '500' }}
                className="hover:text-[#3B82F6] transition-colors"
              >
                Dashboard
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <>
                <Button 
                  className="me-3 d-flex align-items-center border-0 font-semibold shadow-sm" 
                  onClick={createNewDocument}
                  style={{ 
                    backgroundColor: '#3B82F6', 
                    color: 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#1E3A8A';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#3B82F6';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
                  }}
                >
                  <FaPlus className="me-1" /> New Document
                </Button>
                <Dropdown align="end">
                  <Dropdown.Toggle 
                    className="d-flex align-items-center border-0 shadow-sm" 
                    style={{ 
                      backgroundColor: 'white', 
                      color: '#1E3A8A',
                      fontWeight: '500',
                      border: '1px solid #E5E7EB'
                    }}
                  >
                    <div 
                      className="text-white rounded-circle d-flex justify-content-center align-items-center me-2" 
                      style={{ 
                        width: '30px', 
                        height: '30px',
                        backgroundColor: '#3B82F6'
                      }}
                    >
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <span>{username}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}>
                    <Dropdown.Item 
                      as={Link} 
                      to="/dashboard"
                      style={{ color: '#1E3A8A' }}
                      className="hover:bg-[#F5F5F5] transition-colors"
                    >
                      <FaCog className="me-2" /> My Documents
                    </Dropdown.Item>
                    <Dropdown.Divider style={{ borderColor: '#E5E7EB' }} />
                    <Dropdown.Item 
                      onClick={handleLogout}
                      style={{ color: '#1E3A8A' }}
                      className="hover:bg-[#F5F5F5] transition-colors"
                    >
                      <FaSignOutAlt className="me-2" /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button 
                  as={Link} 
                  to="/login" 
                  className="me-2 border-2 font-medium shadow-sm"
                  style={{ 
                    borderColor: '#1E3A8A', 
                    color: '#1E3A8A',
                    backgroundColor: 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#1E3A8A';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(30, 58, 138, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.color = '#1E3A8A';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
                  }}
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  className="font-medium border-0 shadow-sm"
                  style={{ 
                    backgroundColor: '#3B82F6', 
                    color: 'white',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#1E3A8A';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#3B82F6';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;