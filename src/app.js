const express = require("express");
const multer = require("multer");
const { upload } = require("./controller/upload");
const appInsights = require("applicationinsights");

appInsights.setup("f1089ac8-5bf3-4faa-a41a-cbacd2a92fce").start();

const app = express();
const port = 8000;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './file');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadMiddleware = multer({ storage: storage }).single('file');

app.get('/', (req, res) => {
    appInsights.defaultClient.trackEvent({ name: 'Acceso a la ruta principal' });
    res.sendFile(__dirname + '/view/index.html');
});

app.post("/upload", (req, res) => {
    uploadMiddleware(req, res, function (err) {
        if (err) {
            appInsights.defaultClient.trackEvent({ name: 'Error en la carga de archivos', properties: { errorMessage: err.message } });
            return res.status(500).json({ error: err.message });
        }
        const fileName = req.file.filename;

        upload(fileName);
        res.redirect("/success");
        appInsights.defaultClient.trackEvent({ name: 'Carga de archivo exitosa', properties: { fileName: fileName } });
    });
});

app.get('/success', (req, res) => {
    appInsights.defaultClient.trackEvent({ name: 'Acceso a la ruta de éxito' });
    res.sendFile(__dirname + '/view/upload.html');
});

app.listen(port, () => console.log(`Listen Port ${port}`));
