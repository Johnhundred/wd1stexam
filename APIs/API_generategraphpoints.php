<?php
    $sData = file_get_contents("../json/data.json");
    $ajData = json_decode($sData);

    $iCurrentTime = time();

    for($i = 0; $i < Count($ajData); $i++){
        $fRandom = mt_rand() / mt_getrandmax();
        $aTemp[] = [$iCurrentTime, $fRandom];
        array_push($ajData[$i]->graph, $aTemp);
    }

    $sData = json_encode($ajData, JSON_PRETTY_PRINT);
    file_put_contents("../json/data.json", $sData);
?>