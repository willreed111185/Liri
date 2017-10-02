let myKeys = require("./keys.js")
let inquirer = require("inquirer");
//console.log(myKeys.spotifyKeys.ClientID);
//console.log(myKeys.twitterKeys);
liri()
function liri(){
	console.log("+++++++++++++++++++++++++++++++++")
	console.log("+++++++++Welcome to Liri+++++++++")
	console.log("+++++++++++++++++++++++++++++++++")
	inquirer.prompt([
	    {
	      type: "list",
	      message: "What would you like me to inquire?",
	      choices: ["Spotify", "Twitter", "MovieDatabase"],
	      name: "trans"
	    }
	])
	.then(function(inquirerResponse) {
		switch(inquirerResponse.trans){
			case "Spotify":
				spotify();
				break;
			case "Twitter":
				twitter();
				break;
			case "MovieDatabase":
				movieDB();
				break;
		}
	})
}

function spotify(){
	console.log("+++++++++++++++++++++++++++++++++");
	console.log("++++++++++SPOTIFY CODE+++++++++++");
	console.log("+++++++++++++++++++++++++++++++++");
	let Spotify = require('node-spotify-api');
	let spotify = new Spotify(myKeys.spotifyKeys);
	inquirer.prompt([
	    {
	      type: "list",
	      message: "Which would you like to search?",
	      choices: ["Artist", "Track", "Album"],
	      name: "trans"
	    },
	    {
	      type: "input",
	      message: "Which would you like to query?",
	      name: "query"
	    }
	])
	.then(function(spotifyResponse) {
		spotify.search({ type: spotifyResponse.trans, query: spotifyResponse.query, limit: 1}, function(err, data) {
			if (err) {
				return console.log('Error occurred: ')
			}
			switch(spotifyResponse.trans){
				case "Artist":
					console.log("Band Name: ",data.artists.items[0].name);
					console.log("Link to their Channel: ",data.artists.items[0].external_urls.spotify);
					break;
				case "Track":
					console.log("Track Name: ",data.tracks.items[0].name);
					console.log("Album: ",data.tracks.items[0].album.name);
					console.log("Link to this song: ",data.tracks.items[0].external_urls.spotify);
					break;
				case "Album":
					console.log("Album Name: ",data.albums.items[0].name);
					console.log("Link to this album: ",data.albums.items[0].external_urls.spotify);
					break;
			}
			console.log("+++++++++++++++++++++++++++++++++");
			console.log("+++++++++++++++++++++++++++++++++");
			liri()
		});
	})
}

function twitter(){
	console.log("+++++++++++++++++++++++++++++++++");
	console.log("++++++++++TWITTER CODE+++++++++++");
	console.log("+++++++++++++++++++++++++++++++++");
	let Twitter = require('twitter');
	let client = new Twitter(myKeys.twitterKeys);
	client.get('statuses/user_timeline', {q: '@willreed1111'}, function(error, tweets, response) {
   		if(error) console.log(error);
		// Print the 20 most recent tweets
		for(var i = 0; i < tweets.length && i < 20; i++){
			console.log("I wrote : '"+tweets[i].text+ "' at "+tweets[i].created_at);
		}
		console.log("+++++++++++++++++++++++++++++++++");
		console.log("+++++++++++++++++++++++++++++++++");
		liri()
	});
}

function movieDB(){
	console.log("+++++++++++++++++++++++++++++++++");
	console.log("++++++++++++OMDB CODE++++++++++++");
	console.log("+++++++++++++++++++++++++++++++++");
	var request = require("request");
	inquirer.prompt([
	    {
	      type: "input",
	      message: "Which Movie Would You Like to Query?",
	      name: "queryMovie"
	    }
	])
	.then(function(omdbResponse) {
		request("http://www.omdbapi.com/?t="+omdbResponse.queryMovie+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {
			if (!error && response.statusCode === 200) {
				let movieData = JSON.parse(body);
				console.log("Movie Title:  ",movieData.Title);
				console.log("Release Year: ",movieData.Year); 
				console.log("IMDB Rating:  ",movieData.imdbRating);
				console.log("R.T. Rating:  ",movieData.Ratings);
				console.log("Country:      ",movieData.Country);
				console.log("Language:     ",movieData.Language);
				console.log("Actors:       ",movieData.Actors);
				console.log("Plot:         ",movieData.Plot);
			}
  		});
	})
}
