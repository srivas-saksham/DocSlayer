<?php
$value = "100"; // String containing number

// Before addition
echo "Before addition: " . gettype($value) . "<br>";

// Adding string to integer
$result = $value + 50; // PHP will convert string to number automatically

// After addition
echo "After addition: " . gettype($result) . "<br>";
echo "Result: $result";
?>
