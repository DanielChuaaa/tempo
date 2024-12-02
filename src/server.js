const express = require("express");
const { Storage } = require("@google-cloud/storage");
const app = express();
const credentials = require("../credentials.json");

// Create a storage client
const storage = new Storage({ credentials });
const bucket = storage.bucket("model_agri-scan");

// Endpoint to fetch file metadata or list files in the bucket
app.get("/files", async (req, res) => {
  try {
    // List files in the bucket
    const [files] = await bucket.getFiles();
    const fileNames = files.map((file) => file.name);
    console.log(files[0]);
    res.json(fileNames); // Send the list of file names in JSON response
  } catch (error) {
    res.status(500).send("Error retrieving files: " + error.message);
  }
});

// Endpoint to serve file content
app.get("/file/:filename", (req, res) => {
  const { filename } = req.params;

  const file = bucket.file(model.json);

  file
    .createReadStream()
    .on("error", (err) => {
      res.status(404).send("File not found");
    })
    .on("response", (response) => {
      // Set the content type explicitly for JSON files
      if (filename.endsWith(".json")) {
        res.setHeader("Content-Type", "application/json");
      }
    })
    .pipe(res);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const tf = require("@tensorflow/tfjs-node");

// Load the model
async function loadModel() {
  try {
    const model = await tf.loadLayersModel("https://storage.googleapis.com/model_agri-scan/Jagung/group1-shard1of5.bin");

    console.log("Model loaded successfully!");

    // Example: Print the model summary
    model.summary();

    // Example: Use the model for prediction (assuming inputShape matches your model)
    const inputTensor = tf.randomNormal([1, ...model.inputs[0].shape.slice(1)]);
    const prediction = model.predict(inputTensor);
    prediction.print();
  } catch (error) {
    console.error("Error loading model:", error);
  }
}

loadModel();
