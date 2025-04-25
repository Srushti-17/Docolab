import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const getDocuments = async () => {
  const res = await axios.get(`${API_URL}/documents`);
  return res.data;
};

export const createDocument = async (title, content) => {
  const res = await axios.post(`${API_URL}/documents`, { title, content });
  return res.data;
};

export const getAIResponse = async (prompt) => {
  const res = await axios.post(`${API_URL}/ai`, { prompt });
  return res.data.output;
};
