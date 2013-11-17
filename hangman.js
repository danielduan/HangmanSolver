var Hangman = {};

Hangman.Current = {
    URL: "",
    Phrase: "",
    RemainingTries: 0,
    Status: "DEAD",
    Token: 0
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
                console.log(data.status);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                var error = "Error " + xhr.status + ". Check your URL";
                Hangman.Utility.AppendOutput(error);
                console.log(ajaxOptions);
		    }
        });
	},
    ParseResponse: function(obj) {
        return eval(obj);
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

};
Hangman.Dictionary = {

};