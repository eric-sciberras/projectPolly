function radarChartConstructor(averageRatings) {
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
            averageRatings != null ? averageRatings.trustworthy : "0",
            averageRatings != null ? averageRatings.accountable : "0",
            averageRatings != null ? averageRatings.empathetic : "0",
            averageRatings != null ? averageRatings.knowledgeable : "0",
            averageRatings != null ? averageRatings.respectful : "0"
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

Chart.plugins.register({
  afterDraw: function(chart) {
    if (chart.data.datasets[0].data.length == 0) {
      // No data is present
      var ctx = chart.chart.ctx;
      var width = chart.chart.width;
      var height = chart.chart.height;
      chart.clear();

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "16px normal 'Helvetica Nueue'";
      ctx.fillText("No data to display", width / 2, height / 2);
      ctx.restore();
    }
  }
});

function doughnutChartConstructor(promise, index) {
  jQuery.get("/promiseData", { promiseId: promise._id }, results => {
    var ctx = document.getElementById("promiseChart" + index).getContext("2d");
    var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "pie",

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
            data: results
          }
        ]
      },
      // Configuration options go here
      options: {}
    });
  });
}

function rangeToValue(value) {
  if (value == null || value == -1) {
    return "Off";
  }
  return value;
}
