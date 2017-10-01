var Keys = require("./keys.js");
var twitterOb = require("twitter");
var spotifyOb = require("node-spotify-api");
var requestOb  = require("request");
var fsOb = require("fs");

var twitterClient = new twitterOb(Keys.twitterKeys);
var spotifyClient = new spotifyOb(Keys.spotifyKeys);


var command = process.argv[2];
var cmdparam = process.argv[3];




function getTweets(){
	twitterClient.get('statuses/user_timeline',{user_id:"mavpks",count:20},function(error,tweets,response){
 if(error){
 	console.log(error);
 	return;
 }

 for(var i=0;i < tweets.length;i++){
 	console.log("#######  Tweet: " + (i+1) + " ########");
 	console.log("Posted at: " + tweets[i].created_at);
 	console.log("Tweet text: " + tweets[i].text);
 	console.log("");
 }

});

}




function spotifyTrack(cmdparam){
console.log("calling spotify rest endpoint");
if(cmdparam === undefined || cmdparam === null){
	cmdparam = "The Sign";
}
spotifyClient.search({type:"track",query:cmdparam},function(error,trackdata){
	if(error){
		console.log("error in response");
		return;
	}
   
    console.log("Album: " + trackdata.tracks.items[0].album.name);
    console.log("Artist: " + trackdata.tracks.items[0].album.artists[0].name);
    console.log("Song: " + trackdata.tracks.items[0].name);
	console.log("Preview url: "+ trackdata.tracks.items[0].preview_url);

});

}




function movieOmdbinfo(cmdparam){
/*
   * Title of the movie.
       * Year the movie came out.
       * IMDB Rating of the movie.
       * Rotten Tomatoes Rating of the movie.
       * Country where the movie was produced.
       * Language of the movie.
       * Plot of the movie.
       * Actors in the movie.

  */
  
  if(cmdparam === undefined || cmdparam === null){
  	cmdparam = "Mr Nobody";
  }
  var requestUrl = "http://www.omdbapi.com/?t=" + cmdparam + "&y=&plot=short&apikey=" + Keys.omdbapiKey.apiKey; 
  requestOb.get({url:requestUrl},function(error,response,body){
             //console.log(JSON.parse(body));
              body = JSON.parse(body);
             if(error || body.Response === "False" || body.Error === "Movie not found!"){
             	console.log("movie not found");
             	return;
             }
             
              console.log("Year of release: " + body.Year);
              console.log("IMDB Rating: " + body.imdbRating);
              for(var i=0;i < body.Ratings.length;i++){
              	if(body.Ratings[i].Source === "Rotten Tomatoes"){
                 console.log("Rotten Tomatoes Rating: " + body.Ratings[i].Value);
                }
              }
              console.log("Country of production: " + body.Country);
              console.log("Language of movie: " + body.Language);
              console.log("Plot: " + body.Plot);
              console.log("Actors: " + body.Actors);
  });

}

if(command === "my-tweets" || command === "mytweets" || command === "Mytweets"){

console.log("calling twitter rest endpoint");
getTweets();

}
else if(command === "spotify-this-song" || command === "spotifythissong"){
 spotifyTrack(cmdparam);

}
else if(command === "movie-this"){
  movieOmdbinfo(cmdparam);  
}
else if(command === "do-what-it-says"){
	fsOb.readFile("random.txt","UTF-8",(err,data) => {
       console.log(data);
       var cmdString = data;
       //console.log(cmdString);
       var clientCmd = cmdString.split(",")[0];
       //console.log(clientCmd);
       var clientParam = cmdString.split(",")[1];
       if(clientCmd === "spotify-this-song"){
          spotifyTrack(clientParam);
       }

	});
}