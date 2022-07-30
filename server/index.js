const express = require("express");
let app = express();
const PORT = process.env.PORT || 4000;
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const axios = require("axios");
const util = require("util");
const cors = require("cors");
var data = null;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.post("/api/search", async (req, res) => {
  var response = await axios.post(
    "https://api.test.esamudaay.com/external/v1/ondc/retail/bpp/search",
    {
      context: {
        city: "std:080",
        action: "search",
        bap_id: "ce8a-2401-4900-1f26-656c-984f-5ee9-9661-c6c.in.ngrok.io",
        domain: "nic2004:52110",
        bap_uri:
          "https://ce8a-2401-4900-1f26-656c-984f-5ee9-9661-c6c.in.ngrok.io/api/",
        country: "IND",
        timestamp: "2022-07-28T08:00:48.462Z",
        message_id: "1658995248462",
        core_version: "1.0.0",
        transaction_id: Date.now().toString(),
      },
      message: {
        intent: {
          payment: {
            "@ondc/org/buyer_app_finder_fee_type": "percent",
            "@ondc/org/buyer_app_finder_fee_amount": 3,
          },
          fulfillment: {
            type: "Delivery",
          },
        },
      },
    }
  );
  const ack = response.data.message.ack.status;
  if (ack == "ACK") {
    console.log("Response received");
    res.json({
      success: true,
      msg: "Request successful",
    });
  } else {
    console.log(response.data.error.message);
    res.json({
      success: false,
      msg: response.data.error.message,
    });
  }
});

app.post("/api/on_search", async (req, res) => {
  data = req.body;

  res.json({
    success: true,
    msg: "Response received",
  });
});

app.get("/api/getData", async (req, res) => {
  res.json({
    success: true,
    data: data,
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server up at port ${PORT}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.error("Server closed");
    });
  }
};

const unexpectedErrorHandler = (error) => {
  console.error("Unexpected Error " + error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
