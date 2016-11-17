<?php

    $sData = $_POST['data'];
    $ajData = json_decode($sData);

    $sOutput = json_encode($ajData, JSON_PRETTY_PRINT);
    file_put_contents("../json/data.json", $sOutput);

?>