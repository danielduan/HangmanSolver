<?php
$url = $_GET['url'];
if ($_GET['token'] != null) {
	$url = $url."&token=".$_GET['token']."&guess=".$_GET['guess'];
}
$jsonp = "Hangman.JSONUtility.ParseResponse(".file_get_contents($url).");";
print $jsonp;
?>