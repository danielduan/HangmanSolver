var Hangman = {};

Hangman.Init = {
	StartGame: function() {
        Hangman.Current.URL = $("#URL").val();
		Hangman.JSONUtility.Init();
	}
};

Hangman.Current = {
    URL: "",
    Phrase: "",
    Tries: 0,
}

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