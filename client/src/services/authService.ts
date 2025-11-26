const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  name: string | "";
  email: string;
  password: string;
}

export const authService = {
  registerUser: async (): Promise<User | undefined> => {
    try {
      const response = await fetch(`${API_URL}/register`);
      const registeredData = await response.json();

      if (!registeredData) {
        throw new Error(registeredData.message || "Error has occured");
      }

      return registeredData.data;
    } catch (error) {
      console.error("Error has occured: ", error);
      return undefined;
    }
  },

  loginUser: async (): Promise<User | undefined> => {
    try {
      const response = await fetch(`${API_URL}/login`);
      const loginData = await response.json();

      if (!loginData) {
        throw new Error(loginData.message || "Error has occured");
      }

      return loginData.data;
    } catch (error) {
      console.error("Error has occured: ", error);
      return undefined;
    }
  },
};
