<?php

    //DELETE FROM Customers WHERE CustomerName='Alfreds Futterkiste';
    //SELECT * FROM Contacts WHERE UserId=? AND Name LIKE ?
    $inData = getRequestInfo();

    $searchTerm = $inData["searchTerm"];
    $userID = $inData["userID"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError($conn->connect_error);
    } 
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE UserId=? AND Name LIKE ?");
        $searchTerm = "%" . $searchTerm . "%";
        $stmt->bind_param("ss", $userId, $searchTerm);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0)
        {
            $searchResults = [];
            while($row = $result->fetch_assoc())
            {
                array_push($searchResults, $row);
            }
            returnWithInfo($searchResults);
        }
        else
        {
            returnWithError("Contact could not be deleted, it wasn't found");
        }

        $stmt->close();
        $conn->close();
    }





    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }
    function sendResultInfoAsJson($obj)
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError($err)
    {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson($retValue);
    }

    function returnWithInfo($searchResults)
    {
        $retValue = json_encode(['results' => $searchResults]);
        sendResultInfoAsJson($retValue);
    }
?>