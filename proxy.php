<?php
$jsonp = "parseResponse(".file_get_contents($_GET['url']).");";
print $jsonp;
?>