Hangman Solver for Hulu
=====
http://huluhangman.herokuapp.com/

By Daniel Duan

This challenge is done in HTML and Javascript. I used two dictionaries, one
for most commonly used words, and one for extended guesses.

Success rate ranges from ~40-~70% depending on luck.

How to use:
*	Open index.html
*	Change the URL
*	Input the number of repetitions wanted
*	Click solve and it will start the requested number of runs

Files:
*	index.html - page for hangman solver.
*	dictionary.js - the 5,000 most used words.
		Downloaded from http://www.wordfrequency.info/free.asp
*	gdictionary.js - the 10,000 most used words compiled by Google.
		This is an alternative dictionary to dictionary.js. Replace the
		script source in index.html to use. Sometimes achieves higher success rates.
		Downloaded from https://github.com/first20hours/google-10000-english
*	extdictionary.js - the built-in dictionary from Mac OS X.
*	hangman.js - most of the processing is done here.
*	image.js - has the 4 different hangman ASCII's.
*	proxy.php - needed to transform the JSON to JSONP for cross-domain security
		restrictions in browsers.
*	dictorganize.py - generates Javascript array from list of words separated by
		newline.
