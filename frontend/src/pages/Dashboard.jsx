import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import axios from 'axios';

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching documents with token:', token);
      const response = await axios.get('http://localhost:5000/api/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      // Ensure response.data is always an array
      if (Array.isArray(response.data)) {
        setDocuments(response.data);
        console.log('Documents fetched successfully:', response.data);
      } else {
        setDocuments([]);  // Set an empty array if response is unexpected
        console.warn('Unexpected response format:', response.data);
      }
  
      setError(null);
    } catch (err) {
      setError('Failed to fetch documents. Please try again later.');
      console.error('Error fetching documents:', err);
      setDocuments([]);  // Set empty array on error
    } finally {
      setLoading(false);
    }
  };  

  const handleCreateDocument = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/documents', 
        { title: 'Untitled Document', content: '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/editor/${response.data._id}`);
    } catch (err) {
      setError('Failed to create document. Please try again.');
      console.error('Error creating document:', err);
    }
  };

  const handleDeleteDocument = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/documents/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocuments(documents.filter(doc => doc._id !== id));
      } catch (err) {
        setError('Failed to delete document. Please try again.');
        console.error('Error deleting document:', err);
      }
    }
  };

  const filteredDocuments = documents
    .filter(doc => {
      if (filter === 'all') return true;
      if (filter === 'recent') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(doc.updatedAt) >= oneWeekAgo;
      }
      if (filter === 'shared') return doc.isShared;
      return true;
    })
    .filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="dashboard-container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">My Documents</h1>
        <Button 
          variant="primary" 
          size="lg" 
          className="create-doc-btn"
          onClick={handleCreateDocument}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Create New Document
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col lg={6} md={8} className="mb-3 mb-md-0">
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search your documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col lg={3} md={4}>
          <Form.Select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Documents</option>
            <option value="recent">Recent (7 days)</option>
            <option value="shared">Shared</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="empty-state text-center py-5">
          <i className="bi bi-file-earmark-text display-1 text-muted"></i>
          <h3 className="mt-3">No documents found</h3>
          <p className="text-muted mb-4">
            {searchTerm ? 'Try a different search term or clear your filters' : 'Create your first document to get started'}
          </p>
          {!searchTerm && (
            <Button variant="primary" onClick={handleCreateDocument}>
              Create Your First Document
            </Button>
          )}
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredDocuments.map(doc => (
            <Col key={doc._id}>
              <Card 
                className="document-card h-100 shadow-sm" 
                onClick={() => navigate(`/editor/${doc._id}`)}
              >
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <div className="document-icon-container">
                      <i className="bi bi-file-earmark-text text-primary fs-3"></i>
                    </div>
                    <div className="document-actions">
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="delete-btn"
                        onClick={(e) => handleDeleteDocument(doc._id, e)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </div>
                  </div>
                  <Card.Title className="mt-3 document-title">{doc.title || "Untitled Document"}</Card.Title>
                  {doc.summary && (
                    <Card.Text className="document-summary">
                      {doc.summary.length > 100 ? doc.summary.substring(0, 100) + '...' : doc.summary}
                    </Card.Text>
                  )}
                </Card.Body>
                <Card.Footer className="bg-transparent">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Last updated: {formatDate(doc.updatedAt)}
                    </small>
                    {doc.isShared && (
                      <span className="badge bg-info">
                        <i className="bi bi-people-fill me-1"></i> Shared
                      </span>
                    )}
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default Dashboard; 