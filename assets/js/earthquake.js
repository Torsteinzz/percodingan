const EARTHQUAKE_URL = "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json";
//const EARTHQUAKE_URL = "../dummy-data/gempa.json";

function calculateDistance(loc) {
  const cilacapLoc = [-7.71666667, 109.000001];
  const quakeLoc = loc.split(",");
  const R = 6371.071; // Radius of the Earth in km
  let rlat1 = cilacapLoc[0] * (Math.PI / 180); // Convert degrees to radians
  let rlat2 = parseFloat(quakeLoc[0]) * (Math.PI / 180); // Convert degrees to radians
  let difflat = rlat2 - rlat1; // Radian difference (latitudes)
  let difflon = (parseFloat(quakeLoc[1]) - cilacapLoc[1]) * (Math.PI / 180); // Radian difference (longitudes)

  let distance =
    2 *
    R *
    Math.asin(
      Math.sqrt(
        Math.sin(difflat / 2) * Math.sin(difflat / 2) +
          Math.cos(rlat1) *
            Math.cos(rlat2) *
            Math.sin(difflon / 2) *
            Math.sin(difflon / 2)
      )
    );
  return distance.toFixed(1);
}

function renderQuakeCard(quakeData) {
  const data = quakeData.Infogempa.gempa;
  const CardLayout = document.querySelector(".card-gempa");
  const html = `
    <div class="row">
                  <div class="col-md-6 col-sm-12 text-center mb-2">
                    <a href="https://ews.bmkg.go.id/tews/data/${
                      data.Shakemap
                    }" class="fancybox img-hover-v1" rel="gallery1" title="Gempabumi Terkini">
                    <img class="img img-responsive img-fluid" src="https://ews.bmkg.go.id/tews/data/${
                      data.Shakemap
                    }" alt="gempa terkini" width="200">
                    </a>
                  </div>
                      <div class="col-md-6 col-sm-12 gempabumi-detail no-padding">
                        <ul class="list-unstyled">
                          <li><span class="waktu"><b>${data.Tanggal}, ${
    data.Jam
  }</b></span></li>
                          <li><span class="ic magnitude"></span>${
                            data.Magnitude
                          }</li>
                          <li><span class="ic kedalaman"></span>${
                            data.Kedalaman
                          }</li>
                          <li><span class="ic koordinat"></span>${
                            data.Lintang
                          } - ${data.Bujur}</li>
                         </ul>
                      </div>
                </div>
                <div class="row">
                  <div class="col-md-12 gempabumi-detail no-padding mt-2">
                  <ul class="list-unstyled">
                  <li><span class="ic lokasi"></span>${
                    data.Wilayah
                  } (${calculateDistance(
    data.Coordinates
  )} km dari Kab. Cilacap)</li>
                  <li><span class="ic dirasakan"></span>Dirasakan MMI: ${
                    data.Dirasakan
                  }</li>
                  <li><a class="more" href="https://www.bmkg.go.id/gempabumi-dirasakan.html">Selengkapnya →</a></li>
                </ul>
                  </div>
                </div>
    `;
  CardLayout.innerHTML = html;
}

function getQuakeData() {
  fetch(`https://corsproxy.io/?${encodeURIComponent(EARTHQUAKE_URL)}`, {
    method: "get",
    cache: "reload",
  })
    .then((response) => response.json())
    .then((JsonResp) => {
      renderQuakeCard(JsonResp);
    })
    .catch((err) => {
      console.log("Failed load earthquake data", err);
    });
}

function updateGempa() {
  getQuakeData();
  setTimeout(calibrate, 15 * 60000);
}
