<?php
    $sData = $_POST['data'];
    $ajData = json_decode($sData);

    $sCorrectEmail = "test";
    $sCorrectPassword = "test";

    if($ajData->sEmail == $sCorrectEmail && $ajData->sPassword == $sCorrectPassword){
        echo 1;
    } else {
        echo 0;
    }
?>