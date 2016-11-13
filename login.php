<?php
    session_start();
    if( isset( $_POST['login'] ) ){
        $sPass = $_POST['txtUserPassword'];
        $_SESSION['login'] = "true";
        $_SESSION['email'] = $_POST['txtUserEmail'];
        $_SESSION['password'] = $sPass;
        header('location: admin.php');
    }
?>


<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>
        ADMIN: Login
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

    <link rel="stylesheet" type="text/css" href="swal/sweetalert.css">
    <link rel="stylesheet" href="css/style.css">

</head>
<body>

<div class="container login-container">

    <div id="wdw-login">
        <form method="post" action="login.php">
            <input type="text" name="txtUserEmail" placeholder="email" id="userEmail">
            <input type="password" name="txtUserPassword" placeholder="password">
            <input type="hidden" name="login" value="true">
            <button id="btnLogin">LOGIN</button>
        </form>
    </div>

    <div id="lblAdminNav">
        <ul>
            <li><a href="index.php">Home</a></li>
            <li><a href="admin.php">Admin Panel</a></li>
        </ul>
    </div>

</div>

<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

<script src="swal/sweetalert.min.js"></script>

<script src="js/global.js"></script>
<script src="js/main.js"></script>

<script>

</script>


</body>
</html>