import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newDude) => {
  const request = axios.post(baseUrl, newDude);
  return request;
};

const deleteOne = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request;
};

const update = (id, newDude) => {
  const request = axios.put(`${baseUrl}/${id}`, newDude);
  return request.then((response) => response.data);
};

export default {
  getAll,
  create,
  deleteOne,
  update,
};
