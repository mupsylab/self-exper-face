<?php
$config = array(
    "DataFile" => "./origin"
);
function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    return $randomString;
}

// if($_POST["path"]) {
//     $config["DataFile"] = "..".$_POST["path"]."/data/origin";
// }
if(!is_dir($config["DataFile"])) {
    mkdir($config["DataFile"]);
}

$filename = $config["DataFile"]."/".$_POST["id"].".csv";
$myfile = fopen($filename, "a");
fwrite($myfile, $_POST["data"]);
fclose($myfile);

print_r($filename." save successful");
?>