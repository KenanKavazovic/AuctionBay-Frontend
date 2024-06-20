import axios from "axios"

interface ClassConstructor {}

export const PatchRequest = async (route: string, input: ClassConstructor) => {
    try {
      const response = await axios.patch(route, input);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('An error occurred during the request.');
      }
    }
  };
  