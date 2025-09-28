<?php
/*
Q1. Write a regular expression including modifiers, operators and Metacharacters (Menu driven)
*/

$result = "";

if(isset($_POST['submit'])){
    $choice = $_POST['choice'];
    $input = $_POST['input'];

    switch($choice){
        case 1: // ^ and $ (start and end)
            if(preg_match("/^hello$/", $input)){
                $result = "Matched exactly 'hello'";
            } else {
                $result = "No match";
            }
            break;

        case 2: // . (any single character)
            if(preg_match("/h.llo/", $input)){
                $result = "Matched pattern h.llo (any single char in place of .)";
            } else {
                $result = "No match";
            }
            break;

        case 3: // * and + (zero or more, one or more)
            if(preg_match("/ab*c/", $input)){
                $result = "Matched pattern ab*c (zero or more b)";
            } elseif(preg_match("/ab+c/", $input)){
                $result = "Matched pattern ab+c (one or more b)";
            } else {
                $result = "No match";
            }
            break;

        case 4: // | OR and () grouping
            if(preg_match("/cat|dog/", $input)){
                $result = "Matched cat or dog";
            } elseif(preg_match("/(red|blue)car/", $input)){
                $result = "Matched redcar or bluecar";
            } else {
                $result = "No match";
            }
            break;

        case 5: // Modifiers i, m, s
            if(preg_match("/hello/i", $input)){
                $result = "Matched 'hello' case-insensitive (i)";
            } elseif(preg_match("/^start/m", $input)){
                $result = "Matched 'start' at beginning of line (m)";
            } elseif(preg_match("/first.*last/s", $input)){
                $result = "Matched across lines using dotall (s)";
            } else {
                $result = "No match with modifiers";
            }
            break;

        default:
            $result = "Please select a valid option.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Regex Menu Driven Program</title>
</head>
<body>
    <h2>Regex Menu Driven Program</h2>

    <form method="post">
        <label>Select Option:</label>
        <select name="choice">
            <option value="1">^ and $ (Start/End of string)</option>
            <option value="2">. (Any single character)</option>
            <option value="3">* and + (Zero or more, One or more)</option>
            <option value="4">| (OR) and () grouping</option>
            <option value="5">Modifiers: i, m, s</option>
        </select><br><br>

        <label>Enter Input:</label>
        <input type="text" name="input" required><br><br>

        <input type="submit" name="submit" value="Check">
    </form>

    <?php
        if($result != ""){
            echo "<h3>Result: $result</h3>";
        }
    ?>
</body>
</html>
