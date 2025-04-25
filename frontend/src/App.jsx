import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="app-container d-flex flex-column min-vh-100">
        <Navigation />
        <Container fluid className="flex-grow-1 main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/editor/:id" element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            } />
            <Route path="/editor" element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            } />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
}

export default App;