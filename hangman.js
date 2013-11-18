var Hangman = {};

//keeps current game state
Hangman.Current = {
    URL: "",
    Phrase: "",
    RemainingTries: 0,
    Status: "DEAD",
    Token: 0,
    Guessed: "",
    PossibleWords: [],
    ExtendedDict: false,
    Repeat: 0,
    TotalSolved: 0,
    TotalPlayed: 0,
    Clear: function() {
        this.TotalPlayed++;
        if (this.Status == "FREE") {
            this.TotalSolved++;
        }
        this.UpdateStats();
        this.Phrase = "";
        this.RemainingTries = 0;
        this.Token = 0;
        this.Guessed = "";
        this.PossibleWords = [];
        this.Status = "DEAD";
        this.ExtendedDict = false;
        this.Repeat --;
        if (this.Repeat > 0) {
            Hangman.Init.Repeat();
        }
    },
    UpdateStats: function() {
        var output = this.TotalSolved + "/" + this.TotalPlayed;
        output += " Games Won - " + Math.round(100.0 * this.TotalSolved / this.TotalPlayed);
        output += "% Success Rate";
        $("#Stats").html(output);
    },
};

//initializer for running game
Hangman.Init = {
	StartGame: function() {
        var proxyURL = "http://huluhangman.herokuapp.com/proxy.php?url=";
        Hangman.Current.URL = proxyURL + $("#URL").val();
        Hangman.Current.Repeat = $("#Repeat").val();
        Hangman.JSONUtility.Init();
	},
    Repeat: function() {
        Hangman.JSONUtility.Init();
    }
};

//gets JSON from remote server
Hangman.JSONUtility = {
    //starts a new game
	Init: function() {
		$.ajax({
            type: 'GET',
            url: Hangman.Current.URL,
            jsonp: "jsonp",
            dataType: 'jsonp',
            success: function (data) {
                //always errors, cant figure out jsonp issues :(
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status != 200) {
                    var error = "Error " + xhr.status + ". Check your URL.";
                    Hangman.Utility.AppendOutput(error);
                }
		    },
            complete: function() {
                Hangman.Utility.AppendOutput("[New Game Token=" + Hangman.Current.Token + "]");
                Hangman.Solver.Init();
            }
        });
	},
    //subsequent guesses
    Guess: function(guess) {
        $.ajax({
            type: 'GET',
            url: Hangman.Current.URL + "&token=" + Hangman.Current.Token + "&guess=" + guess,
            jsonp: "jsonp",
            dataType: 'jsonp',
            success: function (data) {
                //always errors, cant figure out jsonp issues :(
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.status != 200) {
                    var error = "Error " + xhr.status + ". Check your URL.";
                    Hangman.Utility.AppendOutput(error);
                }
            },
            complete: function() {
                Hangman.Solver.NextGuess();
            }
        });
    },
    //takes JSON response and loads the info
    ParseResponse: function(obj) {
        obj = eval(obj);
        Hangman.Current.Phrase = obj.state;
        Hangman.Utility.UpdatePhrase(obj.state);
        Hangman.Utility.UpdateImage(obj.remaining_guesses);
        Hangman.Current.RemainingTries = obj.remaining_guesses;
        Hangman.Current.Status = obj.status;
        Hangman.Current.Token = obj.token;
    }
};

//updates HTML
Hangman.Utility = {
    AppendOutput: function(output) {
        $("#hangmanOutput").html($("#hangmanOutput").html() + output + "<br/>");
        $("#Scroller").scrollTop($("#Scroller")[0].scrollHeight);
    },
    UpdatePhrase: function(output) {
        $("#hangmanPhrase").html(output);
    },
    UpdateImage: function(lives) {
        $("#preImage").html(Hangman.Images[lives].replace(" ", "&nbsp"));
    }
};

