use wasm_bindgen::prelude::{wasm_bindgen, JsError};

#[wasm_bindgen]
pub fn encode(data: &[u8], level: u8) -> Result<Vec<u8>, JsError> {
    let options = oxipng::Options::from_preset(level);

    oxipng::optimize_from_memory(data, &options).map_err(JsError::from)
}
