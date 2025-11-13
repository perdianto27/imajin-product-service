const express = require('express');
const app = express();
app.disable("x-powered-by");

const createTestServer = (path, plugin) => {
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true
    })
  );
  app.use(path, plugin);

  return app.listen();
};


const getDefaultHeaders = (dataObject) => ({
  authorization: 'Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImRlbHRhIiwiaWF0IjoxNzMxNDI4NzgzLCJleHAiOjE3MzE1MTUxODN9.bGti9udGA3uKhFp21bi262a3IGsan8Pgjoz7xlycTi4HU76zjBk-y35xmIH_hDwF0nOaHcT_Si_5eOH2HuXpjw',
});

module.exports = {
  createTestServer,
  getDefaultHeaders
};