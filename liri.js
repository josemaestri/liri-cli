// required
// =============================
require('dotenv').config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var request = require('request');
var moment = require('moment');
var fs = require('fs');


// vars
// =============================
var cmd = process.argv[2];
var input = process.argv.slice(3).join(' ');




// functions
// =============================

// log
// -----------------------------
var logTheTrap = function(output){
  fs.appendFile('./log.txt', '[' + moment().utc().format() + '] ' + JSON.stringify(output), (err) =>{
    if (err) throw err;
  });
};

// spotify
// -----------------------------
var spotify = new Spotify(keys.spotify);

var spotifyThis = function(query){
  spotify.search({
    type: 'track',
    query: query,
    limit: 1	   
  }).then(function(res){
    var trackObj = {};
    var msg;
    if(res.tracks.items.length > 0){
    var track = res.tracks.items[0].name;
    var artists = [];
    var artistsArr = res.tracks.items[0].artists;
    var album = res.tracks.items[0].album.name;
    var previewURL = "Sorry, no preview URL for this track.";


    if(res.tracks.items[0].preview_url !== null){
      previewURL = res.tracks.items[0].preview_url; 
    }
    
    for(i=0;i<artistsArr.length;i++){
      artists.push(artistsArr[i].name);
    }
    artists = artists.join(', ');
    msg = 'Here\'s the first result on Spotify for this song:';
    trackObj = {
      "track": track,
      "artist(s)": artists,
      "album": album,
      "preview": previewURL
    };
    } else{
    msg = 'Oh no! I couldn\'t find any song with the name you were looking for. How about this song?';
    trackObj = {
      "track": 'The Sign',
      "artist(s)": 'Ace of Base',
      "album": 'Happy Nation',
      "preview": "Sorry, no preview URL for this track."
    };

    }
    console.log(msg);
    // console.table(trackObj,['track','artists(s)','album','preview']);
    console.table(trackObj);
    logTheTrap(trackObj);
  }).catch(function(err){
    console.log(err);
    logTheTrap(err);
  });
};


// bands in town
// -----------------------------
var bandsInTown = function(artist){
  request('https://rest.bandsintown.com/artists/' + artist + '/events?app_id=codingbootcamp', function(err,res,body){
    if (err !== null){
      console.log('error:',err);
    } else{
      //console.log('status code:',res && res.statusCode);
      var data = JSON.parse(body);
      
      if(data.length > 0){
        var eventsArr = [];
        for(i=0;i<data.length;i++){
      	  var eventObj = {
	    'venue': data[i].venue.name,
            'location': data[i].venue.city + ', ' + data[i].venue.region + ', ' + data[i].venue.country,
            'date/time': moment(data[i].datetime).format('MM/DD/YYYY, hh:mm')
	  }
          eventsArr.push(eventObj);
        }
        console.table(eventsArr,['venue','location','date/time']);
        logTheTrap(eventsArr,['venue','location','date/time']);
      } else{
        console.error('I couldn\'t find any results. This artist may either have no upcoming shows, or may not exist. Sorry!');
        logTheTrap('bandsInTownError: I couldn\'t find any results. This artist may either have no upcoming shows, or may not exist. Sorry!');
      }
    }
  });
};

// OMDB
// -----------------------------
var movieThis = function(movie){
  request('https://www.omdbapi.com/?apikey=trilogy&r=json&type=movie&t='+movie, function(err,res,body){
    if (err !== null){
      console.log('error:',err);
    } else{
      //console.log('status code:',res && res.statusCode);
      var data = JSON.parse(body);
     
      if(data.Response !== 'False'){
        var movieObj ={
	  'title': data.Title,
	  'year': data.Year,
	  'IMDB Rating': data.imdbRating,
	  'RT Rating': data.Ratings.find(rating => rating.Source === 'Rotten Tomatoes').Value,
	  'country': data.Country,
	  'language': data.Language,
	  'plot': data.Plot,
	  'actors': data.Actors
	};
        console.table(movieObj);
        logTheTrap(movieObj);
      } else{
        console.error('I couldn\'t find any results. This movie may have been misspelled, or may not exist. Sorry! If you haven\'t watched "Mr. Nobody" yet, then you should: ');
	request('https://www.omdbapi.com/?apikey=trilogy&r=json&type=movie&i=tt0485947',function(err,res,body){
          data = JSON.parse(body);
	  if(data.Response !== 'False'){
            var movieObj ={
	      'title': data.Title,
	      'year': data.Year,
	      'IMDB Rating': data.imdbRating,
	      'RT Rating': data.Ratings.find(rating => rating.Source === 'Rotten Tomatoes').Value,
	      'country': data.Country,
	      'language': data.Language,
	      'plot': data.Plot,
	      'actors': data.Actors
	    };
            console.table(movieObj);
            logTheTrap(movieObj);
	  }
	});
      }
    }
  });
};


// random.txt
// -----------------------------
var followThis = function(){
  fs.readFile('./random.txt','utf8',function(err,data){
    if (err) throw err;
    // console.log(data);
    var dataArr = data.split(',');
    runTheTrap(dataArr[0],dataArr.splice(1).join(' '));
  });
};



// RUN THE TRAP
// =============================
var runTheTrap = function(cmd, input=null){
  switch(cmd){
    case 'spot-this-song':
      spotifyThis(input);
      break;
    case 'in-town':
      bandsInTown(input);
      break;
    case 'movie-this':
      movieThis(input);
      break;
    case 'follow-this':
      followThis();
      break;

    default:
      console.error('Error: missing arguments');
  }
};



runTheTrap(cmd, input);
