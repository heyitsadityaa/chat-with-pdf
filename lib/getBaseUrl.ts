const getBaseUrl = () =>
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `https://co${process.env.VERCEL_URL}`;

export default getBaseUrl;
