# liri-cli
https://josemaestri.github.io/liri-cli

## Description
This is a CLI Utility written in Node.js, which connects to various web API's in order to run a series of different tasks. Current tasks include:
- Search for a song on Spotify
- Search for a movie on OMDB
- Search upcoming concerts for an artist via BandsInTown

This utility can read commands from either the command line itself or the attached `random.txt` file, and saves all results to the attached `log.txt` file. 

[Video Demonstrating LIRI](https://youtu.be/as0kz64BXD8)

<a href="http://www.youtube.com/watch?feature=player_embedded&v=as0kz64BXD8
" target="_blank"><img src="http://img.youtube.com/vi/as0kz64BXD8/0.jpg" 
alt="IMAGE ALT TEXT HERE" width="240" height="180" border="10" /></a>


## Notes
- Terminal Syntax: `node 'file/to/liri.js' [command] [input]`
- Commands and inputs are as follows:
  - Spotify: `spot-this-song 'song name'`
  - BandsInTown: `in-town 'artist name'`
  - OMDB: `movie-this 'movie name'`
  - follow instructions in text file: `follow-this` _(no input)_ 
- Enter inputs __'IN QUOTES'__
- Most results are returned in a table format, and are logged as JSON objects.
