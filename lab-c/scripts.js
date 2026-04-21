let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);


let marker = L.marker([53.430127, 14.564802]).addTo(map);

function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation niedostępna!");
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    document.getElementById("latitude").innerText = lat.toFixed(6);
    document.getElementById("longitude").innerText = lon.toFixed(6);

    map.setView([lat, lon], 18);

    marker.setLatLng([lat, lon]);
    marker.bindPopup("<strong>Twoja lokalizacja</strong><br>Lat: " + lat + "<br>Lon: " + lon).openPopup();
  }, (error) => {
    console.error("Błąd geolokalizacji:", error);
    alert("Nie można pobrać lokalizacji");
  });
}


document.getElementById("getLocation").addEventListener("click", getLocation);


document.getElementById("saveButton").addEventListener("click", function () {
  const rasterMap = document.getElementById("rasterMap");
  const rasterContext = rasterMap.getContext("2d");

  rasterMap.width = 450;
  rasterMap.height = 275;

  leafletImage(map, function (err, canvas) {
    if (err) {
      console.error("Error converting Leaflet map to canvas:", err);
      return;
    }

    rasterContext.clearRect(0, 0, rasterMap.width, rasterMap.height);
    rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);

    rasterContext.clearRect(0, 0, rasterMap.width, rasterMap.height);
    rasterContext.drawImage(canvas, 0, 0, rasterMap.width, rasterMap.height);

    const size = 4;
    buildPuzzle(rasterMap, size);
    createDropSlots( size);

  });


});

function attachDragHandlersToItem(item) {
  item.addEventListener("dragstart", function (event) {
    this.style.border = "2px dashed #D8D8FF";
    event.dataTransfer.setData("text", this.id);
  });

  item.addEventListener("dragend", function () {
    this.style.border = "0";
  });
}

function getRandomOrder(size) {
  const order = Array.from({ length: size }, (_, i) => i);

  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }

  return order;
}

function buildPuzzle(sourceCanvas, size) {
  const container = document.getElementById("dragstart");
  container.innerHTML = "";

  const rows = size;
  const cols = size;

  const baseW = Math.floor(sourceCanvas.width / cols);
  const baseH = Math.floor(sourceCanvas.height / rows);

  container.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  container.style.width = sourceCanvas.width + "px";
  container.style.height = sourceCanvas.height + "px";

  const pieces = [];
  let idx = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const sx = c * baseW;
      const sy = r * baseH;

      const sw = (c === cols - 1) ? (sourceCanvas.width - sx) : baseW;
      const sh = (r === rows - 1) ? (sourceCanvas.height - sy) : baseH;

      const tileCanvas = document.createElement("canvas");
      tileCanvas.width = sw;
      tileCanvas.height = sh;

      const tctx = tileCanvas.getContext("2d");
      tctx.drawImage(sourceCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

      const piece = document.createElement("div");
      piece.id = `piece-${idx}`;
      piece.className = "item draggable";
      piece.draggable = true;
      piece.style.width = sw + "px";
      piece.style.height = sh + "px";
      piece.style.backgroundImage = `url(${tileCanvas.toDataURL()})`;
      piece.style.backgroundSize = "100% 100%";
      piece.style.cursor = "grab";
      piece.dataset.correctIndex = String(idx);


      // Przyda się do sprawdzania, czy puzzle ułożone poprawnie
      piece.dataset.correctIndex = String(idx);

      attachDragHandlersToItem(piece);
      pieces.push(piece);
      idx++;
    }
  }

  const randomOrder = getRandomOrder(pieces.length);
  for (const pieceIndex of randomOrder) {
    container.appendChild(pieces[pieceIndex]);
  }
}

function createDropSlots(size) {
  const dragEnd = document.getElementById("dragend");
  dragEnd.innerHTML = "";

  const rows = size;
  const cols = size;

  for (let i = 0; i < rows * cols; i++) {
    const slot = document.createElement("div");
    slot.className = "drop-slot";
    slot.dataset.targetIndex = String(i);
    attachDropHandlers(slot);
    dragEnd.appendChild(slot);
  }
}

function attachDropHandlers(slot) {
  slot.addEventListener("dragover", (e) => e.preventDefault());

  slot.addEventListener("drop", (e) => {
    e.preventDefault();

    const pieceId = e.dataTransfer.getData("text");
    const piece = document.getElementById(pieceId);
    if (!piece) return;

    if (slot.children.length > 0) {
      // Swap: stary klocek idzie tam, gdzie był nowy
      const oldPiece = slot.children[0];
      piece.parentElement.appendChild(oldPiece);
    }

    slot.appendChild(piece);

    const ok = piece.dataset.correctIndex === slot.dataset.targetIndex;
    slot.classList.toggle("correct", ok);
    slot.classList.toggle("wrong", !ok);

    checkWin();
  });
}

function alert_win() {
  console.debug("Gratulacje! Ułożyłeś puzzle!");

  if (!("Notification" in window)) {
    alert("Gratulacje! Ułożyłeś puzzle!");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification("🎉 Puzzle Ułożone!", {
      body: "Gratulacje! Ułożyłeś puzzle prawidłowo!",
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>🎉</text></svg>",
      badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>✓</text></svg>"
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("🎉 Puzzle Ułożone!", {
          body: "Gratulacje! Ułożyłeś puzzle prawidłowo!",
          icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>🎉</text></svg>",
          badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>✓</text></svg>"
        });
      } else {
        alert("Gratulacje! Ułożyłeś puzzle!");
      }
    });
  }
}

function checkWin() {
  const slots = document.querySelectorAll("#dragend .drop-slot");
  if (slots.length === 0) return;

  const allFilled = [...slots].every(s => s.children.length === 1);
  const allCorrect = [...slots].every(s => {
    const piece = s.children[0];
    return piece && piece.dataset.correctIndex === s.dataset.targetIndex;
  });

  if (allFilled && allCorrect) {
    setTimeout( alert_win, 50);
  }
}
