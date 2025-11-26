const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  name: string | "";
  email: string;
  password: string;
}

export const authService = {
  registerUser: async (userData: Partial<User>): Promise<User | undefined> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const registeredData = await response.json();
      console.log("Data Received", registeredData);
      if (!registeredData) {
        throw new Error(registeredData.message || "Error has occured");
      }

      return registeredData.data;
    } catch (error) {
      console.error("Error has occured: ", error);
      return undefined;
    }
  },

  loginUser: async (userData: Partial<User>): Promise<User | undefined> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const loginData = await response.json();

      if (!loginData) {
        throw new Error(loginData.message || "Error has occured");
      }

      localStorage.setItem("token", loginData.token);
      return loginData.data;
    } catch (error) {
      console.error("Error has occured: ", error);
      return undefined;
    }
  },

  getCurrentUser: async (): Promise<undefined> => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  },
};
