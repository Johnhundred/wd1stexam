<?php
	session_start();

	if( isset( $_SESSION['login'] ) ){
        //compare login-info to json file info
        //store login-info in variables
        //get info from json file, store in variables
        //if variables are the same, logged in
        //if not, send back to index

        $bPermission = false;
	    $sUserPass = $_SESSION['password'];
	    $sUserEmail = $_SESSION['email'];
	    $sAdminData = file_get_contents("json/administrators.json");
	    $ajAdminData = json_decode($sAdminData);
	    //print_r($ajAdminData);

	    $iArrayLength = count($ajAdminData);
	    for($i = 0; $i < $iArrayLength; $i++){
	        if($ajAdminData[$i]->password == $sUserPass && $ajAdminData[$i]->email == $sUserEmail){
	            $_SESSION['admin'] = 1;
	            $bPermission = true;
	            break;
	        } else {
	            $_SESSION['admin'] = 0;
	        }
	    }

	    if($bPermission == false){
            unset($_SESSION['admin']);
            unset($_SESSION['login']);
            header('location: login.php');
	    }
	} else {
	    header('location: login.php');
	}

	if( isset($_SESSION['admin']) && $_SESSION['admin'] == 1){

?>


<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
        <title>
            ADMIN: Stock Exchange
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

        <div class="container-fluid">

            <div id="wdw-admin-cp">
                
                <div id="lblAddProduct">

                    <form>
                        <input type="text" id="txtProductTitle" placeholder="Product title">
                        <input type="text" id="txtProductDescription" placeholder="Product description">
                        <input type="text" id="txtProductPrice" placeholder="Product price">
                        <input type="text" id="txtProductImage" placeholder="Product image URL">
                        <button id="btnAddProduct">Add Product</button>
                    </form>

                </div>

                <div id="lblAdminLogout">

                    <form action="server/logout.php">
                        <button>LOGOUT</button>
                    </form>

                </div>



            </div>

            <div id="wdw-admin-display" class="container">

            </div>

        </div>

        <div id="myModal" class="modal" role="dialog">
          <div class="modal-container">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Edit Product</h4>
              </div>
              <div class="modal-body" id="wdw-edit-data">

              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default modal-save">Save Data</button>
                <button type="button" class="btn btn-default modal-close" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        <!-- Include all compiled plugins (below), or include individual files as needed -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>

        <script src="swal/sweetalert.min.js"></script>

        <script src="js/global.js"></script>
        <script src="js/admin.js"></script>

    </body>
</html>

<?php
}
?>