import dotenv from "dotenv";
dotenv.config();
import { env } from "./types/env";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { upload } from "./upload";
import path from "path";
import fs from "fs";
import { ImageUpload } from "responses";

(async () => {
  const app = express();

  // Parse request body
  app.use(express.json());

  // Enable static file serving
  app.use(express.static(__dirname + "/uploads"));

  // Setup cors to allow incoming requests from given origin
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Secure response headers
  app.use(helmet());

  // Enable logging for development
  if (env.NODE_ENV == "development") {
    const morgan = (await import("morgan")).default;
    app.use(morgan("tiny"));
  }

  // Image upload route
  app.post("/upload", upload.single("image"), (req, res) => {
    const url = `http://localhost:${env.PORT}/image?image=${req.file?.filename}`;
    return res.json({ ok: true, filename: req.file?.filename, url } as ImageUpload);
  });

  // Image server route
  app.get("/image", (req, res) => {
    const imgName = req.query.image;

    // Check if url include `image` query parameter
    if (!imgName) {
      return res.status(401).json({
        ok: false,
        error: "Insufficient query parameters!",
      } as ImageUpload);
    }

    const imgPath = path.join(__dirname, "/uploads/", imgName as string);
    const fileExists = fs.existsSync(imgPath);

    if (!fileExists)
      return res.status(401).json({
        ok: false,
        error: "Image not found!",
      } as ImageUpload);

    return res.sendFile(imgPath);
  });

  // Response with 404 to not implemented routes
  app.use("*", (_req, res) => {
    return res.status(404).json({
      ok: false,
      error: "Invalid route!",
    } as ImageUpload);
  });

  app.listen(env.PORT, () => {
    console.log("Listening on http://localhost:8080");
  });
})();
