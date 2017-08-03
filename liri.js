var keysFile = require("./keys.js")
var twitter = require("twitter")
var Spotify = require('node-spotify-api')
var request = require("request")
var fs = require("fs")

var keys = keysFile.twitterKeys

var liriAction = process.argv[2]

var arg4 = process.argv[3]



function myTweets() {
    var client = new twitter({
        consumer_key: keys.consumer_key,
        consumer_secret: keys.consumer_secret,
        access_token_key: keys.access_token_key,
        access_token_secret: keys.access_token_secret
    })

    var params = { screen_name: 'raleighatnight' };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (i in tweets) {
                console.log(`${tweets[i].created_at} \n ${tweets[i].text}`)
            }
        }
    })
}
function spotifyThisSong(song) {
    var spotify = new Spotify({
        id: "182b87e04ffb4ca28728560519c288b2",
        secret: "bb8b8a98e8da4db299097ca963cc13ff",
    })

    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (!song) {
            song = "The Sign"
        }
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(`
        name: ${data.tracks.items[0].name}
        artist: ${data.tracks.items[0].artists[0].name}
        preview: ${data.tracks.items[0].preview_url}
        album: ${data.tracks.items[0].album.name}
        `)

    });
}

function movieThis(movie) {
    var queryUrl = `http://www.omdbapi.com/?t="${movie}"&y=&plot=short&apikey=40e9cece`;

    request(queryUrl, function (err, response, body) {
        if (err) {
            console.log(err)
        }
        else if (!err) {
            if (!err && !movie) {
                movie = "Mr. Nobody"
            }
            console.log(`
            Title: ${JSON.parse(body).Title}
            Year: ${JSON.parse(body).Year}
            IMDB Rating: ${JSON.parse(body).Ratings[0].Value}
            Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}
            Country: ${JSON.parse(body).Country}
            Language: ${JSON.parse(body).Language}
            Plot: ${JSON.parse(body).Plot}
            Actors: ${JSON.parse(body).Actors}`)
        }
    })
}

function doWhatItSays(){
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            console.log(err)
        }
        parsedData = data.split(",")
        liriAction = parsedData[0]
        arg4 = parsedData[1]
        executeAction(liriAction)
    })
}

function executeAction(action) {
    switch (action) {
        case "my-tweets":
            myTweets();
            break;
        case "spotify-this-song":
            console.log(arg4);
            spotifyThisSong(arg4);
            break;
        case "movie-this":
            movieThis(arg4);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
    }
}
executeAction(liriAction)