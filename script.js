const URL = "./model/";
let model, webcam, labelContainer, maxPredictions;

// Load model and setup webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  webcam = new tmImage.Webcam(300, 300, true);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);

  labelContainer = document.getElementById("label-container");
  labelContainer.innerHTML = "<p>Waiting for prediction...</p>";
}

// Predict from webcam
async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  let highest = prediction[0];
  for (let i = 1; i < prediction.length; i++) {
    if (prediction[i].probability > highest.probability) {
      highest = prediction[i];
    }
  }

  const emoji = highest.className.toLowerCase().includes("fruit") ? "🍎" : "🥦";
  labelContainer.innerHTML = `<h2>${highest.className} ${emoji}</h2>`;
}

// Button triggers
async function start() {
  document.querySelectorAll("button")[0].disabled = true;
  await init();
}

function stopWebcam() {
  if (webcam) {
    webcam.stop();
    webcam.canvas.remove();
  }
  document.querySelectorAll("button")[0].disabled = false;
}
