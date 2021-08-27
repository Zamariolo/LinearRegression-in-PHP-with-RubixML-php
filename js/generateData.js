function initializeChart(scatter_data, ml_data)
{
    // Limpa grafico anterior, se houver
    document.querySelector("#chart_regression").innerHTML = "";

    // Dados e configuracoes
    var options = {
        series: [
        {
            name: 'Dado gerado',
            type: 'scatter',
            data: scatter_data,
            xaxis: {type: 'numeric'}
        },
        
        {
        name: 'Regressão Linear',
        type: 'line',
        data: ml_data
      }],
        chart: {
        height: 350,
        type: 'line',
      },
      fill: {
        type:'solid',
      },
      markers: {
        size: [6, 0]
      },
      tooltip: {
        shared: false,
        intersect: true,
      },
      legend: {
        show: false
      },
      xaxis: {
        type: 'numeric',
      }
      };



    // Gera o grafico
    var chart = new ApexCharts(document.querySelector("#chart_regression"), options);
    chart.render();

}


$(document).ready(function() {

    // #############################
    // FUNCTIONS
    // #############################

    

    function populateChart()
    {
        console.log("Populando o gráfico...")
    }

    function generateData()
    {
        // Get input values
        var a = $("#input_a").val();
        var b = $("#input_b").val();
        var dataQntd = $("#input_dataQuantity").val();

        if (a == "" || b == "")
        {
            alert("The equation parameters are empty or mistyped =(");
        }
        else if (dataQntd<0 || dataQntd=="")
        {
            alert("Insira uma quantidade de dados positiva!");
        }
        else
        {

            // 1. Send request and receive the data
            var post_url = "generateData.php";
            $.post(post_url, {parameter_a: a, parameter_b: b, dataQuantity: dataQntd}, 
                function(response)
                {
                    // 2. Convert response to json
                    var resposta = JSON.parse(response);

                    // 3. Initialize chart
                    // 3.1 - Convert to Apexcharts data format
                    var x_val = Object.keys(resposta);
                    var y_val = Object.values(resposta);
                    scatter_data = []
                    for (var i=0; i<x_val.length; i++)
                    {
                        scatter_data.push([parseFloat(x_val[i]), y_val[i]]);
                    }

                    window.scatterData = resposta;
                    window.graphScatterData = scatter_data;
                    window.scatterXData = x_val;

                    // 3.2 - Initialize chart
                    initializeChart(scatter_data, []);
                });
        }


    }

    function getLinearRegressionData()
    {
        var scatterData = window.scatterData;

        // Verify if there is data generated
        if (window.scatterData.length == 0)
        {
            alert("Generate data first!");
            return 0;
        }

        //  Se houver dados para a regressao, vai continuar por aqui

        // Separando em valores de x e y
        var xvalues = Object.keys(window.scatterData);
        var yvalues = Object.values(window.scatterData);

        // Send ajax request
        var post_url = "linearRegression.php";
        $.post(post_url, {xvalues: xvalues, yvalues: yvalues}, 
            function(response)
            {
                console.log(response);
                var resposta = JSON.parse(response);

                // Get response values
                var a = resposta['a'];
                var b = resposta['b'];
                var score = resposta['score'];
                var yhat = resposta['predictions'];

                // Clear the results
                document.querySelector("#div_results").innerHTML = "";

                // Show Score
                score_element = document.createElement('p');
                score_element.innerHTML = "RMSE: " + score;
                document.querySelector("#div_results").appendChild(score_element);
                // Show coefficients
                coef_element = document.createElement("p");
                coef_element.innerHTML = "Coefs: " + String(a);
                document.querySelector("#div_results").appendChild(coef_element);
                // Show bias
                bias_element = document.createElement("p");
                bias_element.innerHTML = "Bias: " + String(b);
                document.querySelector("#div_results").appendChild(bias_element);
                // Update chart

                // Generating the data
                var x_val = window.scatterXData;
                ml_data = []
                for (var i=0; i<x_val.length; i++)
                {
                    ml_data.push([parseFloat(x_val[i]), yhat[i]]);
                }
                
                initializeChart(window.graphScatterData, ml_data);



                console.log(resposta);
                console.log(resposta['score']);


            });

    }

    // #############################
    // INICIANDO A APLICACAO
    // #############################
    window.scatterData = [];
    window.regressionData = [];


    // #############################
    // Escutadores de eventos
    // #############################

    $('#btn_generateData').on("click", function(){generateData();});
    $('#btn_linearRegression').on("click", function(){getLinearRegressionData();});

});