const express = require("express")
const cors = require("cors")
const app = express();

const PORT = process.env.PORT || 8080

const axios = require('axios')
app.use(express.json())
app.use(cors())


app.get("/getdata",
    (req, response) => {

        console.log(req.query, "yguygu")
        axios.post('https://accounts.zoho.com/oauth/v2/token?refresh_token=1000.260313936976b89cacb0d69520c1c8c2.0e1bbbd4705f525cf87e7cf36d8c99a0&client_id=1000.8UDNPM1C47UG4PY0XLSC858FDIVTGT&client_secret=e53821d729641e2be6ed7f9ae676b896fcddddda3a&grant_type=refresh_token').then((res) => {
            console.log(res.data.access_token, "res")
            axios.get(`https://zohoapis.com/crm/v2/Property_Inventory?page=${req.query.page}`, {
                headers: {
                    authorization: `Zoho-oauthtoken ${res.data.access_token}`
                }
            }).then((re) => {
                response.send({ data: re.data })
                console.log(res)
            }).catch((re) => {
                console.log(res)
            })

        })
    })

app.listen(PORT, async () => {
    console.log(`listening on PORT ${PORT}`)
})