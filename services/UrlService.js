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

  updateUrl: async (id, originalUrl, description, typeURL) => {
    try {
      const response = await axios.put(
        `${API_URL}/urls/${id}`,
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
      throw new Error(error.response?.data?.error || "Failed to Update URL");
    }
  },

  DeleteUrl: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/urls/${id}`, {
        withCredentials: true, // Ensures cookies (like JWT) are sent
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to Delete URL");
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

  getUrlByID: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/getvalues/${id}`, {
        withCredentials: true, // Ensures cookies (like JWT) are sent
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to Get URL");
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
};

export default UrlService;
