// window.onload = radarChartConstructor;

function radarChartConstructor(politician) {
  // console.log(politician);
  var ctx = document.getElementById("myChart").getContext("2d");
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

function barChartConstructor(elementId, promise) {
  var ctx = document.getElementById(elementId).getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "doughnut",

    // The data for our dataset
    data: {
      labels: ["Delivered", "Partially Delivered", "Broken"],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          // data: [0, 10, 5, 2, 20]
          data: [
            politician.delivered,
            politician.partiallyDelivered,
            politician.broken
          ]
        }
      ]
    },
    // Configuration options go here
    options: {}
  });
}

function rangeToValue(value) {
  console.log("HERE");
  if (value == -1) {
    return "Off";
  }
  return value;
}
