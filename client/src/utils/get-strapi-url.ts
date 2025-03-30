export const getStrapiURL = () => {
  return process.env.STRAPI_API_URL || "http://localhost:1337";
};
