# Image Processor API

A Node.js-based API that converts raster images to SVG using **Potrace** and generates multiple resized versions of the image using **Sharp.js**.

## 🚀 Features
- Convert bitmap images to SVG.
- Generate resized images in various formats (thumbnail, medium, large, etc.).
- Simple file upload management through a REST API.

## 🛠️ Technologies Used
- [Express](https://expressjs.com/): Fast and minimalist web framework.
- [Multer](https://github.com/expressjs/multer): File upload management.
- [Potrace](https://github.com/tooolbox/node-potrace): Bitmap-to-SVG conversion.
- [Sharp](https://sharp.pixelplumbing.com/): Image resizing and processing.
- [Node.js](https://nodejs.org/): JavaScript runtime environment.

---

## 📦 Installation

1. **Clone the project**:
   ```bash
   git clone https://github.com/ZAomineZ/api_potrace.git
   cd api_potrace
   ```
2. Install dependencies:
    ```bash
   npm install
   ```
3. Start the server:
    ```bash
   node index.js
   ```

By default, the server runs on port 5005. You can change the port by setting a PORT environment variable.

---

## 📤 Usage

### Endpoint: `/potrace`
This API endpoint processes an uploaded image file, converts it to an SVG, and creates multiple resized versions.

- **HTTP Method**: `POST`
- **URL**: `http://localhost:5005/potrace`
- **Form Field**: `file` (the uploaded image file, sent as `multipart/form-data`).

#### Examples

1. **Using cURL**:
   ```bash
   curl -X POST -F "file=@path/to/your-image.png" http://localhost:5005/potrace
   ```
2. **Using Postman**:

- **Method**: `POST`
- **URL**: `http://localhost:5005/potrace`
- **Body**:
    - Set the **Body type** to `form-data`.
    - Add a key named `file`.
    - Attach the image file to the `file` key.

---

### Response Examples

#### Success Response
```json
{
    "success": true
}
```

#### Error Response
If the file field is missing or there is an issue with processing:
```json
{
  "success": false,
  "message": "File is required"
}
```
If an internal server error occurs:
```json
{
  "success": false,
  "error": "Detailed error message"
}
```

---

## 📂 Project Structure

```
├── uploads/             # Folder for uploaded files
├── server.js            # Main server file
├── package.json         # Project dependencies
```

---

## 🛠️ Future Improvements

- Add strict validation for uploaded file types.
- Implement a queue system for handling heavy workloads.
- Automatically clean up temporary files after processing.