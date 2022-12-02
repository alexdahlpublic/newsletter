// NOTE: //require installed node packages
require("dotenv").config();
const express = require("express");
const https = require("https");
const client = require("@mailchimp/mailchimp_marketing");

// NOTE: create new express app
const app = express();
const port = process.env.PORT || 3000;

// NOTE: enable express to access static files in folder called "public"
app.use(express.static("public"));

// NOTE: enable express to parse URL-encoded body i.e. info from HTML form
app.use(express.urlencoded({ extended: true }));

// NOTE: route "/"
app.get("/", (req, res) => {
  res.type('html').send(signup);

  // note: get data from the user
  app.post("/", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    // note: mailchimp
    client.setConfig({
      apiKey: `${process.env.API_KEY}`,
      server: `${process.env.SERVER_PREFIX}`,
    });
    const run = async () => {
      const response = await client.lists.batchListMembers(
        `${process.env.list_id}`,
        {
          members: [
            {
              email_address: email,
              status: "subscribed",
              merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
              },
            },
          ],
        }
      );
      if (response.error_count === 0) {
        res.type('html').send(success);
      } else {
        res.type('html').send(failure);
      }
    };
    run();
  });
  // NOTE: "/failure" route
  app.post("/failure", (req, res) => {
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
