<?php
$jsonp = "func(".file_get_contents($_GET['url']).");";
print $jsonp;
?>