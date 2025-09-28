<?php
/*
Q3. Menu-driven program to perform all types of array sorting
*/

if(isset($_POST['submit'])){
    // Input array (comma-separated)
    $input = $_POST['numbers'];
    $numbers = array_map('trim', explode(",", $input)); // Convert to array

    // Associative array (predefined for demonstration)
    $assoc = array("a"=>3, "b"=>1, "c"=>4, "d"=>2);

    $continue = true;
    $output = "";

    while($continue){
        $choice = $_POST['choice'] ?? "";

        switch($choice){
            case "1": // Ascending sort
                $asc = $numbers;
                sort($asc);
                $output = "Ascending Sort: ";
                $output .= implode(", ", $asc);
                break;

            case "2": // Descending sort
                $desc = $numbers;
                rsort($desc);
                $output = "Descending Sort: ";
                $output .= implode(", ", $desc);
                break;

            case "3": // Associative sort by values ascending
                $assoc_copy = $assoc;
                asort($assoc_copy);
                $output = "Associative Array Ascending by values: ";
                foreach($assoc_copy as $k => $v) $output .= "$k=>$v, ";
                $output = rtrim($output, ", ");
                break;

            case "4": // Associative sort by values descending
                $assoc_copy = $assoc;
                arsort($assoc_copy);
                $output = "Associative Array Descending by values: ";
                foreach($assoc_copy as $k => $v) $output .= "$k=>$v, ";
                $output = rtrim($output, ", ");
                break;

            case "5": // Sort by keys ascending
                $assoc_copy = $assoc;
                ksort($assoc_copy);
                $output = "Associative Array Ascending by keys: ";
                foreach($assoc_copy as $k => $v) $output .= "$k=>$v, ";
                $output = rtrim($output, ", ");
                break;

            case "6": // Sort by keys descending
                $assoc_copy = $assoc;
                krsort($assoc_copy);
                $output = "Associative Array Descending by keys: ";
                foreach($assoc_copy as $k => $v) $output .= "$k=>$v, ";
                $output = rtrim($output, ", ");
                break;

            case "7": // Exit
                $continue = false;
                $output = "Exited menu.";
                break;

            default:
                $output = "Please select a valid option.";
        }

        break; // Break the while loop after processing choice once
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Array Sorting Demo - Menu Driven</title>
</head>
<body>
    <h2>Array Sorting Demo (Menu Driven)</h2>

    <form method="post">
        <label>Enter numbers (comma-separated):</label>
        <input type="text" name="numbers" required value="<?php echo $_POST['numbers'] ?? ''; ?>"><br><br>

        <label>Select sorting operation:</label><br>
        <input type="radio" name="choice" value="1"> Sort Numbers Ascending<br>
        <input type="radio" name="choice" value="2"> Sort Numbers Descending<br>
        <input type="radio" name="choice" value="3"> Associative Ascending by values<br>
        <input type="radio" name="choice" value="4"> Associative Descending by values<br>
        <input type="radio" name="choice" value="5"> Associative Ascending by keys<br>
        <input type="radio" name="choice" value="6"> Associative Descending by keys<br>
        <input type="radio" name="choice" value="7"> Exit<br><br>

        <input type="submit" name="submit" value="Submit">
    </form>

    <?php if(isset($numbers)) { ?>
        <h3>Original Array:</h3>
        <?php echo implode(", ", $numbers); ?>

        <h3>Associative Array:</h3>
        <?php foreach($assoc as $k=>$v) echo "$k=>$v, "; ?>

        <h3>Result:</h3>
        <?php echo $output; ?>
    <?php } ?>
</body>
</html>
