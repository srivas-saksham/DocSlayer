<?php
// Original float
$floatVal = 45.78;
echo "Original float: $floatVal<br>";

// Casting float to int
$intVal = (int)$floatVal;
echo "After casting to int: $intVal<br>";

// String to array
$str = "PHP";
$arrayVal = (array)$str;
echo "String to array: ";
print_r($arrayVal);
echo "<br>";

// Boolean to integer
$boolVal = true;
$boolToInt = (int)$boolVal;
echo "Boolean to int: $boolToInt<br>";

// Integer to string
$num = 100;
$numToStr = (string)$num;
echo "Int to string: \"$numToStr\" (" . gettype($numToStr) . ")";
?>
