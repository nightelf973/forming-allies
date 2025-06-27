<!--no longer being used due to github Pages requiring static pages-->
<?php
	//connect to database
	include("connection.php");
	$db = new dbObj();
	$conn =  $db->getConnstring();
    
    //find user's username
    function getUsername($id){

        global $conn;
        $stmt = mysqli_stmt_init($conn);

        //select user detauls from database where id matches
        $sql = "SELECT * FROM honsuser WHERE userid = ? LIMIT 1" ;

        //id parameter binded using prepared statements
		mysqli_stmt_prepare($stmt, $sql);
		mysqli_stmt_bind_param($stmt, 's', $id);

        //SQL query executed
		mysqli_stmt_execute($stmt);
		$result = mysqli_stmt_get_result($stmt);
		$row=mysqli_fetch_array($result);

        //JSON representation of result created and returned
		return json_encode($row);
    }


    //get question based on id
    function getQuestionByID($id){

		global $conn;
		$stmt = mysqli_stmt_init($conn);

        //select post by id
		$sql = "SELECT honsquestion.question, honsquestion.userid, honsquestion.dttm, honsquestion.qno, honsuser.nicname FROM honsquestion INNER JOIN honsuser ON honsquestion.userid = honsuser.userid WHERE honsquestion.qno = ? LIMIT 1" ;
		
        //parameters binded using prepared statements
        mysqli_stmt_prepare($stmt, $sql);
		mysqli_stmt_bind_param($stmt, 's', $id);

        //SQL query executed
		mysqli_stmt_execute($stmt);
		$result = mysqli_stmt_get_result($stmt);
		$row=mysqli_fetch_array($result);

        //JSON representation of results created and returned
		return json_encode($row);
    }


    //get posts belonging to logged in user
    function getUserQuestions($id)
    {

        global $conn;
		$stmt = mysqli_stmt_init($conn);

        //select all of users posts
        $sql = "SELECT honsquestion.question, honsquestion.dttm, honsquestion.qno, honsuser.nicname FROM honsquestion INNER JOIN honsuser ON honsquestion.userid = honsuser.userid WHERE honsquestion.userid = ? ORDER BY dttm DESC";
		mysqli_stmt_prepare($stmt, $sql);
		mysqli_stmt_bind_param($stmt, 's', $id);

        //SQL query executed
		mysqli_stmt_execute($stmt);
		$result = mysqli_stmt_get_result($stmt);
	
        //create array of results
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
    		$rows[] = $r;
		}

        //JSON representation of results created and returned
		return json_encode($rows);
    }


    //get specific post's comments
    function getQuestionAnswers($id){

        global $conn;
		$stmt = mysqli_stmt_init($conn);

        //select all comments based on post id
        $sql = "SELECT honsanswer.answer, honsanswer.dttm, honsuser.nicname FROM honsanswer INNER JOIN honsuser ON honsanswer.userid = honsuser.userid WHERE honsanswer.qno = ?";
		
        //id parameter binded using prepared statements
        mysqli_stmt_prepare($stmt, $sql);
		mysqli_stmt_bind_param($stmt, 's', $id);

        //SQL query executed
		mysqli_stmt_execute($stmt);
		$result = mysqli_stmt_get_result($stmt);

        //create array of results
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
    		$rows[] = $r;
		}

        //JSON representation of results created and returned
		return json_encode($rows);
    }


    //get all posts
    function getRecentQuestions()
    {
        global $conn;

        //select all posts 
		$sql = "SELECT honsquestion.question, honsquestion.dttm, honsquestion.qno, honsuser.nicname FROM honsquestion INNER JOIN honsuser ON honsquestion.userid = honsuser.userid ORDER BY dttm DESC";
		
        //SQL query executed
        $result = mysqli_query($conn, $sql);

		//create array of results
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
    		$rows[] = $r;
        }

        //JSON representation of results created and returned
        return json_encode($rows);
    }
    

    //update specific post
    function updateQuestion($txt)
    {
        global $conn;

        //decode user post data
        $updateq = json_decode($txt);
		$stmt = mysqli_stmt_init($conn);

        //update post where question number matches
		$sql = "UPDATE honsquestion SET question = ? WHERE qno = ?" ;

        //parameters binded using prepared statements
		mysqli_stmt_prepare($stmt, $sql);
        mysqli_stmt_bind_param($stmt, 'ss', $updatedQuestion, $qNo);
        $updatedQuestion = $updateq -> question;
        $qNo = $updateq -> qno;

        //if query succeeds --> recorded result as updated
        if (mysqli_stmt_execute($stmt) == true){
            $res = "Updated.";
        }

        //if query does not succeed --> recorded result as failed
        else {
            $res = "Failed.";
        }

        //result returned to update controller
        return $res;
    }


    //delete specific post
    function deleteQuestion($id)
    {

        global $conn;
        $stmt = mysqli_stmt_init($conn);

        //delete post by id
        $sql = "DELETE FROM honsquestion WHERE qno = ?" ;

        //id parameter binded using prepared statements
        mysqli_stmt_prepare($stmt, $sql);
        mysqli_stmt_bind_param($stmt, 's', $id);

        //if query succeeds --> recorded question as deleted
        if (mysqli_stmt_execute($stmt) == true){
            $res1 = "question=deleted";
        }

        //if query does not succeed --> recorded result as failed to delete
        else{
            $res1 = "question=failedtodelete";
        }
        
        $stmt = mysqli_stmt_init($conn);

        //delete comments by post id
        $sql = "DELETE FROM honsanswer WHERE qno = ?" ;

        //id parameter binded using prepared statements
        mysqli_stmt_prepare($stmt, $sql);
        mysqli_stmt_bind_param($stmt, 's', $id);

        //if query succeeds --> recorded comments as deleted
        if (mysqli_stmt_execute($stmt) == true){
            $res2 = "&answers=deleted";
        }

        //if query does not succeed --> recorded comments as failed to delete
        else{
            $res2 = "&answers=failedtodelete";
        }

        //final result is result of post delete and comment delete
        $res = $res1.$res2;

        //result returned
        return $res;
    }


    //create a post
    function createQuestion($txt)
    {

        global $conn;

        //decode user post data
        $data = json_decode($txt) ;

        //get current datetime
        $datetime = date_create()->format('Y-m-d H:i:s');

        //insert user's post
        $stmt = $conn->prepare("INSERT INTO honsquestion (question, userid, dttm) values (?, ?, ?)") ;
        $stmt->bind_param("sss", $question, $userid, $dttm);
        $question = $data -> question;
        $userid = $data -> userid;
        $dttm = $datetime;

        //SQL query executed
        $res = $stmt->execute();

        //get post id and return it
        $res = $stmt->insert_id;
        return $res;
    }


    //create a comment on a specific post
    function createAnswer($txt)
    {

        global $conn;

        //decode user comment data
        $data = json_decode($txt);

        //get current datetime
        $datetime = date_create()->format('Y-m-d H:i:s');

        //insert user's comment with associated post number
        $stmt = $conn->prepare("INSERT INTO honsanswer (qno, answer, userid, dttm) values (?, ?, ?, ?)") ;
        $stmt->bind_param("ssss", $qno, $answer, $userid, $dttm);
        $qno = $data -> qno;
        $answer = $data -> answer;
        $userid = $data -> userid;
        $dttm = $datetime;

        //SQL query executed
        $res = $stmt->execute();

        //get comment id and return it
        $res = $stmt->insert_id;
        return $res;
    }

    //log a user out
    function logout(){
        
        session_start();
        $_SESSION = array();

        //remove cookies
        setcookie(session_name(), '', time()-2592000, '/');

        //end session
        session_destroy();
    }
	
?>