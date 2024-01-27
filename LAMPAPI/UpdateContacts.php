<?php


$inData = getRequestInfo();

$id = 0;
$firstName = "";
$lastName = "";

$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");     
if( $conn->connect_error )
{
    returnWithError( $conn->connect_error );
}
else
{
    //UPDATE Contacts SET FirstName="Ben", LastName="Hill", Phone="954-954-8954", Email="hill@gmail.com" WHERE ID=4;
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID=?");
    $stmt->bind_param("sssss", $inData["firstName"], $inData["lastName"], $inData["Phone"], $inData["Email"], $inData["ID"]);
    $stmt->execute();
    $result = $stmt->get_result();
    returnWithError("");
    // if( $row = $result->fetch_assoc()  )
    // {
    //     returnWithInfo( $row['firstName'], $row['lastName'], $row['ID'] );
    // }
    // else
    // {
    //     returnWithError("No Records Found");
    // }

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