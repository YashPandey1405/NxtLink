import axios from "axios";

const API_URL = "/api";

const UrlService = {
  Login: async (email, username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to login");
    }
  },

  SignUp: async (email, fullname, username, password) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        fullname,
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to signup");
    }
  },

  Logout: async () => {
    try {
      const response = await axios.post(`${API_URL}/logout`, null, {
        withCredentials: true, // Ensures cookies (like JWT) are sent
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to login");
    }
  },

  createUrl: async (originalUrl, description, typeURL) => {
    try {
      const response = await axios.post(
        `${API_URL}/urls`,
        {
          originalUrl,
          description,
          typeURL,
        },
        {
          withCredentials: true, // Ensures cookies (like JWT) are sent
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to Get URLs");
    }
  },

  getAllUrls: async () => {
    try {
      const response = await axios.get(`${API_URL}/urls`, {
        withCredentials: true, // Ensures cookies (like JWT) are sent
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to Get URLs");
    }
  },

  checkLogin: async () => {
    try {
      const response = await axios.get(`${API_URL}/check`, {
        withCredentials: true, // Ensures cookies (like JWT) are sent
      });

      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to Check User Login",
      );
    }
  },

  getTodoById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch todo");
    }
  },

  createTodo: async (todo) => {
    try {
      const response = await axios.post(API_URL, todo);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to create todo");
    }
  },

  updateTodo: async (id, updates) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updates);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to update todo");
    }
  },

  deleteTodo: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to delete todo");
    }
  },

  toggleRecorded: async (id, isRecorded) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { isRecorded });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to toggle recorded status",
      );
    }
  },
};

export default UrlService;
