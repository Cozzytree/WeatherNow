import * as model from "./model.js";
import * as element from "./helperss.js";

const locale = navigator.language;

//* Loading spinner
const spinner = `<div class="spinner"></div>`;
element.weatherContents.innerHTML = "";
element.weatherContents.insertAdjacentHTML("afterbegin", spinner);

//* render weather
const renderCurrentWeather = async function () {
  try {
    await model.API_Call();
    console.log(model.State);

    const html = `
            <div class="weather--image">
              <img src="${
                model.State.weatherData.current.condition.icon
              }" alt="${
      model.State.weatherData.current.condition.text
    }" width="150px"/>
              <p>${model.State.weatherData.current.condition.text}
            </div>

            <div class="temperature">
              <div class="temp--text temperature--C">${
                model.State.weatherData.current.temp_c
              } °C</div>
              <div class="temp--text temperature--F hidden">${
                model.State.weatherData.current.temp_f
              } °F</div>
              <div class="temperature--toggle">
                <span class="toggle--F">F</span>|<span class="toggle--C">C</span>
              </div>
            </div>

            <div class="last--updated">Last Updated : ${Intl.DateTimeFormat(
              locale,
              { dateStyle: "medium", timeStyle: "medium" }
            ).format(
              new Date(model.State.weatherData.current.last_updated)
            )}</div>

            <div class="weather--region">
              <p>${model.State.weatherData.location.country}, ${
      model.State.weatherData.location.region
    }, ${model.State.weatherData.location.name}</p>
              <p>Time-Zone : ${model.State.weatherData.location.tz_id}</p>
            </div>

            <div class="weather--information"> 
                <p>feelslike: ${
                  model.State.weatherData.current.feelslike_c
                } °c</p>
                <p>feelslike: ${
                  model.State.weatherData.current.feelslike_f
                } °f</p>
                <p>Humidity: ${model.State.weatherData.current.humidity}</p>
                <p>Precipitation in inches : ${
                  model.State.weatherData.current.precip_in
                }</p>
                <p>Precipitation in mm : ${
                  model.State.weatherData.current.precip_mm
                }</p>
                <p>Wind Kph : ${model.State.weatherData.current.wind_kph}</p>
                <p>Wind mph : ${model.State.weatherData.current.wind_mph}</p>
                <p>Wind direction : ${
                  model.State.weatherData.current.wind_dir
                }</p>
                <p>UV index : ${model.State.weatherData.current.uv}</p>
            </div>
      `;
    element.weatherContents.innerHTML = "";
    element.weatherContents.insertAdjacentHTML("afterbegin", html);

    toggleTemperature("F", "F", "C");
    toggleTemperature("C", "C", "F");
  } catch (err) {
    element.container.innerHTML = "";
    element.container.insertAdjacentHTML(
      "afterbegin",
      element.errorWindow(err.message)
    );
  }
};

const toggleTemperature = function (Btn, appear, hide) {
  element.weatherContents.addEventListener("click", function (e) {
    const btn = e.target.closest(`.toggle--${Btn}`);
    if (!btn) return;
    const removeHidden = document.querySelector(`.temperature--${appear}`);
    const addHidden = document.querySelector(`.temperature--${hide}`);
    removeHidden.classList.remove("hidden");
    addHidden.classList.add("hidden");
  });
};

//* render forecast
const renderForecast = async function () {
  await model.API_Call();
  const Forecasts = await model.State.weatherData.forecast.forecastday;
  // console.log(Forecasts);

  Forecasts.map((e, i) => {
    const html = `
    <div class="forecasts--days forecasts--days${i}">
       <div class="forecast--date">${Intl.DateTimeFormat(locale, {
         dateStyle: "short",
         timeStyle: "medium",
       }).format(new Date(e.date))}</div>
      <div class="forecast--condition"> <img class="forecast--image" src="${
        e.day.condition.icon
      }" alt="" width="80px">
         <p>${e.day.condition.text}</p>
       </div>
       <div class="forecast--details">
            <p>Average Humidity : ${e.day.avghumidity}</p>
            <p>Average temp : ${e.day.avgtemp_c} °c</p>
            <p>Average temp : ${e.day.avgtemp_f} °f</p>
            <p>Max temp : ${e.day.maxtemp_c} °c</p>
            <p>Max temp : ${e.day.maxtemp_f} °f</p>
            <p>Min temp : ${e.day.mintemp_c} °c</p>
            <p>Min temp : ${e.day.mintemp_f} °f</p>
            <p>Max wind : ${e.day.maxwind_kph} kph</p>
            <p>Max wind : ${e.day.maxwind_mph} mph</p>
            <p>Chances of rain : ${e.day.daily_chance_of_rain}</p>
            <p>UV Index : ${e.day.uv}</p>
       </div>
    </div>
    `;

    //* render dom
    element.weatherForecast.insertAdjacentHTML("beforeend", html);

    //* remove all charts
    element.ChartElement.forEach((e) => (e.style.opacity = 0));

    document
      .querySelector(`.forecasts--days${i}`)
      .addEventListener("click", function () {
        //* remove all charts
        element.ChartElement.forEach((e) => (e.style.opacity = 0));

        //*render specific charts
        document.querySelector(`[data-chart="${i}"]`).style.opacity = 1;
      });
  });
};

//* Charts Data
const RenderCharts = async function () {
  await model.API_Call();

  const chartConfigs = [
    { day: model.State.weatherData.forecastHours[0], elementId: "#chart1" },
    { day: model.State.weatherData.forecastHours[1], elementId: "#chart2" },
    { day: model.State.weatherData.forecastHours[2], elementId: "#chart3" },
  ];

  chartConfigs.forEach(({ day, elementId }, index) => {
    const dayTime = day.hour.map((h) =>
      Intl.DateTimeFormat("en-IN", { timeStyle: "short" }).format(
        new Date(h.time)
      )
    );
    const dayTemp = day.hour.map((t) => t.temp_c);

    element.Charts(dayTemp, dayTime, elementId);
  });
};

function init() {
  renderCurrentWeather();
  renderForecast();
  RenderCharts();
}
init();
