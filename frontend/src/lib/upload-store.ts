let _pendingUploadFile: File | null = null;

export function getPendingUploadFile(): File | null {
  return _pendingUploadFile;
}

export function setPendingUploadFile(file: File | null) {
  _pendingUploadFile = file;
}
