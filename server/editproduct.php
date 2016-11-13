<?php
    $sData = $_POST['sData'];
    $jData = json_decode($sData);

    $sData = file_get_contents("../json/data.json");
    $ajData = json_decode($sData);

    for($i = 0; $i < count($ajData); $i++){
        if($jData->id == $ajData[$i]->id){
            $ajData[$i] = $jData;
        }
    }

    $sOutput = json_encode($ajData, JSON_PRETTY_PRINT);
    file_put_contents("../json/data.json", $sOutput);

?>