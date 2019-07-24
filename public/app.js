$(document).on("click", "#getNews", function() {

    function getResults() {
        // Empty any results currently on the page
        $("#results").empty();
        // Grab all of the current notes


        $.getJSON("/all", function(data) {
            // For each note...
            for (var i = 0; i < data.length; i++) {
                console.log(data[i])
                    // ...populate #results with a p-tag that includes the note's title and object id
                $(".results").prepend("<p class='data-entry' data-id=" + data[i]._id + "><span class='dataTitle' data-id=" +
                    data[i]._id + ">" + "HEADLINE: " + data[i].Headline + "<br>" + "LINK: " + data[i].link + "<br>" + "</span><span class='delete'></span></p>");
            }
        });
    }
    getResults();

});

// getResults();