<?php
    $sTitle = $_POST['sTitle'];
    $sDescription = $_POST['sDescription'];
    $sPrice = $_POST['sPrice'];
    $sImageSrc = $_POST['sImage'];

    $sData = file_get_contents("../json/data.json");
    $ajData = json_decode($sData);

    $oProduct = new stdClass();
    $oProduct->title = $sTitle;
    $oProduct->description = $sDescription;
    $oProduct->price = $sPrice;
    $oProduct->imgSrc = $sImageSrc;
    $oProduct->id = uniqid();

    $sId = $oProduct->id;

    array_push($ajData, $oProduct);

    $sOutput = json_encode($ajData, JSON_PRETTY_PRINT);
    file_put_contents("../json/data.json", $sOutput);

    echo $sId;

?>