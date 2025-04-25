import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLightbulb, FaLanguage, FaEdit, FaUsers, FaRobot } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="flex flex-col home-page w-[100%] bg-[white] overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-10 bg-[#abc4ff] text-black text-center">
        <Container fluid className="py-10 max-w-screen-xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6">Collaborate, Create, and Innovate</h1>
          <p className="text-lg mb-6">
            Enhance your document collaboration with AI-powered tools for summarizing,
            improving, and translating content in real-time.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              as={Link}
              to="/register"
              variant="light"
              size="lg"
              className="px-6 py-3 rounded-lg bg-white text-purple-600 shadow-md hover:bg-gray-100 hover:shadow-lg transition-all"
            >
              Get Started Free
            </Button>
            <Button
              as={Link}
              to="/login"
              variant="outline-light"
              size="lg"
              className="px-6 py-3 rounded-lg border border-white text-white hover:bg-white hover:text-purple-600 transition-all"
            >
              Sign In
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-10">
        <Container fluid className="max-w-screen-lg mx-auto">
          <h2 className="text-center mb-8 text-4xl font-extrabold text-gray-900">
            Features Designed for You
          </h2>
          <Row className="g-4">
            <Col md={4}>
              <div className='bg-[#E2EAFC] rounded-lg'>
                <Card className="h-100 bg-transparent text-center p-5 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-lg ">
                  <div className="mb-4">
                    <FaLightbulb size={40} />
                  </div>
                  <Card.Body>
                    <Card.Title className="text-xl font-semibold text-gray-900">
                      Smart Organization
                    </Card.Title>
                    <Card.Text className="text-gray-700">
                      Organize your documents with folders and quick access.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
            <Col md={4}>
              <div className='bg-[#E2EAFC] rounded-lg'>
                <Card className="h-100 text-center p-5 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-lg bg-transparent">
                  <div className="mb-4">
                    <FaEdit size={40} />
                  </div>
                  <Card.Body>
                    <Card.Title className="text-xl font-semibold text-gray-900">
                      Rich Text Editing
                    </Card.Title>
                    <Card.Text className="text-gray-700">
                      Format your documents with headings, lists, and more.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
            <Col md={4}>
              <div className='bg-[#E2EAFC] rounded-lg'>
                <Card className="h-100 text-center p-5 border-0 shadow-sm hover:shadow-lg transition-shadow rounded-lg bg-transparent">
                  <div className="mb-4">
                    <FaRobot size={40} />
                  </div>
                  <Card.Body>
                    <Card.Title className="text-xl font-semibold text-gray-900">
                      AI-Powered Assistance
                    </Card.Title>
                    <Card.Text className="text-gray-700">
                      Get smart suggestions as you write.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works */}
      <section className="py-10 bg-white">
        <Container fluid className="max-w-screen-xl mx-auto">
          <h2 className="text-center mb-8 text-4xl font-extrabold text-gray-900">How It Works</h2>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <img
                src="/editor-demo.png"
                alt="Editor Demo"
                className="img-fluid rounded shadow-lg"
              />
            </Col>
            <Col lg={6}>
              <div className="mb-6">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-purple-600 text-white rounded-circle p-3 me-3">
                    <FaUsers />
                  </div>
                  <h4 className="mb-0 text-xl font-semibold text-gray-900">Collaborate in Real-Time</h4>
                </div>
                <p className="text-gray-700">Work simultaneously with your team members on the same document.</p>
              </div>
              <div className="mb-6">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-purple-600 text-white rounded-circle p-3 me-3">
                    <FaRobot />
                  </div>
                  <h4 className="mb-0 text-xl font-semibold text-gray-900">AI-Powered Assistance</h4>
                </div>
                <p className="text-gray-700">Get intelligent suggestions, summaries, and translations as you work.</p>
              </div>
              <div>
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-purple-600 text-white rounded-circle p-3 me-3">
                    <FaEdit />
                  </div>
                  <h4 className="mb-0 text-xl font-semibold text-gray-900">Save and Export</h4>
                </div>
                <p className="text-gray-700">Your documents are automatically saved, and you can export in multiple formats.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-[#0402130d] text-white text-center">
        <Container fluid className="py-6 max-w-screen-lg mx-auto">
          <h2 className="mb-6 text-4xl text-[black] font-extrabold">Ready to transform your document workflow?</h2>
          <Button
            as={Link}
            to="/register"
            variant="light"
            size="lg"
            className="px-6 py-3 rounded-lg bg-white text-purple-600 shadow-md hover:bg-gray-100 hover:shadow-lg transition-all"
          >
            Start Creating Now
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default Home;