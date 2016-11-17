<?php
    session_start();
    $sData = $_POST['data'];
    $ajData = json_decode($sData);

    $sUsers = file_get_contents("../json/users.json");
    $ajUsers = json_decode($sUsers);

    for($i = 0; $i < Count($ajUsers); $i++){
        if($ajData->sEmail == $ajUsers[$i]->email && $ajData->sPassword == $ajUsers[$i]->password){
            $_SESSION['logged_in'] = "true";
            $_SESSION['user_id'] = json_encode($ajUsers[$i]->id);
            echo 1;
            break;
        } else {
            echo 0;
        }
    }
?>