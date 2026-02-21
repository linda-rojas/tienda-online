import { MemoryStoredFile } from "nestjs-form-data";

export interface UploadImageRequest {
  file: MemoryStoredFile;
  type: string;
}
