<?php

########### CONFIG ###############



########### CONFIG END ###########

switch ($_SERVER['REQUEST_METHOD']) {
    case ("OPTIONS"): //Allow preflighting to take place.
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;
    case ("POST"): //Send the email;
        header("Access-Control-Allow-Origin: *");

        $to = $_POST['inputEmail'];
        $subject = "Reset your password";
        $message = "Click on this link to get to the reset Page https://gruppe-364.developerakademie.net/reset.html?user=".''.$_POST['inputEmail'];
        $headers = "From:  Join Service Team"; // . $_POST['Email'];

        $redirect = './index.html?mailSend=true';

        mail($to, $subject, $message, $headers);
        header("Location: " . $redirect); 

        break;
    default: //Reject any non POST or OPTIONS requests.
        header("Allow: POST", true, 405);
        exit;
}
