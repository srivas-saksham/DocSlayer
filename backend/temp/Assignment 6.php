<?php
/*
Q6. Write a program that passes control to another page using 
include, require, exit, and die functions in PHP.
*/

// Message variable
$message = "";

// Example usage of include
// This will include header.php file if it exists
include("Assignment 6 header.php");

// Example usage of require
// If footer.php is missing, the script will stop with a fatal error
require("Assignment 6 footer.php");

// Simulating some condition
$page = "home";

if($page == "about"){
    // Redirect control to about.php using include
    include("Assignment 6 about.php");
    exit(); // stop execution after including about.php
}
elseif($page == "contact"){
    // Redirect control to contact.php using require
    require("contact.php");
    die("Execution stopped after requiring contact.php"); 
}
else{
    $message = "Welcome to the Home Page!";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Control Transfer Example</title>
</head>
<body>
    <h2>PHP Control Transfer Example</h2>

    <?php
    if($message != ""){
        echo "<h3>$message</h3>";
    }
    ?>
</body>
</html>
