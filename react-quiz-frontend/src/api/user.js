import axios from "axios";
import constants from "../constants";

// Contains all user APIs from backend for connection

export const signIn = async (username, password) => {
  const res = await axios({
    url: constants.API_ENDPOINT_BASE_URL + "/auth/login",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: {
      username,
      password
    }
  });
  
  return res;
};

export const signUp = async (username, password) => {
  const res = await axios({
    url: constants.API_ENDPOINT_BASE_URL + "/auth/register",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: {
      username,
      password
    }
  });
  return res;
};

export const getUser = async (id) => {
  const res = await axios({
    url: constants.API_ENDPOINT_BASE_URL + "/auth/login",
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    data: {
      id
    }
  });
  return res;
};
