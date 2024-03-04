import axios from "axios";
import constants from "../constants";

// Contains all quiz APIs from backend for connection

export const getAllQuiz = async () => {
    const res = await axios({
      url: constants.API_ENDPOINT_BASE_URL + "/quiz",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        "auth-token": localStorage.getItem("token")
      },
    });
    return res.data;
};

export const getQuizById = async (id) => {
  const res = await axios({
    url: constants.API_ENDPOINT_BASE_URL + "/quiz/" + id,
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      "auth-token": localStorage.getItem("token")
    },
  });

  return res.data;
};

export const submitQuiz = async (quiz) => {
  const res = await axios({
    url: constants.API_ENDPOINT_BASE_URL + "/quiz/create",
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      "auth-token": localStorage.getItem("token")
    },
    data: {
      ...quiz
    },
  });
  if (res.status === 200) {
    window.alert("Quiz created successfully");
  }
  return res.data;
};

export const updateQuiz = async (id, quiz) => {
  const res = await axios({
    url: constants.API_ENDPOINT_BASE_URL + `/quiz/edit/${id}`,
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      "auth-token": localStorage.getItem("token")
    },
    data: {
      ...quiz
    },
  });
  if (res.status === 200) {
    window.alert("Quiz updated successfully");
  }
  return res.data;
};

export const deleteQuizById = async (id) => {
  const res = await axios({
    url: constants.API_ENDPOINT_BASE_URL + "/quiz/delete",
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      "auth-token": localStorage.getItem("token")
    },
    data: {
      id
    },
  });
  if (res.status === 200) {
    window.alert("Quiz deleted successfully");
  }
  return res.data;
};
