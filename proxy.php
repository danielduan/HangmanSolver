<?php
$jsonp = "Hangman.JSONUtility.ParseResponse(".file_get_contents($_GET['url']).");";
print $jsonp;
?>