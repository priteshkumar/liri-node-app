var Keys = require("./keys.js");
var twitterOb = require("twitter");
var spotifyOb = require("node-spotify-api");

var twitterClient = new twitterOb(Keys.twitterKeys);
var spotifyClient = new spotifyOb(Keys.spotifyKeys);


var command = process.argv[2];
var cmdparam = process.argv[3];


if(command === "my-tweets" || command === "mytweets" || command === "Mytweets"){
console.log("calling twitter rest endpoint");

twitterClient.get('statuses/user_timeline',{user_id:"mavpks",count:20},function(error,tweets,response){
 for(var i=0;i < tweets.length;i++){
 	console.log("#######  Tweet: " + (i+1) + " ########");
 	console.log("Posted at: " + tweets[i].created_at);
 	console.log("Tweet text: " + tweets[i].text);
 	console.log("");
 }

});

}
else if(command === "spotify-this-song" || command === "spotifythissong"){
console.log("calling spotify rest endpoint");
if(cmdparam === undefined || cmdparam === null){
	cmdparam = "The Sign";
}
spotifyClient.search({type:"track",query:cmdparam},function(error,trackdata){
	if(error){
		console.log("error in response");
	}
   
    console.log("Album: " + trackdata.tracks.items[0].album.name);
    console.log("Artist: " + trackdata.tracks.items[0].album.artists[0].name);
    console.log("Song: " + trackdata.tracks.items[0].name);
	console.log("Preview url: "+ trackdata.tracks.items[0].preview_url);

});

}