<?php
/*
Q7. Menu-driven Form Validation using filter_var() in PHP
*/

$message = "";

// Process form data when submitted
if(isset($_POST['submit'])){
    $name = $_POST['name'] ?? "";
    $email = $_POST['email'] ?? "";
    $age = $_POST['age'] ?? "";
    $url = $_POST['url'] ?? "";
    $choice = $_POST['choice'] ?? "";
    $continue = true;

    while($continue){
        switch($choice){
            case "1": // Validate Name
                if(!filter_var($name, FILTER_SANITIZE_STRING) || !preg_match("/^[a-zA-Z ]*$/", $name)){
                    $message = "Invalid name! Only letters and spaces allowed.";
                } else {
                    $message = "Valid name!";
                }
                break;

            case "2": // Validate Email
                if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
                    $message = "Invalid email format!";
                } else {
                    $message = "Valid email!";
                }
                break;

            case "3": // Validate Age
                if(!filter_var($age, FILTER_VALIDATE_INT, array("options"=>array("min_range"=>1, "max_range"=>120)))){
                    $message = "Invalid age! Must be a number between 1 and 120.";
                } else {
                    $message = "Valid age!";
                }
                break;

            case "4": // Validate URL
                if(!filter_var($url, FILTER_VALIDATE_URL)){
                    $message = "Invalid URL!";
                } else {
                    $message = "Valid URL!";
                }
                break;

            case "5": // Validate All
                $errors = "";
                if(!filter_var($name, FILTER_SANITIZE_STRING) || !preg_match("/^[a-zA-Z ]*$/", $name)){
                    $errors .= "Invalid name! Only letters and spaces allowed.<br>";
                }
                if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
                    $errors .= "Invalid email format!<br>";
                }
                if(!filter_var($age, FILTER_VALIDATE_INT, array("options"=>array("min_range"=>1, "max_range"=>120)))){
                    $errors .= "Invalid age! Must be 1-120.<br>";
                }
                if(!filter_var($url, FILTER_VALIDATE_URL)){
                    $errors .= "Invalid URL!<br>";
                }
                $message = $errors == "" ? "All inputs are valid. Form submitted successfully!" : $errors;
                break;

            case "6": // Exit
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
    <title>Filter_var Form Validation - Menu Driven</title>
</head>
<body>
    <h2>Form Validation Example (Menu Driven)</h2>

    <form method="post">
        <label>Select Validation Operation:</label><br>
        <input type="radio" name="choice" value="1"> Validate Name<br>
        <input type="radio" name="choice" value="2"> Validate Email<br>
        <input type="radio" name="choice" value="3"> Validate Age<br>
        <input type="radio" name="choice" value="4"> Validate URL<br>
        <input type="radio" name="choice" value="5"> Validate All Fields<br>
        <input type="radio" name="choice" value="6"> Exit<br><br>

        <div id="formFields" style="margin-bottom:10px;">
            <label>Name:</label>
            <input type="text" name="name"><br><br>

            <label>Email:</label>
            <input type="text" name="email"><br><br>

            <label>Age:</label>
            <input type="number" name="age"><br><br>

            <label>Website URL:</label>
            <input type="text" name="url"><br><br>
        </div>

        <input type="submit" name="submit" value="Submit">
    </form>

    <?php
    if($message != ""){
        echo "<h3>$message</h3>";
    }
    ?>

    <script>
        // Show/hide form fields based on choice
        const choiceInputs = document.querySelectorAll('input[name="choice"]');
        const formFields = document.getElementById('formFields');

        choiceInputs.forEach(input => {
            input.addEventListener('change', () => {
                if(input.value !== "6") formFields.style.display = "block";
                else formFields.style.display = "none";
            });
        });

        window.onload = () => { formFields.style.display = "none"; }
    </script>
</body>
</html>
