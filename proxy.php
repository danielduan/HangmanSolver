<?php
$jsonp = "function()".file_get_contents($_GET['url']).";";
print $jsonp;
?>