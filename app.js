const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { log } = require("console");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const f = req.body.fName;
    const l = req.body.lName;
    const e = req.body.email;
    console.log(f, l, e);

    const data = {
        members: [
            {
                email_address: e,
                status: "subscribed",
                merge_fields: {
                    FNAME: f,
                    LNAME: l
                }

            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us14.api.mailchimp.com/3.0/lists/fb5691c88f";
    const options = {
        method: "post",
        auth: "rock:1157031c61b6538b37a40edaa5efe1d8-us14"
    }
    
    const request = https.request(url, options, function (response) {

        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res){
res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("server is running on port 3000");
});



// api key
// 1157031c61b6538b37a40edaa5efe1d8-us14

// List Id
// fb5691c88f