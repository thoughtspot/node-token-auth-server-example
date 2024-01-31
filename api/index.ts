import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import axios from "axios";
import morgan from "morgan";

const TS_SECRET_KEY = process.env.TS_SECRET_KEY;
const TS_HOST =
  process.env.TS_HOST || `https://embed-1-do-not-delete.thoughtspotdev.cloud`;

axios.defaults.httpsAgent = new (require("https").Agent)({
  rejectUnauthorized: false,
});
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

app.all("/api/gettoken/:user", async (req, res) => {
  const { user } = req.params;
  const { groups } = req.body;
  const data = new URLSearchParams({
    secret_key: process.env.TS_SECRET_KEY,
    username: user,
    access_level: "FULL",
    autocreate: "true",
    ...(groups ? { group_identifiers: groups } : {}),
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

app.all("/api/v2/gettoken/:user", async (req, res) => {
  const { user } = req.params;
  let { groups } = req.body;
  try {
    const userToken: any = await axios.post(
      `${TS_HOST}/api/rest/2.0/auth/token/full`,
      {
        secret_key: process.env.TS_SECRET_KEY,
        username: user,
        auto_create: true,
        ...(groups ? { group_identifiers: groups } : {}),
      },
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    console.debug(userToken.data);
    res.send(userToken.data.token);
  } catch (error: any) {
    console.error(error);
    console.error("Error", error, error.response.status, error.response, error);
    res.status(500).send("Error getting token");
  };
});


export default app;
