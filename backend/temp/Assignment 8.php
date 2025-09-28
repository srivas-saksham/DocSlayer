<?php
/*
Q8. Menu-driven Cookie Example in PHP
*/

$message = "";

if(isset($_POST['submit'])){
    $choice = $_POST['choice'] ?? "";
    $continue = true;

    while($continue){
        switch($choice){
            case "1": // Set Cookie
                setcookie("username", "Yourname", time() + 86400, "/"); // expires in 24 hours
                $message = "Cookie 'username' has been set. Refresh the page to see the welcome message.";
                break;

            case "2": // Check Cookie
                if(isset($_COOKIE['username'])){
                    $message = "Welcome back, " . $_COOKIE['username'] . "!";
                } else {
                    $message = "Hello, new visitor! Cookie not found. You may set it first.";
                }
                break;

            case "3": // Delete Cookie
                setcookie("username", "", time() - 3600, "/"); // expire cookie
                $message = "Cookie 'username' has been deleted.";
                break;

            case "4": // Exit
                $continue = false;
                $message = "Exited menu.";
                break;

            default:
                $message = "Please select a valid option.";
        }

        break; // Break after one iteration
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Cookie Example - Menu Driven</title>
</head>
<body>
    <h2>PHP Cookie Example (Menu Driven)</h2>

    <form method="post">
        <label>Select Operation:</label><br>
        <input type="radio" name="choice" value="1"> Set Cookie<br>
        <input type="radio" name="choice" value="2"> Check Cookie<br>
        <input type="radio" name="choice" value="3"> Delete Cookie<br>
        <input type="radio" name="choice" value="4"> Exit<br><br>

        <input type="submit" name="submit" value="Submit">
    </form>

    <?php
    if($message != ""){
        echo "<h3>$message</h3>";
    }
    ?>
</body>
</html>
