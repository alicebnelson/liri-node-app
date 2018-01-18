require("dotenv").config();

//Grab data from keys.js
var inquirer = require("inquirer");
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var client = new twitter(keys.twitter);
var fs = require('fs');

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];
var input = process.argv[3];

//switch case
switch(command){
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
      spotifySong();
  break;

  case "movie-this":
      omdbData();
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function showTweets(){
  //Display last 20 Tweets
  var screenName = {screen_name: 'abnormalalice'};
  //using the npm
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@abnormalalice: " + tweets[i].text + " Created At: " + date.substring(0, 19));//makes sure to get 20 tweets
        console.log("-----------------------");
      }
    }else{
      console.log('Error occurred tweets');
      console.log(error);
    }
  });
}

function spotifySong(){
  spotify.search({ 
      type: 'track', 
      query: input || 'All the Small Things'},
       function(error, data){
    if(!error){
        var songData = data.tracks.items[0];
        //artist
        console.log("Artist: " + songData.artists[0].name);
        //song name
        console.log("Song: " + songData.name);
        //spotify preview link
        console.log("Preview URL: " + songData.preview_url);
        //album name
        console.log("Album: " + songData.album.name);
        console.log("-----------------------");
    
    } else{
      console.log('Error occurred spotify.');
    }
  });
}

function omdbData(){
  var omdbURL = 'http://www.omdbapi.com/?i=tt3896198&apikey=143aa98f&t=' + input + '&y=&plot=short&r=json';

  if (input != null){ //if there is a search term, search for that. If not, show Mr. Nobody prompt.
    request(omdbURL, function (error, response, body){
        if(!error && response.statusCode == 200){
          var body = JSON.parse(body);
          console.log("Title: " + input);
          console.log("Release Year: " + body.Year);
          console.log("IMdB Rating: " + body.imdbRating);
          console.log("Country: " + body.Country);
          console.log("Language: " + body.Language);
          console.log("Plot: " + body.Plot);
          console.log("Actors: " + body.Actors);
    
        } else{
          console.log('Error occurred omdbData.')
        }
  }); 
} else{
    console.log("-----------------------");
    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
   console.log("It's on Netflix!");
  }
  

}

function doThing(){
  fs.readFile('random.txt', "utf8", function(error, data){
    var txt = data.split(',');

    spotifySong(txt[1]);
  });
}