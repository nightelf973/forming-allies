<?php
Class dbObj{

	//abertay database connections 
	var $servername = "lochnagar.abertay.ac.uk";
	var $username = "xxx";
	var $password = "xxx";
	var $dbname = "xxx";
	var $conn;


	//get connection string to use with mysqli
	function getConnstring() {

        //insert database credentials as parameters
		$con = mysqli_connect($this->servername, $this->username, $this->password, $this->dbname) ;

		//check connection 
		if (mysqli_connect_errno()) {
			echo("Connect failed: ". mysqli_connect_error());
			exit();

		//if connection successful --> return connection string to api	
		} else {
			$this->conn = $con;
		}
		
		return $this->conn;
	}
}
?>
