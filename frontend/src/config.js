export const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_URL
    : "http://localhost:3001";
