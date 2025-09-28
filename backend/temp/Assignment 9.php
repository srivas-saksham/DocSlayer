<?php
/*
Q9. Menu-driven PHP Session Visit Counter
*/

session_start();

$message = "";

// Initialize visit count if not set
if(!isset($_SESSION['visits'])){
    $_SESSION['visits'] = 0;
}

if(isset($_POST['submit'])){
    $choice = $_POST['choice'] ?? "";
    $continue = true;

    while($continue){
        switch($choice){
            case "1": // View Visit Count
                $_SESSION['visits']++; // Increment visit count
                $message = "You have visited this page <b>" . $_SESSION['visits'] . "</b> times in this session.";
                break;

            case "2": // Reset Visit Count
                $_SESSION['visits'] = 0;
                $message = "Visit count has been reset.";
                break;

            case "3": // Exit
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
    <title>Session Visit Counter - Menu Driven</title>
</head>
<body>
    <h2>PHP Session Visit Counter (Menu Driven)</h2>

    <form method="post">
        <label>Select Operation:</label><br>
        <input type="radio" name="choice" value="1"> View Visit Count<br>
        <input type="radio" name="choice" value="2"> Reset Visit Count<br>
        <input type="radio" name="choice" value="3"> Exit<br><br>

        <input type="submit" name="submit" value="Submit">
    </form>

    <?php
    if($message != ""){
        echo "<h3>$message</h3>";
    }
    ?>
</body>
</html>
