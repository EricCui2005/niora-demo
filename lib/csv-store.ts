// Simple in-memory store for uploaded CSV content
let uploadedCSVContent: string | null = null;

export function setUploadedCSV(content: string): void {
  uploadedCSVContent = content;
}

export function getUploadedCSV(): string | null {
  return uploadedCSVContent;
}

export function hasUploadedCSV(): boolean {
  return uploadedCSVContent !== null;
}

export function clearUploadedCSV(): void {
  uploadedCSVContent = null;
}
