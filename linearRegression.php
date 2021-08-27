<?php

require_once 'vendor/autoload.php';
use Rubix\ML\Datasets\Labeled;
use Rubix\ML\Regressors\Ridge;
use Rubix\ML\CrossValidation\Metrics\RMSE;
use Rubix\ML\CrossValidation\HoldOut;
use Rubix\ML\Datasets\Unlabeled;


if ($_SERVER["REQUEST_METHOD"] == "POST") 
{

    // Receveing the parameters
    $str_xvalues = $_POST['xvalues'];
    $str_yvalues = $_POST['yvalues'];
    // Converting to an array of integers 
    $xvalues = [];
    $yvalues = [];
    for ($i = 0; $i < count($str_xvalues); $i++)
    {
        $xvalues[] = floatval($str_xvalues[$i]);
        $yvalues[] = floatval($str_yvalues[$i]);
    }
    

    // Starting the ML models
    $dataset = new Labeled($xvalues, $yvalues);
    $model = new Ridge(2.0);
    $validator = new HoldOut(0.2);  // Para validacao 80-20
    // Training the model
    $model->train($dataset);

    // Availaing the model in training set
    $metric = new RMSE();
    $score = $validator->test($model, $dataset, $metric);

    // Making the predictions and generating the data
    $dataset = new Unlabeled($xvalues);
    $yhat = $model->predict($dataset);

    // Make the file for javascript manipulation
    $response = [];
    $response['score'] = $score;
    $response['predictions'] = $yhat;
    $response['a'] = json_encode($model->coefficients());
    $response['b'] = json_encode($model->bias());

    echo json_encode($response);


}