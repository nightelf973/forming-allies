<?php
	//connect to database
	include("../model/connection.php");
	$db = new dbObj();
	$conn =  $db->getConnstring();
	
	//get all events
	function getAllEvents()
	{
		global $conn;

		//select events in ascending order of date
		$sql = "SELECT * FROM events ORDER BY date ASC";

		//SQL query executed
		$result = mysqli_query($conn, $sql);

		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
    		$rows[] = $r;
		}

		//JSON representation of results created and returned
		return json_encode($rows);
	}
?>
