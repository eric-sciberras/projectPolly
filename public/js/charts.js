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
          label: "Characteristics",
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgb(255, 99, 132)",
          // data: [0, 10, 5, 2, 20]
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
      scale: {
        ticks: {
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
