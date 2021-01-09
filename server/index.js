require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./src/routes");
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors());

app.use("/api", router);

app.listen(port, () => console.log(`Server is running at port ${port}`));
