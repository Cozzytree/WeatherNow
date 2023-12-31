export const weatherContents = document.querySelector(".weather");
export const weatherForecast = document.querySelector(".weather--forecast");
export const ChartElement = document.querySelectorAll(".charts");
export const container = document.querySelector(".container");

export const Charts = function (yAxis, xAxis, id) {
  const options = {
    chart: {
      type: "line",
    },
    stroke: {
      curve: "straight",
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#333"],
      },
      offsetX: 20,
    },
    markers: {
      size: 0.2,
    },
    series: [
      {
        name: "°C",
        data: yAxis,
      },
    ],
    xaxis: {
      categories: xAxis,
    },
  };

  const chart = new ApexCharts(document.querySelector(id), options);

  chart.render();
};

export const errorWindow = function (err) {
  return ` 
      <div class="error--window">
          <h6>${err}</h6>
      </div>`;
};
