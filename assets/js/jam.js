let SERVER_TIME = new Date();
let deltaD = 0;

function formatNumber(num) {
  let res;
  if (num <= 9) {
    return (res = `0${num}`);
  } else {
    return (res = num);
  }
}

function extractResponse(res) {
  let data = [];
  let result;
  let dateFormat = res.split(" ")[4].split("(")[1].split(")")[0].split(",");
  dateFormat.forEach((item) => {
    data.push(parseInt(item));
  });
  return (result = new Date(
    data[0],
    data[1] - 1,
    data[2],
    data[3],
    data[4],
    data[5]
  ));
}

function renderClock(obj) {
  const daytxt = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const bulantxt = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  setInterval(() => {
    const clientDate = new Date();
    const serverdate = new Date(clientDate.getTime() + deltaD);

    // DATE
    let month = bulantxt[serverdate.getMonth()];
    let dayDate = serverdate.getDate();
    let day = daytxt[serverdate.getDay()];
    let year = serverdate.getFullYear();

    // WIB time
    let hours = formatNumber(serverdate.getHours());
    let minutes = formatNumber(serverdate.getMinutes());
    let seconds = formatNumber(serverdate.getSeconds());

    // UTC time
    let UTChours = formatNumber(serverdate.getUTCHours());
    let UTCminutes = formatNumber(serverdate.getUTCMinutes());
    let UTCseconds = formatNumber(serverdate.getUTCSeconds());

    const mdate = `${dayDate}/${serverdate.getMonth()}/${year}`;
    const date = `${day}, ${dayDate} ${month} ${year}`;
    const clock = `${hours}:${minutes}:${seconds} WIB / ${UTChours}:${UTCminutes}:${UTCseconds} UTC `;
    document.querySelectorAll(`.${obj.dateId}`).forEach((item) => {
      item.innerHTML = `<i class="bi bi-date-fill date-icon"></i> ${date}`;
    });
    document.querySelectorAll(`.${obj.mdate}`).forEach((item) => {
      item.innerHTML = `<i class="bi bi-date-fill date-icon"></i> ${mdate}`;
    });
    document.querySelectorAll(`.${obj.clockId}`).forEach((item) => {
      item.innerHTML = `<i class="bi bi-closk-fill clock-icon"></i> ${clock}`;
    });
  }, 1000);
}

function getClock() {
  const url = `https://corsproxy.io/?${encodeURIComponent(
    "http://jam.bmkg.go.id/JamServer.php"
  )}`;
  fetch(url, {
    method: "get",
    mode: "cors",
    cache: "reload",
  })
    .then((response) => response.text())
    .then((txtresponse) => {
      SERVER_TIME = extractResponse(txtresponse); //update SERVER_TIME value
      deltaD = SERVER_TIME.getTime() - new Date().getTime(); //reload deltaD value
    })
    .catch(function (err) {
      console.log("Failed to fetch page: ", err);
    });
}

function calibrate() {
  getClock();
  setTimeout(calibrate, 10 * 60000);
}
