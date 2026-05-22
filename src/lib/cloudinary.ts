import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function uploadResumeToCloudinary(fileBuffer: Buffer, fileName: string) {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "talentstream/resumes",
        resource_type: "raw",
        public_id: fileName.replace(/\.[^.]+$/, "")
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    upload.end(fileBuffer);
  });
}
