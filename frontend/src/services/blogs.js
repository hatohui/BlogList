import axios from "axios";

const baseUrl = "http://localhost:3001/api/blogs";
let token = null;

const setToken = (newToken) => {
  token = newToken;
};

//fetch all data
const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

//find with Id
const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`);
  return response.data;
};

//remove
const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

//create new
const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

//update
const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const request = await axios.put(`${baseUrl}/${id}`, newObject, config);
  return request.data;
};

export default { getAll, create, update, remove, getById, setToken };
