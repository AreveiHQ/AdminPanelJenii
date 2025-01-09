import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
const s3 = new S3Client({
        region: process.env.AWS_REGION,
        endpoint: "https://s3-accelerate.amazonaws.com",
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });
export const uploadToS3 = async (fileBuffer,folder,fileName, mimeType) => {
        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME, // Your bucket name
          Key: `${folder}${fileName}`, // Path in the bucket
          Body: fileBuffer, // File content9
          ContentType: mimeType, // File MIME type
        };
        const upload = new Upload({
          client: s3, // Your S3 client
          params,
        });
      
        try {
          const result = await upload.done();
          return `https://${process.env.AWS_S3_BUCKET_NAME}.s3-accelerate.amazonaws.com/${folder}${fileName}`;
        } catch (error) {
          console.error("Error uploading to S3:", error);
          throw new Error("Failed to upload image to S3");
        }
      };

      