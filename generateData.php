<?php

function generateArange(int $quantity): array
{
    $step = 100/$quantity;
    $npArange = range($step, 100, $step);
    return $npArange;
}

function generateData(array $npArange, float $a, float $b): array
{
    // 1. Generate the x values
    $list_x = [];
    foreach ($npArange as $x)
    {
        $list_x[] = $x + rand(1,40);
    }

    // 2. Generate the y values
    $list_y = [];
    foreach ($list_x as $x)
    {
        $list_y[] = $a*$x + $b+ rand(1,40);
    }

    // 3. Join list_x and list_y in an associative array $data
    $data = [];
    for ($i = 0; $i < count($list_x); $i++)
    {
        // echo $list_x[$i] . " | ";
        // echo $list_y[$i] . PHP_EOL;
        $data[$list_x[$i]] = $list_y[$i];
    }
    
    return $data;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    // Receveing the data
    $a = floatval($_POST['parameter_a']);
    $b = floatval($_POST['parameter_b']);
    $dataQuantity = intval($_POST['dataQuantity']);

    // Steps:
    // 1. Generate a range of numbers between 0 and 100 with $dataQuantity points
    // 2. Generate the x and y of data
    // 3. Return data

    // Step 1 - Generating the range
    $npArange = generateArange($dataQuantity);
    // Step 2 - Generating the data
    $data = generateData($npArange, $a, $b);
    // Step 3 - Return data
    echo json_encode($data);
}