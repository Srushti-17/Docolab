import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLightbulb, FaLanguage, FaEdit, FaUsers, FaRobot } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="flex flex-col home-page w-[100%] bg-[#F5F5F5] overflow-x-hidden">
      {/* Hero Section */}
      <section className="py-10 bg-[#1E3A8A] text-white text-center">
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
              className="px-6 py-3 rounded-lg bg-[#3B82F6] text-black shadow-md hover:bg-[#2563EB] hover:shadow-lg transition-all font-semibold border-0"
            >
              Get Started Free
            </Button>
            <Button
              as={Link}
              to="/login"
              variant="light"
              size="lg"
              className="px-6 py-3 rounded-lg bg-[#3B82F6] text-black shadow-md hover:bg-[#2563EB] hover:shadow-lg transition-all font-semibold border-0"
            >
              Sign In
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-10 bg-white">
        <Container fluid className="max-w-screen-lg mx-auto">
          <h2 className="text-center mb-8 text-4xl font-extrabold text-[#1E3A8A]">
            Features Designed for You
          </h2>
          <Row className="g-4">
            <Col md={4}>
              <div className='bg-[#3B82F6] rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1'>
                <Card className="h-100 bg-transparent text-center p-5 border-0 rounded-lg">
                  <div className="mb-4 text-white">
                    <FaLightbulb size={40} />
                  </div>
                  <Card.Body>
                    <Card.Title className="text-xl font-semibold text-white mb-3">
                      Smart Organization
                    </Card.Title>
                    <Card.Text className="text-[#F5F5F5]">
                      Organize your documents with folders and quick access.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
            <Col md={4}>
              <div className='bg-[#1E3A8A] rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1'>
                <Card className="h-100 text-center p-5 border-0 rounded-lg bg-transparent">
                  <div className="mb-4 text-white">
                    <FaEdit size={40} />
                  </div>
                  <Card.Body>
                    <Card.Title className="text-xl font-semibold text-white mb-3">
                      Rich Text Editing
                    </Card.Title>
                    <Card.Text className="text-[#F5F5F5]">
                      Format your documents with headings, lists, and more.
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </Col>
            <Col md={4}>
              <div className='bg-[#000000] rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1'>
                <Card className="h-100 text-center p-5 border-0 rounded-lg bg-transparent">
                  <div className="mb-4 text-white">
                    <FaRobot size={40} />
                  </div>
                  <Card.Body>
                    <Card.Title className="text-xl font-semibold text-white mb-3">
                      AI-Powered Assistance
                    </Card.Title>
                    <Card.Text className="text-[#F5F5F5]">
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
      <section className="py-10 bg-[#F5F5F5]">
        <Container fluid className="max-w-screen-xl mx-auto">
          <h2 className="text-center mb-8 text-4xl font-extrabold text-[#1E3A8A]">How It Works</h2>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <img
                  src="/editor-demo.png"
                  alt="Editor Demo"
                  className="img-fluid rounded"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-6">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-[#3B82F6] text-white rounded-circle p-3 me-3 shadow-md">
                    <FaUsers />
                  </div>
                  <h4 className="mb-0 text-xl font-semibold text-[#1E3A8A]">Collaborate in Real-Time</h4>
                </div>
                <p className="text-[#000000] opacity-80">Work simultaneously with your team members on the same document.</p>
              </div>
              <div className="mb-6">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-[#1E3A8A] text-white rounded-circle p-3 me-3 shadow-md">
                    <FaRobot />
                  </div>
                  <h4 className="mb-0 text-xl font-semibold text-[#1E3A8A]">AI-Powered Assistance</h4>
                </div>
                <p className="text-[#000000] opacity-80">Get intelligent suggestions, summaries, and translations as you work.</p>
              </div>
              <div>
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-[#000000] text-white rounded-circle p-3 me-3 shadow-md">
                    <FaEdit />
                  </div>
                  <h4 className="mb-0 text-xl font-semibold text-[#1E3A8A]">Save and Export</h4>
                </div>
                <p className="text-[#000000] opacity-80">Your documents are automatically saved, and you can export in multiple formats.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-gradient-to-r from-[#3B82F6] to-[#1E3A8A] text-white text-center">
        <Container fluid className="py-6 max-w-screen-lg mx-auto">
          <h2 className="mb-6 text-4xl text-white font-extrabold">Ready to transform your document workflow?</h2>
          <Button
            as={Link}
            to="/register"
            variant="light"
            size="lg"
            className="px-8 py-3 rounded-lg bg-white text-[#1E3A8A] shadow-lg hover:bg-[#F5F5F5] hover:shadow-xl transition-all font-semibold border-0 transform hover:scale-105"
          >
            Start Creating Now
          </Button>
        </Container>
      </section>
    </div>
  );
};

export default Home;