const express = require("express");
const potrace = require("potrace");
const sharp = require("sharp");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 5005;

app.use(express.json()); // Middleware pour parser le JSON dans le corps de la requête

// Configuration de multer pour stocker le fichier en local
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = "uploads/";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-full" + path.extname(file.originalname)); // Nom unique pour chaque fichier
    },
});
const upload = multer({ storage: storage }); // Initialisation de multer

const traceAndResizeImage = async (file) => {
    const params = { threshold: 120 };

    return new Promise((resolve, reject) => {
        potrace.trace(file, params, async (err, svg) => {
            if (err) return reject(err);

            if (svg) {
                let newFilePNG = file

                try {
                    await sharp(newFilePNG)
                        .resize({ height: 1200, width: 1200, fit: "fill" })
                        .toFile(newFilePNG.replace("-full.", "-current."));

                    await sharp(newFilePNG)
                        .resize({ height: 500, width: 500, fit: "fill" })
                        .toFile(newFilePNG.replace("-full.", "-large."));

                    await sharp(newFilePNG)
                        .resize({ height: 320, width: 280, fit: "fill" })
                        .toFile(newFilePNG.replace("-full.", "-medium."));

                    await sharp(newFilePNG)
                        .resize(150, 150)
                        .png({ quality: 90 })
                        .toFile(newFilePNG.replace("-full.", "-thumb."));

                    resolve({ success: true });
                } catch (resizeError) {
                    reject(resizeError);
                }
            } else {
                reject(new Error("SVG generation failed."));
            }
        });
    });
};

app.post("/potrace", upload.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "File is required" });
    }

    const relativeImagePath = req.file.path;
    const absoluteImagePath = path.resolve(relativeImagePath);

    try {
        await traceAndResizeImage(absoluteImagePath);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});