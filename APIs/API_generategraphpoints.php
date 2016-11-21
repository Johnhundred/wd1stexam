<?php
    $sData = file_get_contents("../json/data.json");
    $ajData = json_decode($sData);

    for($i = 0; $i < Count($ajData); $i++){
        $iPrice = (int)$ajData[$i]->price;
        $iStatus = null;
        $iStatus = mt_rand(0, 1);
        $iRandom = null;
        $iRandom = mt_rand(0, 10);
        if($iStatus == 1){
            $iPrice += $iRandom;
        } else {
            $iPrice -= $iRandom;
        }
        $ajData[$i]->Price = $iPrice;
        if(Count($ajData[$i]->graph) > 29){
            array_shift($ajData[$i]->graph);
        }
        array_push($ajData[$i]->graph, [($milliseconds = round(microtime(true) * 1000)), $iPrice]);
    }

    $sData = json_encode($ajData, JSON_PRETTY_PRINT);
    file_put_contents("../json/data.json", $sData);
?>