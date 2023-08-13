import { encode } from "oxipng-wasm";

const inputElement = document.querySelector("input");

const beforeSizeElement = document.getElementById("before-size");
const afterSizeElement = document.getElementById("after-size");

const beforeImgElement = document.getElementById("before-img");
const afterImgElement = document.getElementById("after-img");

inputElement.addEventListener("change", async (event) => {
  // In reality this should probably be done in a Web Worker to not freeze the main thread

  const file = event.target.files[0];

  if (!file || file.type !== "image/png") {
    alert("Invalid PNG");
    return;
  }

  // Update UI
  beforeSizeElement.innerText = file.size + " bytes";
  beforeImgElement.src = URL.createObjectURL(file);

  // Need to send data as Uint8Array to Imagequant/WASM
  const uint8Array = new Uint8Array(await file.arrayBuffer());

  // Do the work
  const output = encode(uint8Array, 0);

  const outputBlob = new Blob([output.buffer], { type: "image/png" });

  // Update UI
  afterSizeElement.innerText = outputBlob.size + " bytes";
  afterImgElement.src = URL.createObjectURL(outputBlob);
});
