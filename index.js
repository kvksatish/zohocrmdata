const express = require("express")
const cors = require("cors")
const app = express();
const request = require("request");
var unzipper = require('unzipper');
var csv = require('csvtojson');

const PORT = process.env.PORT || 8080

const axios = require('axios')
app.use(express.json())
app.use(cors())
//////////////////
let accesstoken = ""
let nextget = ""

let fulldata = []



app.get("/getdata",
    (req, responsefulll) => {

        // console.log(req.query, "yguygu")
        axios.post('https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.28a212861af87a6d413e5057b6e47c76.791d3d07b7907ac0da7515214ade2968&client_id=1000.8UDNPM1C47UG4PY0XLSC858FDIVTGT&client_secret=e53821d729641e2be6ed7f9ae676b896fcddddda3a&grant_type=refresh_token')

            .then((res) => {
                accesstoken = res.data.access_token
                console.log(accesstoken, "res")

                axios.post(`https://www.zohoapis.com/crm/bulk/v3/read`, {

                    "callback": {
                        "url": "https://www.google.com/callback",
                        "method": "post"
                    },
                    "query": {
                        "module": {
                            "api_name": "Property_Inventory"
                        },
                        "file_type": "csv"
                    }

                }, {
                    headers: {
                        authorization: `Zoho-oauthtoken ${accesstoken}`,
                    }
                }).then((re) => {

                    nextget = re.data.data[0].details.id
                    console.log(nextget, accesstoken, "ss")

                    const inputUrl = `https://www.zohoapis.com/crm/bulk/v3/read/5206526000019507020/result`;
                    const headers = {
                        "Authorization": `Zoho-oauthtoken ${accesstoken}`,
                    };

                    request.get({ url: inputUrl, headers: headers })
                        .on('response', function (response) {
                            console.log(response.statusCode) // 200
                            console.log(response.headers['content-type']) // 'text/plain'
                        })
                        .pipe(unzipper.Parse())
                        .on('entry', function (entry) {
                            console.log(entry)
                            var fileName = entry.path;
                            var type = entry.type;

                            if (fileName === "5206526000019507020.csv" && type === 'File') {
                                entry.pipe(csv())
                                    .on('data', (jsonObj) => {
                                        // process the converted JSON object
                                        //console.log(jsonObj);
                                        const buffers = [jsonObj];
                                        // console.log(buffers)

                                        const jsonObjects = buffers.map(buffer => fulldata.push(JSON.parse(buffer.toString())));

                                        //console.log(fulldata);
                                        //console.log(fulldata.length);
                                        // responsefulll.send(fulldata)
                                    })
                                    .on('end', () => {
                                        console.log(fulldata.length);
                                        responsefulll.send(fulldata)
                                        console.log('Done converting CSV to JSON.');
                                    });
                            } else {
                                entry.autodrain();
                            }

                        });


                }).catch((re) => {
                    console.log(re, "errorend")
                })

            })
    })

app.listen(PORT, async () => {
    console.log(`listening on PORT ${PORT}`)
})