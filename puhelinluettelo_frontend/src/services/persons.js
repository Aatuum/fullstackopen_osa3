import axios from 'axios';
const baseUrl = '/api/persons';

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => {
    return response.data;
  });
};

const create = (newDude) => {
  const request = axios.post(baseUrl, newDude);
  return request.then((response) => response.data);
};

const deleteOne = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
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
