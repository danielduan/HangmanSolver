var Hangman = {};

Hangman.Current = {
    URL: "",
    Phrase: "",
    RemainingTries: 0,
    Status: "DEAD",
    Token: 0,
    Guessed: "",
};

Hangman.Init = {
	StartGame: function() {
        var proxyURL = "http://huluhangman.herokuapp.com/proxy.php?url=";
        Hangman.Current.URL = proxyURL + $("#URL").val();
		Hangman.JSONUtility.Init();
	}
};

Hangman.JSONUtility = {
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
                Hangman.Solver.NextGuess();
            }
        });
	},
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
    ParseResponse: function(obj) {
        obj = eval(obj);
        Hangman.Current.Phrase = obj.state;
        Hangman.Utility.UpdatePhrase(obj.state);
        Hangman.Current.RemainingTries = obj.remaining_guesses;
        Hangman.Current.Status = obj.status;
        Hangman.Current.Token = obj.token;
    }
};

Hangman.Utility = {
    AppendOutput: function(output) {
        $("#hangmanOutput").html($("#hangmanOutput").html() + output + "<br/>");
    },
    UpdatePhrase: function(output) {
        $("#hangmanPhrase").html(output);
    }
}
Hangman.Solver = {
    Guess = function() {

    },

};
Hangman.Dictionary = {

};