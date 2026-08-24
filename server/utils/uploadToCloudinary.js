import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const uploadToCloudinary = (
  buffer,
  folder = "honeyterra/products"
) => {
  return new Promise(
    (resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder,

            resource_type: "image",

            transformation: [
              {
                width: 1200,
                height: 1200,
                crop: "limit",
                quality: "auto",
                fetch_format: "auto",
              },
            ],
          },

          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

      Readable.from(buffer).pipe(
        uploadStream
      );
    }
  );
};

export default uploadToCloudinary;