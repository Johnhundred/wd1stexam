<?php
    $sData = $_POST['data'];
    $ajData = json_decode($sData);

    $sCorrectEmail = "test";
    $sCorrectPassword = "test";

    if($ajData->sEmail == $sCorrectEmail && $ajData->sPassword == $sCorrectPassword){
        $_SESSION['logged_in'] = "true";
        echo 1;
    } else {
        echo 0;
    }
?>