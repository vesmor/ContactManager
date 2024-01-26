<?php
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
        $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=? AND FirstName LIKE ?");
        $searchTerm = "%" . $searchTerm . "%";
        $stmt->bind_param("ss", $userID, $searchTerm);
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
            returnWithError("No Contacts Found");
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