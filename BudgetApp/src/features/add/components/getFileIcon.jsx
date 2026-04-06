export default function getFileIcon(name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  if (["jpg", "jpeg", "png", "webp", "heic"].includes(ext)) return "image";
  if (["pdf"].includes(ext))                                  return "document-text";
  if (["xls", "xlsx"].includes(ext))                         return "grid";
  if (["doc", "docx"].includes(ext))                         return "document";
  return "attach";
}