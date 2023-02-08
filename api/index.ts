import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import morgan from "morgan";

import {
  AccessLevelEnum,
  Client,
  DEFAULT_CONFIGURATION,
  SessionController,
} from "@thoughtspot/rest-api-sdk";

const TS_SECRET_KEY = process.env.TS_SECRET_KEY;
const TS_HOST =
  process.env.TS_HOST || `https://embed-1-do-not-delete.thoughtspotdev.cloud`;
// create express server on port 3000
const app = express();

// set up express to use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("short"));

// set up express to use cors
app.use(cors());

// create a GET route for the root path
app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/gettoken/:user", async (req, res) => {
  const { user } = req.params;
  const data = new URLSearchParams({
    secret_key: process.env.TS_SECRET_KEY,
    username: user,
    access_level: "FULL",
  });

  try {
    const userToken = await axios.post(
      `${TS_HOST}/callosum/v1/tspublic/v1/session/auth/token`,
      data.toString(),
      {
        headers: {
          accept: "text/plain",
          "x-requested-by": "ThoughtSpot",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.send(userToken.data);
  } catch (error: any) {
    // console.error(error.request);
    console.error("Error", error.response.status, error.response, error);
    res.status(500).send("Error getting token");
  }
});

app.get("/api/v2/gettoken/:user", async (req, res) => {
    const { user } = req.params;
    DEFAULT_CONFIGURATION.baseUrl = TS_HOST;
    DEFAULT_CONFIGURATION.acceptLanguage = "*";
    let client = new Client(DEFAULT_CONFIGURATION);
    const sessionController = new SessionController(client);
    const tokenRes = await sessionController.getToken({
      userName: user,
      secretKey: process.env.TS_SECRET_KEY,
      accessLevel: AccessLevelEnum.FULL,
    });

    res.send(tokenRes.result.token?.toString());
});

export default app;
