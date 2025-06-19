import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, Row, Col, Form, Button, Spinner, 
  Offcanvas, Tabs, Tab, Dropdown, Alert, Modal
} from 'react-bootstrap';
import axios from 'axios';

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState({
    title: 'Untitled Document',
    content: '',
    _id: id || 'new'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [aiSidebar, setAiSidebar] = useState(false);
  const [activeAiTab, setActiveAiTab] = useState('summarize');
  const [selectedText, setSelectedText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [autoSave, setAutoSave] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState('Hindi');
  
  const editorRef = useRef(null);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    if (id && id !== 'new') {
      fetchDocument();
    } else {
      setLoading(false);
    }

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [id]);

  const API_BASE_URL = "http://localhost:5000"; // Update this with your backend URL

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocument(response.data);
      console.log(response.data)
      setError(null);
    } catch (err) {
      setError('Failed to load document. Please try again.');
      console.error('Error fetching document:', err);
    } finally {
      setLoading(false);
    }
  };

  
  const saveDocument = async () => {
    try {
        setSaving(true);
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token is missing. Please log in again.');
            setError('Authentication error. Please log in again.');
            return;
        }

        const url = document._id === 'new'
            ? `${API_BASE_URL}/api/documents`
            : `${API_BASE_URL}/api/documents/${document._id}`;

        const method = document._id === 'new' ? 'post' : 'put';

        const response = await axios[method](url, document, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setDocument(prev => ({ ...prev, _id: response.data._id }));
        setError(null);
    } catch (err) {
        setError('Failed to save document. Please try again.');
        console.error('Error saving document:', err.response || err);
    } finally {
        setSaving(false);
    }
  };


  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setDocument({ ...document, content: newContent });
    
    if (autoSave) {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
      
      saveTimerRef.current = setTimeout(() => {
        saveDocument();
      }, 2000);
    }
  };

  const handleTitleChange = (e) => {
    setDocument({ ...document, title: e.target.value });
  };

  const handleTextSelection = () => {
    if (editorRef.current) {
      const selectedText = editorRef.current.value.substring(
        editorRef.current.selectionStart,
        editorRef.current.selectionEnd
      );
      
      if (selectedText) {
        setSelectedText(selectedText);
      }
    }
  };

  const processAiRequest = async (action) => {
    if (!selectedText && action !== 'improve-full') {
      setAiResponse('Please select text first to use this feature.');
      return;
    }
    
    try {
      setAiLoading(true);
      const token = localStorage.getItem('token');
      const textToProcess = action === 'improve-full' ? document.content : selectedText;
      
      const response = await axios.post(`${API_BASE_URL}/api/ai/process`, {
        text: textToProcess,
        action: action,
        targetLanguage: action === 'translate' ? targetLanguage : undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setAiResponse(response.data.result);
    } catch (err) {
      setAiResponse('An error occurred while processing your request. Please try again.');
      console.error('Error processing AI request:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiSuggestion = () => {
    if (!aiResponse) return;
    
    const textArea = editorRef.current;
    if (!textArea) return;
    
    if (selectedText) {
      const start = textArea.selectionStart;
      const end = textArea.selectionEnd;
      
      const newContent = 
        document.content.substring(0, start) + 
        aiResponse + 
        document.content.substring(end);
      
      setDocument({ ...document, content: newContent });
    } else {
      setDocument({ ...document, content: aiResponse });
    }
    
    setAiSidebar(false);
  };

  const handleShareDocument = async () => {
    if (!shareEmail) return;

    console.log('Document ID:', document._id); // Add this line
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/documents/${document._id}/collaborators`, {
        email: shareEmail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowShareModal(false);
      setShareEmail('');
      alert('Document shared successfully');
    } catch (err) {
      console.error('Error sharing document:', err);
      alert('Failed to share document. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading document...</p>
      </div>
    );
  }

  return (
    <Container fluid className="editor-container py-3">
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      <div className="editor-header mb-3">
        <Row className="align-items-center">
          <Col>
            <Form.Control
              type="text"
              value={document.title}
              onChange={handleTitleChange}
              placeholder="Document Title"
              className="document-title-input"
              onBlur={saveDocument}
            />
          </Col>
          <Col xs="auto" className="d-flex gap-2">
            <Button 
              variant={autoSave ? "success" : "outline-secondary"}
              size="sm"
              onClick={() => setAutoSave(!autoSave)}
              title={autoSave ? "Auto-save enabled" : "Auto-save disabled"}
            >
              <i className={`bi bi-cloud-${autoSave ? 'check' : 'slash'}`}></i> {autoSave ? 'Auto-saving' : 'Auto-save off'}
            </Button>
            
            <Button 
              variant="primary" 
              onClick={saveDocument} 
              disabled={saving}
              title="Save document"
            >
              Save
            </Button>
            
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="document-actions">
                <i className="bi bi-three-dots-vertical"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShowShareModal(true)}>
                  <i className="bi bi-share me-2"></i> Share Document
                </Dropdown.Item>
                <Dropdown.Item onClick={() => window.print()}>
                  <i className="bi bi-printer me-2"></i> Print Document
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate('/dashboard')}>
                  <i className="bi bi-arrow-left me-2"></i> Back to Dashboard
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>
      
      <Row>
        <Col>
          <div className="editor-main">
            <div className="toolbar mb-2">
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => {
                  setAiSidebar(true);
                  setActiveAiTab('summarize');
                }}
                className="me-2"
                title="Summarize selected text"
              >
                <i className="bi bi-file-text me-1"></i> Summarize
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => {
                  setAiSidebar(true);
                  setActiveAiTab('improve');
                }}
                className="me-2"
                title="Improve selected text"
              >
                <i className="bi bi-magic me-1"></i> Improve Writing
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => {
                  setAiSidebar(true);
                  setActiveAiTab('define');
                }}
                className="me-2"
                title="Define selected text"
              >
                <i className="bi bi-book me-1"></i> Define 
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => {
                  setAiSidebar(true);
                  setActiveAiTab('translate');
                }}
                title="Translate selected text"
              >
                <i className="bi bi-translate me-1"></i> Translate
              </Button>
            </div>
            
            <Form.Control
              as="textarea"
              ref={editorRef}
              value={document.content}
              onChange={handleContentChange}
              onMouseUp={handleTextSelection}
              onKeyUp={handleTextSelection}
              className="document-editor"
              placeholder="Start typing your document here..."
              rows={20}
            />
          </div>
        </Col>
      </Row>

      {/* AI Assistant Sidebar */}
      <Offcanvas 
        show={aiSidebar} 
        onHide={() => setAiSidebar(false)} 
        placement="end"
        className="ai-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className="text-primary me-2"></i>
            AI Assistant
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Tabs
            activeKey={activeAiTab}
            onSelect={(k) => setActiveAiTab(k)}
            className="mb-3"
          >
            <Tab eventKey="summarize" title="Summarize">
              <p>Summarize your selected text into a concise version.</p>
              <Button 
                variant="primary" 
                onClick={() => processAiRequest('summarize')} 
                disabled={aiLoading}
                className="w-100 mb-3"
              >
                {aiLoading ? <Spinner size="sm" animation="border" /> : 'Summarize Text'}
              </Button>
            </Tab>
            
            <Tab eventKey="improve" title="Improve">
              <p>Improve the grammar, clarity, and style of your text.</p>
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  onClick={() => processAiRequest('improve')} 
                  disabled={aiLoading}
                >
                  {aiLoading ? <Spinner size="sm" animation="border" /> : 'Improve Selected Text'}
                </Button>
                <Button 
                  variant="outline-primary" 
                  onClick={() => processAiRequest('improve-full')} 
                  disabled={aiLoading}
                >
                  {aiLoading ? <Spinner size="sm" animation="border" /> : 'Improve Entire Document'}
                </Button>
              </div>
            </Tab>
            
            <Tab eventKey="define" title="Define">
              <p>Get definitions and explanations for selected words or phrases.</p>
              <Button 
                variant="primary" 
                onClick={() => processAiRequest('define')} 
                disabled={aiLoading}
                className="w-100 mb-3"
              >
                {aiLoading ? <Spinner size="sm" animation="border" /> : 'Define Term'}
              </Button>
            </Tab>
            
            <Tab eventKey="translate" title="Translate">
              <p>Translate your selected text to another language.</p>
              <Form.Group className="mb-3">
                <Form.Select 
                  className="mb-2" 
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value)}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                </Form.Select>
              </Form.Group>
              <Button 
                variant="primary" 
                onClick={() => processAiRequest('translate')} 
                disabled={aiLoading}
                className="w-100 mb-3"
              >
                {aiLoading ? <Spinner size="sm" animation="border" /> : 'Translate Text'}
              </Button>
            </Tab>
          </Tabs>

          {aiLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Thinking...</p>
            </div>
          ) : aiResponse ? (
            <div className="ai-response">
              <div className="ai-response-header">
                <h6>AI Response:</h6>
                <Button 
                  variant="success" 
                  size="sm" 
                  onClick={handleApplyAiSuggestion}
                >
                  <i className="bi bi-check-lg me-1"></i> Apply
                </Button>
              </div>
              <div className="ai-response-content">
                {aiResponse}
              </div>
            </div>
          ) : (
            <div className="ai-empty-state">
              <i className="bi bi-lightbulb display-4 text-warning"></i>
              <p className="mt-3">
                {selectedText 
                  ? "Select an action above to process your selected text." 
                  : "Select some text in your document to use the AI features."}
              </p>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Share Modal */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Share Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Enter email address to share with:</Form.Label>
            <Form.Control
              type="email"
              placeholder="colleague@example.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowShareModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleShareDocument}>
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Editor;