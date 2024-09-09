import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Step 1: Make sure that when a user visits the home page,
//   it shows a random activity.You will need to check the format of the
//   JSON data from response.data and edit the index.ejs file accordingly.
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    res.render("index.ejs", { data: result });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }
});

app.post("/", async (req, res) => {
  try {
    const { type, participants } = req.body;

    // Fetch activities from the API
    const response = await axios.get(
      "https://bored-api.appbrewery.com/filter",
      {
        params: { type, participants },
      }
    );

    const result = response.data;

    // Check if result is an array and has at least one item
    if (Array.isArray(result) && result.length > 0) {
      // Select a random activity from the array
      const randomIndex = Math.floor(Math.random() * result.length);
      const randomActivity = result[randomIndex];

      // Render the random activity
      res.render("index.ejs", { data: randomActivity });
    } else {
      // No activities available for the given criteria
      res.render("index.ejs", {
        error: "No activities that match your criteria.",
      });
    }
  } catch (error) {
    // Handle 404 or general errors
    if (error.response && error.response.status === 404) {
      res.render("index.ejs", {
        error: "No activities that match your criteria.",
      });
    } else {
      res.render("index.ejs", {
        error: "Something went wrong. Please try again later.",
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
