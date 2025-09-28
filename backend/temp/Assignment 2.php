<?php
/*
Q2. Write a program to show the usage of switch-case and for/while/do while loop to create a menu driven program for calculator
*/

$result = "";

if(isset($_POST['submit'])){
    $num1 = $_POST['num1'];
    $num2 = $_POST['num2'];
    $choice = $_POST['choice'];

    switch($choice){
        case "1":
            $result = $num1 + $num2;
            break;
        case "2":
            $result = $num1 - $num2;
            break;
        case "3":
            $result = $num1 * $num2;
            break;
        case "4":
            if($num2 != 0){
                $result = $num1 / $num2;
            } else {
                $result = "Error: Division by zero!";
            }
            break;
        default:
            $result = "Invalid choice!";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Simple Calculator</title>
</head>
<body>
    <h2>Simple Calculator</h2>
    <form method="post">
        <label>First Number:</label>
        <input type="number" name="num1" required><br><br>

        <label>Second Number:</label>
        <input type="number" name="num2" required><br><br>

        <label>Choose Operation:</label>
        <select name="choice">
            <option value="1">Addition</option>
            <option value="2">Subtraction</option>
            <option value="3">Multiplication</option>
            <option value="4">Division</option>
        </select><br><br>

        <input type="submit" name="submit" value="Calculate">
    </form>

    <?php
    if($result !== ""){
        echo "<h3>Result: $result</h3>";
    }
    ?>
</body>
</html>
