const FORECAST_URL =
  "https://api-cuaca-karimun.netlify.app/.netlify/functions/api/cuaca?kab=Kab.%20Cilacap";

let FORECAST_DATA = [];
function getForecastClock() {
  const date = new Date();
  let bulan = formatNumber(date.getMonth() + 1);
  let tahun = formatNumber(date.getFullYear());
  let hari = formatNumber(date.getDate());
  let fdate = `${tahun}-${bulan}-${hari}`;
  let rdate = " ";

  //GET SHOW forecast clock
  const hourRow = [0, 3, 6, 9, 12, 15, 18, 21, 24];
  let showtime;
  let isAM = "am";
  hourRow.forEach((item) => {
    let interval = item - date.getHours();
    if (date.getHours() <= item && interval < 3) {
      showtime = item;
    }
  });
  if (showtime > 15 && showtime < 24) {
    isAM = "pm";
  }
  if (showtime == 24) {
    const sumDate = date.setDate(date.getDate() + 1);
    const newDate = new Date(sumDate);
    fdate = `${formatNumber(newDate.getFullYear())}-${formatNumber(
      newDate.getMonth() + 1
    )}-${formatNumber(newDate.getDate())}`;
    rdate = `${formatNumber(newDate.getDate())}-${formatNumber(
      newDate.getMonth() + 1
    )}-${formatNumber(newDate.getFullYear())}`;
    showtime = 0;
  }

  let result = {
    date: fdate,
    r_date: rdate,
    show: `${formatNumber(showtime)}:00`,
    is_am: isAM,
  };
  return result;
}
function renderForecast(fdata = FORECAST_DATA) {
  const forecastCard = document.getElementById("forecast-slider");
  forecastCard.innerHTML = "";
  fdata.forEach((item) => {
    item.cuaca.forEach((dcuaca) => {
      let datetime = dcuaca.$.date;
      let arr_datetime = datetime.split(" ");
      let now = getForecastClock(arr_datetime);
      if (datetime == `${now.date} ${now.show}`) {
        const html = `
        <div class="swiper-slide card-forecast">
            <div class="f-loc"><b>${item.kecamatan}</b></div>
            <div class="f-time"> ${now.r_date} ${now.show} WIB</div>
            <div class="f-wicon"><img
            src="https://www.bmkg.go.id/asset/img/weather_icon/ID/${dcuaca.$.w_ket}-${now.is_am}.png" alt="${dcuaca.$.w_ket}"/></div>
            <div class="w-txt">${dcuaca.$.w_ket}</div>
            <div class="f-temp">${dcuaca.$.t}°C</div>
            <div class="f-link"><a href="#">Selengkapnya</a></div>
        </div>
        `;
        forecastCard.innerHTML += html;
        forecastCard.setAttribute("style", "min-height: 350px;");
      }
    });
  });
}

function getForecast() {
  fetch(FORECAST_URL, {
    method: "get",
    cache: "reload",
  })
    .then((response) => response.json())
    .then((jsonResp) => {
      FORECAST_DATA = jsonResp;
      renderForecast();
    })
    .catch((err) => {
      console.log(`Failed load forecast data: ${err}`);
    });
}

getForecast();