//actual solving is done here
Hangman.Solver = {
    //starts game and loads dictionary
    Init: function() {
        Hangman.Utility.AppendOutput("* Initializing " + Hangman.Current.Phrase);
        var alphaNum = this.LoadDictionary("Dictionary");
        //find letter with max frequency
        var maxNum = 0;
        var maxLetter = "";
        for (var key in alphaNum) {
            if (alphaNum[key] > maxNum) {
                maxNum = alphaNum[key];
                maxLetter = key;
            }
        }

        Hangman.Current.Guessed += maxLetter;
        Hangman.Utility.AppendOutput("* - Guessing " + maxLetter);
        Hangman.JSONUtility.Guess(maxLetter);
    },
    //helper for loading dictionary, either 'Dictionary' or 'ExtendedDictionary'
    LoadDictionary: function(dictionary) {
        Hangman.Utility.AppendOutput("* Loading " + dictionary);
        var words = Hangman.Current.Phrase.split(" ");
        var alphaNum = {}; //holds dictionary of letter frequency
        //iterate through ___ ____ ____
        for (var i = 0; i < words.length; i += 1) {
            Hangman.Current.PossibleWords[i] = [];
            var dict = "len" + words[i].length;
            //iterate through possible words in dictionary with same length
            for (var j = 0; j < Hangman[dictionary][dict].length; j += 1) {
                var dictWord = Hangman[dictionary][dict][j].toUpperCase();
                Hangman.Current.PossibleWords[i].push(dictWord);
                var letters = dictWord.split("");
                //count the letters in the word
                for (var k = 0; k < letters.length; k += 1) {
                    if (alphaNum[letters[k]] == null) {
                        alphaNum[letters[k]] = 0;
                    }
                    alphaNum[letters[k]] += 1;
                }
            }
        }
        
        return alphaNum;
    },
    //determine if a guess is valid for a particular sequence of words
    IsPossibleWord: function(hangmanWord, dictWord) {
        hangmanWord = hangmanWord.split("");
        dictWord = dictWord.split("");
        for (var i = 0; i < hangmanWord.length; i++) {
            if (hangmanWord[i] != "_" && hangmanWord[i] != dictWord[i]) {
                return false;
            }
        }
        return true;
    },
    //subsequent guesses are handled here
    NextGuess: function() {
        if (Hangman.Current.Status == "DEAD") {
            var status = "Died :( Phrase is '" + Hangman.Current.Phrase + "'";
            Hangman.Utility.UpdatePhrase(status);
            Hangman.Utility.AppendOutput("Died :( " + Hangman.Current.Phrase + "<br/>");
            Hangman.Current.Clear();
            return;
        } else if (Hangman.Current.Status == "FREE") {
            var status = "FREE :) Phrase is '" + Hangman.Current.Phrase + "'";
            Hangman.Utility.UpdatePhrase(status);
            Hangman.Utility.AppendOutput("FREED! :) " + Hangman.Current.Phrase + "<br/>");
            Hangman.Current.Clear();
            return;
        }

        Hangman.Utility.AppendOutput("* - " + Hangman.Current.RemainingTries + " Tries Left " + Hangman.Current.Phrase);

        var words = Hangman.Current.Phrase.split(" ");
        var alphaNum = {}; //holds dictionary of letter frequency
        //iterate through ___ ____ ____
        for (var i = 0; i < words.length; i += 1) {
            var pastPossibleWords = Hangman.Current.PossibleWords[i];
            var newPossibleWords = [];
            var currentWord = words[i].split("");
            //iterate through past possible words and form new possible word list
            for (var j = 0; j < pastPossibleWords.length; j += 1) {
                if (Hangman.Solver.IsPossibleWord(words[i], pastPossibleWords[j])) {
                    newPossibleWords.push(pastPossibleWords[j]);
                }
            }
            Hangman.Current.PossibleWords[i] = newPossibleWords;
            //count letter frequencies
            for (var j = 0; j < Hangman.Current.PossibleWords[i].length; j += 1) {
                var letters = Hangman.Current.PossibleWords[i][j].split("");
                //count the letters in the word
                for (var k = 0; k < letters.length; k += 1) {
                    if (alphaNum[letters[k]] == null) {
                        alphaNum[letters[k]] = 0;
                    }
                    alphaNum[letters[k]] += 1;
                }
            }
        }
        //find letter with max frequency
        var maxNum = 0;
        var maxLetter = "";
        for (var key in alphaNum) {
            if (alphaNum[key] > maxNum && Hangman.Current.Guessed.indexOf(key) === -1) {
                maxNum = alphaNum[key];
                maxLetter = key;
            }
        }

        //if no letters are determined, then word doesn't exist in dictionary
        if (maxLetter == "") {
            Hangman.Utility.AppendOutput("* Unknown Word");
            //import extended dict if haven't done so
            if (Hangman.Current.ExtendedDict == false) {
                //import extended dictionary and reguess
                Hangman.Current.ExtendedDict = true;
                this.LoadDictionary("ExtendedDictionary");
                Hangman.Solver.NextGuess();
                return;
            } else { //guess based on letter occurance frequencies
                for (var i = 0; i < Hangman.Dictionary.AlphaFrequency.length; i += 1) {
                    if (Hangman.Current.Guessed.indexOf(Hangman.Dictionary.AlphaFrequency[i]) === -1) {
                        maxLetter = Hangman.Dictionary.AlphaFrequency[i];
                        break;
                    }
                }
            }
            
        }

        Hangman.Current.Guessed += maxLetter.toUpperCase();
        Hangman.Utility.AppendOutput("* - Guessing " + maxLetter);
        Hangman.JSONUtility.Guess(maxLetter);
    },

};
