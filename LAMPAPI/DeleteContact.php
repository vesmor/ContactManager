<?php

    //DELETE FROM Customers WHERE CustomerName='Alfreds Futterkiste';

    $inData = getRequestInfo();

    $searchTerm = $inData["searchTerm"];
    $userID = $inData["userID"];

    

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

?>