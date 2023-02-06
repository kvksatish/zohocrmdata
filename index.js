const express = require("express");
const cors = require("cors");
const app = express();
const request = require("request");
const unzipper = require("unzipper");
const csv = require("csvtojson");
const axios = require("axios");

const PORT = process.env.PORT || 8080;

let accessToken = "";
let nextGet = "";


app.use(express.json());
app.use(cors());

app.get("/getdata", async (req, res) => {
    try {
        const tokenResponse = await axios.post(
            "https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.28a212861af87a6d413e5057b6e47c76.791d3d07b7907ac0da7515214ade2968&client_id=1000.8UDNPM1C47UG4PY0XLSC858FDIVTGT&client_secret=e53821d729641e2be6ed7f9ae676b896fcddddda3a&grant_type=refresh_token"
        );
        accessToken = tokenResponse.data.access_token;

        const bulkResponse = await axios.post(
            "https://www.zohoapis.com/crm/bulk/v3/read",
            {
                callback: {
                    url: "https://www.google.com/callback",
                    method: "post",
                },
                query: {
                    module: {
                        api_name: "Property_Inventory",
                    },
                    file_type: "csv",
                },
            },
            {
                headers: {
                    authorization: `Zoho-oauthtoken ${accessToken}`,
                },
            }
        );
        nextGet = bulkResponse.data.data[0].details.id;

        res.send({ accessToken, nextGet })
    } catch (error) {
        console.error(error);
    }
});

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});
