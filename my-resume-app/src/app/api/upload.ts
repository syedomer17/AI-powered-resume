import { NextApiRequest, NextApiResponse } from "next";
import { cloudinary } from "@/lib/cloudinary";
import formidable from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = formidable({ multiples: false });

  const formData: any = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const file = formData.files.file;

  // Upload to Cloudinary
  const upload = await cloudinary.uploader.upload(file.filepath, {
    folder: "resumes",
    resource_type: "auto",
  });

  // Parse text if PDF
  let extractedText = "";
  if (file.mimetype === "application/pdf") {
    const buffer = fs.readFileSync(file.filepath);
    const parsed = await pdfParse(buffer);
    extractedText = parsed.text;
  }

  return res.status(200).json({
    success: true,
    url: upload.secure_url,
    public_id: upload.public_id,
    extractedText,
  });
}
