<?php


$inData = getRequestInfo();

$ID = $inData["ID"];
$FirstName = $inData["FirstName"];
$LastName = $inData["LastName"];
$Login = $inData["Login"];
$Password = $inData["Password"];

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");     
if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    //UPDATE Contacts SET FirstName="Ben", LastName="Hill", Phone="954-954-8954", Email="hill@gmail.com" WHERE ID=4;
    $stmt = $conn->prepare("UPDATE Users SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=?");
    $stmt->bind_param("sssss", $FirstName, $LastName, $Login, $Password, $ID);
    $stmt->execute();
    $result = $stmt->get_result();
    returnWithError("");


    $stmt->close();
    $conn->close();
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson( $obj )
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError( $err )
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson( $retValue );
}

function returnWithInfo( $firstName, $lastName, $id )
{
    $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
    sendResultInfoAsJson( $retValue );
}

?>