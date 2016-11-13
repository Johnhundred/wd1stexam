<?php
    $sOutput = "";
    $sTemplate = file_get_contents("../templates/admin.html");
    $sData = file_get_contents("../json/data.json");
    $ajData = json_decode($sData);

    for($i = 0; $i < count($ajData); $i++){
        $sOutput .= str_replace(
            array(
              "{{title}}",
              "{{description}}",
              "{{price}}",
              "{{imgSrc}}",
              "{{id}}"
            ),
            array(
              $ajData[$i]->title,
              $ajData[$i]->description,
              $ajData[$i]->price,
              $ajData[$i]->imgSrc,
              $ajData[$i]->id
            ),
            $sTemplate
        );
    }

    echo $sOutput;

?>