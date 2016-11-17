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


    <link href="https://fonts.googleapis.com/css?family=Lato|Open+Sans|Roboto" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="swal/sweetalert.css">
	<link rel="stylesheet" href="css/style.css">

  </head>
  <body>

    <div class="container-fluid" id="lblFront">
        <div class="container login-container">

            <div id="wdw-login">
                <form method="post" id="lblLoginForm">
                    <input type="text" name="txtUserEmail" placeholder="Email" id="txtUserEmail">
                    <input type="password" name="txtUserPassword" placeholder="Password" id="txtUserPassword">
                    <button id="btnLogin">LOGIN</button>
                </form>

                <p id="lblLoginMessage"></p>
            </div>
        </div>
    </div>

    <div class="container-fluid">

        <div class="navbar-wagon">
            <!-- Logo -->
            <h2>WALLSTREET</h2>

            <!-- Right Navigation -->
            <div class="navbar-wagon-right hidden-xs hidden-sm">
                <!-- Search form -->
                <form action="" class="navbar-wagon-search">
                    <input type="text" class="navbar-wagon-search-input" placeholder="Search Companies">
                    <button type="submit" class="navbar-wagon-search-btn">
                        <i class="fa fa-search"></i>
                    </button>
                </form>

                <!-- Button (call-to-action) -->
                <a href="" class="navbar-wagon-item navbar-logout-button btn">Logout</a>
            </div>
        </div>

        <div id="wdw-display" class="container">

        </div>

        <div id="wdw-details">

        </div>

    </div>

    <audio id="ping" src="audio/ping.ogg"></audio>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

	<script src="swal/sweetalert.min.js"></script>

    <script src="js/global.js"></script>
	<script src="js/main.js"></script>

<?php
    if( isset( $_SESSION['logged_in'] ) && $_SESSION['logged_in'] == "true" ){
        $sOutput = '<script>insertProductDataInUserTemplate();$("#lblFront").fadeOut(1000);bLoggedIn = true;</script>';
        echo $sOutput;
    }
?>


  </body>
</html>