// src/features/add/services/uploadFile.js
import { supabase } from "../../../../src/services/supabase/supabase";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";

// ✅ derive real MIME type from extension — file.type is often wrong in RN
const getMimeType = (fileName) => {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  const map = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return map[ext] ?? "application/octet-stream";
};

export async function uploadFile(file) {
  try {
    if (!file) return null;

    const base64 = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const fileExt = file.name?.split(".").pop()?.toLowerCase() ?? "jpg";
    const mimeType = getMimeType(file.name); // ✅ always a valid MIME
    const fileName = `transactions/${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

    console.log("uploading →", fileName, "as", mimeType);

    const { data, error } = await supabase.storage
      .from("budgetapp")
      .upload(fileName, decode(base64), {
        contentType: mimeType, // ✅ "image/jpeg" not "image"
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("budgetapp")
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (err) {
    console.log("Upload failed:", err.message ?? err);
    return null;
  }
}
