<?php
    session_start();
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>
    	Stock Exchange Project
    </title>

    <!-- Bootstrap -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">


    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
	<script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
	<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->


    <link href="https://fonts.googleapis.com/css?family=Lato|Open+Sans|Roboto" rel="stylesheet"> <!-- Google Fonts -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/sweetalert/1.1.3/sweetalert.css">  <!-- SweetAlert -->
	<link rel="stylesheet" href="css/style.css">

  </head>
  <body>

    <div class="container-fluid" id="lblFront">

    </div>

    <div class="container-fluid">

        <div class="navbar-wagon navbar-fixed-top">
            <!-- Logo -->
            <h2>WALLSTREET</h2>

            <!-- Right Navigation -->
            <div class="navbar-wagon-right hidden-xs hidden-sm">

                <!-- Button (call-to-action) -->
                <a href="" class="navbar-wagon-item navbar-logout-button btn">Logout</a>
            </div>
        </div>

        <div id="wdw-admin" class="container">
            <div id="wdw-admin-create">
                <h4>Add New Company:</h4>
                <form id="lblAdminCreate">
                    <input type="text" name="txtTitle" placeholder="Title" id="txtTitle">
                    <input type="text" name="txtDescription" placeholder="Description" id="txtDescription">
                    <input type="text" name="txtPrice" placeholder="Price (whole numbers only)" id="txtPrice">
                    <input type="text" name="txtImageSrc" placeholder="Image URL" id="txtImageSrc">
                    <input type="text" name="txtLatitude" placeholder="Latitude (Ex: 56.701058)" id="txtLatitude">
                    <input type="text" name="txtLongitude" placeholder="Longitude (Ex: 13.537260)" id="txtLongitude">
                    <button id="btnAdminCreate">Create</button>
                </form>
            </div>

            <div id="wdw-admin-display">

            </div>
        </div>

        <div id="wdw-display" class="container ">

        </div>

        <div id="wdw-details">
            <div class="details-container container-fluid" data-stockid="{{id}}">
                <div class="details-top row">
                    <div class="details-graph col-md-12">
                        <canvas id="lblSmoothie"></canvas>
                    </div>
                </div>
                <div class="details-middle row">
                    <div class="details-middle-left col-md-6">
                        <div>
                            <h2 class="details-title">{{title}}</h2>
                            <h2 class="details-price">{{price}}</h2>
                        </div>
                        <div class="details-description">
                            {{description}}
                        </div>
                    </div>
                    <div class="details-middle-right col-md-6">
                        <div id="map" class="details-map text-center">
                            {{map}}
                        </div>
                    </div>
                </div>
                <div class="details-bottom row">
                    <div class="col-md-6">
                        <div class="details-buttons text-center">
                            <button class="details-buy">{{buybutton</button>
                            <button class="details-sell">{{sellbutton}}</button>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="details-buttons text-center">
                            <button class="details-close">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        

    </div>

    <audio id="ping" src="audio/ping.ogg"></audio>

    <footer class="footer"></footer>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyANqp5FvSLbrumLyBpohjcl1RHOUQwLyzE"
      async defer></script>

    <script src="https://cdn.jsdelivr.net/sweetalert/1.1.3/sweetalert.min.js"></script> <!-- SweetAlert -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/smoothie/1.27.0/smoothie.min.js"></script> <!-- SmoothieJs -->

    <script src="js/global.js"></script>
	<script src="js/main.js"></script>

<?php
    if( isset( $_SESSION['logged_in'] ) && $_SESSION['logged_in'] == "true" ){
        $sOutput = '<script>insertProductDataInUserTemplate();$("#lblFront").fadeOut(1000);bLoggedIn = true;</script>';
        echo $sOutput;
    }

    if( isset( $_SESSION['admin'] ) && $_SESSION['admin'] == "true" ){
        $sOutput = '<script>handleAdminLogin();</script>';
        echo $sOutput;
    }
?>


  </body>
</html>