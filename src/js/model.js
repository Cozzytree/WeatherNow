export const State = {
  weatherData: {},
};

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(() => {
      reject("Timeout");
    }, sec);
  });
};

export const API_Call = async function () {
  try {
    // Get the current position and wait for it to be resolved
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve, // Resolve with the position object
        reject // Reject with any errors
      );
    });

    const { latitude, longitude } = position.coords;

    const apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=5fc1bf037a934e1286533936232608&q=${latitude},${longitude}&days=3&aqi=no&alerts=no`;

    const res = await Promise.race([fetch(apiUrl), timeout(100000)]);

    const data = await res.json();

    State.weatherData = {
      current: data.current,
      forecast: data.forecast,
      location: data.location,
      forecastHours: data.forecast.forecastday,
    };
  } catch (err) {
    throw err;
  }
};
