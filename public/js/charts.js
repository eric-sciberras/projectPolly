// import { promises } from "fs";

// window.onload = radarChartConstructor;

function radarChartConstructor(politician) {
  var ctx = document.getElementById("characteristicsChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "radar",
    // The data for our dataset
    data: {
      labels: [
        "Trustworthy",
        "Accountable",
        "Empathetic",
        "Knowledgeable",
        "Respectful"
      ],
      datasets: [
        {
          backgroundColor: "rgba(66,139,202,.5)",
          borderColor: "rgba(66,139,202,.5)",
          data: [
            politician.averageTrustworthy,
            politician.averageAccountable,
            politician.averageEmpathetic,
            politician.averageKnowledgeable,
            politician.averageRespectful
          ]
        }
      ]
    },

    // Configuration options go here
    options: {
      legend: {
        // fontSize: 20,
        display: false
      },
      tooltips: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.yLabel;
          }
        }
      },
      scale: {
        ticks: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 10
        }
      }
    }
  });
}

function generateDoughnutCharts(promisesMade) {
  for (let index = 0; index < promisesMade.length; index++) {
    doughnutChartConstructor(promisesMade[index], index);
  }
}

function doughnutChartConstructor(promise, index) {
  var ctx = document.getElementById("promiseChart" + index).getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "doughnut",

    // The data for our dataset
    data: {
      labels: ["Delivered", "Partially Delivered", "Broken"],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: [
            "rgb(40,167,69)",
            "rgb(255,193,7)",
            "rgb(220,53,69)"
          ],
          //borderColor: "rgb(255, 99, 132)",
          data: [40, 10, 5]
          // data: [
          //   politician.delivered,
          //   politician.partiallyDelivered,
          //   politician.broken
          // ]
        }
      ]
    },
    // Configuration options go here
    options: {}
  });
}

function rangeToValue(value) {
  if (value == -1) {
    return "Off";
  }
  return value;
}
