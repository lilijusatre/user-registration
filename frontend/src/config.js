export const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_URL
    : "http://localhost:3001";
