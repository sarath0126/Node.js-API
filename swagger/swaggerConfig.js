// swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Terralogic Task Management API",
      version: "1.0.0",
      description: "API documentation for Terralogic Task Management Backend",
    },
    servers: [
      {
        url: "http://localhost:8080", // your local backend URL
        description: "Local Server",
      },
      {
        url: "https://node-js-api-hg8u.onrender.com", // replace with Render URL after deployment
        description: "Production Server",
      },
    ],
  },
  apis: ["./routes/*.js"], // path where your route files exist
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
