<?php
    $sId = $_POST['deleteId'];
    $sData = file_get_contents("../json/data.json");
    $ajData = json_decode($sData);

    for($i = 0; $i < count($ajData); $i++){
        if($sId == $ajData[$i]->id){
            array_splice($ajData, $i, 1);
        }
    }

    $sOutput = json_encode($ajData, JSON_PRETTY_PRINT);
    file_put_contents("../json/data.json", $sOutput);

?>