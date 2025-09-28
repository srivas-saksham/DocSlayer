<?php
/*
Q4. Menu-driven program to implement Array-pad(), array_slice(), array_splice(), list() functions.
*/

$result = "";

if(isset($_POST['submit'])){
    // Get input array from form (comma-separated)
    $input = $_POST['array'];
    $arr = explode(",", $input); // convert to array
    $continue = true;
    $output = ""; // store results for display

    while($continue){
        $choice = $_POST['choice'] ?? "";

        switch($choice){
            case "1": // array_pad
                $padded = array_pad($arr, 7, "X");
                $output = "Array after array_pad (length 7, pad with 'X'):<br>";
                foreach($padded as $value) $output .= $value . " ";
                break;

            case "2": // array_slice
                $sliced = array_slice($arr, 1, 3);
                $output = "Array after array_slice (3 elements from index 1):<br>";
                foreach($sliced as $value) $output .= $value . " ";
                break;

            case "3": // array_splice
                $splice_arr = $arr; // copy array
                array_splice($splice_arr, 2, 2, ["Y","Z"]);
                $output = "Array after array_splice (replace 2 elements at index 2 with 'Y','Z'):<br>";
                foreach($splice_arr as $value) $output .= $value . " ";
                break;

            case "4": // list()
                list($first, $second) = $arr;
                $output = "Using list() to get first two elements:<br>";
                $output .= "First: $first, Second: $second";
                break;

            case "5": // Exit
                $continue = false;
                $output = "Exited menu.";
                break;

            default:
                $output = "Please select a valid option.";
        }

        break; // break the while after processing choice once
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Array Functions Demo - Menu Driven</title>
</head>
<body>
    <h2>Array Functions Demo (Menu Driven)</h2>

    <form method="post">
        <label>Enter array elements (comma-separated):</label>
        <input type="text" name="array" required value="<?php echo $_POST['array'] ?? ''; ?>"><br><br>

        <label>Select operation:</label><br>
        <input type="radio" name="choice" value="1"> Array Pad<br>
        <input type="radio" name="choice" value="2"> Array Slice<br>
        <input type="radio" name="choice" value="3"> Array Splice<br>
        <input type="radio" name="choice" value="4"> List<br>
        <input type="radio" name="choice" value="5"> Exit<br><br>

        <input type="submit" name="submit" value="Submit">
    </form>

    <?php if(isset($arr)) { ?>
        <h3>Original Array:</h3>
        <?php foreach($arr as $value) echo $value . " "; ?>

        <h3>Result:</h3>
        <?php echo $output; ?>
    <?php } ?>
</body>
</html>
