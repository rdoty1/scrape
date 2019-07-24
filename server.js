// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

//linking up mongodb
var databaseUrl = "newsdb";
var collections = ["news"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error:", error);
});


app.get("/", function(req, res) {
    res.send("Hello World");
})


app.get("/all", function(req, res) {
    // Find all results from the scrapedData collection in the db
    db.news.find({}, function(error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {

            res.json(found);
        }
    });

});

var counter = 0;

app.get("/scrape", function(req, res) {
    // Make a request via axios for the news section of `ycombinator`
    axios.get("https://news.ycombinator.com/front").then(function(response) {
        // Load the html body from axios into cheerio
        var $ = cheerio.load(response.data);
        // For each element with a "title" class
        $(".title").each(function(i, element) {
            // Save the text and href of each link enclosed in the current element
            var title = $(element).children("a").text();
            var link = $(element).children("a").attr("href");

            // If this found element had both a title and a link
            if (title && link) {
                // Insert the data in the scrapedData db
                db.news.insert({
                        Headline: title,

                        link: link
                    },
                    function(err, inserted) {
                        if (err) {
                            // Log the error if one is encountered during the query
                            console.log(err);
                        } else {
                            // Otherwise, log the inserted data
                            console.log(inserted);
                            counter++
                            console.log(counter)




                        }
                    });
            }
        });
    });

    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete" + counter);

});




















//listening on port 4000
app.listen(4000, function() {
    console.log("App running on port 4000!");
});