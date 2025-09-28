<?php
/*
Q5. Menu-driven Login Form Validation using PHP
*/

$message = "";

// Predefined credentials for demo
$valid_username = "user123";
$valid_password = "Pass@123";

if(isset($_POST['submit'])){
    $continue = true;
    $choice = $_POST['choice'] ?? "";

    while($continue){
        switch($choice){
            case "1": // Login validation
                // Using $_REQUEST to get data
                $username = $_REQUEST['username'] ?? "";
                $password = $_REQUEST['password'] ?? "";

                // Validate username: only letters and numbers, 3-15 characters
                if(!preg_match("/^[a-zA-Z0-9]{3,15}$/", $username)){
                    $message = "Invalid username! Only letters/numbers, 3-15 chars.";
                }
                // Validate password: at least 6 chars, must include letters & numbers
                elseif(!preg_match("/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&+=]{6,}$/", $password)){
                    $message = "Invalid password! Must be at least 6 chars with letters & numbers.";
                }
                // Check credentials
                elseif($username == $valid_username && $password == $valid_password){
                    $message = "Login successful! Welcome $username.";
                } else {
                    $message = "Login failed! Incorrect username or password.";
                }
                break;

            case "2": // Display credential rules
                $message = "Username: 3-15 chars, letters & numbers only.<br>";
                $message .= "Password: At least 6 chars, must include letters & numbers.";
                break;

            case "3": // Exit
                $continue = false;
                $message = "Exited menu.";
                break;

            default:
                $message = "Please select a valid option.";
        }

        break; // break the while loop after processing choice once
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Login Form - Menu Driven</title>
</head>
<body>
    <h2>Login Form (Menu Driven)</h2>

    <form method="post">
        <label>Select Operation:</label><br>
        <input type="radio" name="choice" value="1"> Login Validation<br>
        <input type="radio" name="choice" value="2"> View Credential Rules<br>
        <input type="radio" name="choice" value="3"> Exit<br><br>

        <div id="loginFields" style="margin-bottom:10px;">
            <label>Username:</label>
            <input type="text" name="username"><br><br>

            <label>Password:</label>
            <input type="password" name="password"><br><br>
        </div>

        <input type="submit" name="submit" value="Submit">
    </form>

    <?php
    if($message != ""){
        echo "<h3>$message</h3>";
    }
    ?>

    <script>
        // Hide username/password fields unless "Login Validation" is selected
        const choiceInputs = document.querySelectorAll('input[name="choice"]');
        const loginFields = document.getElementById('loginFields');

        choiceInputs.forEach(input => {
            input.addEventListener('change', () => {
                if(input.value === "1") loginFields.style.display = "block";
                else loginFields.style.display = "none";
            });
        });

        // Initially hide fields if no selection
        window.onload = () => { loginFields.style.display = "none"; }
    </script>
</body>
</html>
