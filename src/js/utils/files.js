const allowedSizeInMBs = 9.5;

export const UPLOAD_FILE_MAX_SIZE = allowedSizeInMBs * Math.pow(1024, 2);

export const ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "csv",
  "txt",
  "png",
  "jpg",
  "jpeg"
];

export const formatBytes = ({ bytes }) => {
  if (bytes === 0) return "0 Bytes";

  const blockSize = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const sizeIndex = Math.floor(Math.log(bytes) / Math.log(blockSize));
  return `${parseFloat((bytes / Math.pow(blockSize, sizeIndex)).toFixed(2))} ${
    sizes[sizeIndex]
  }`;
};

export const getFileExtension = ({ file }) => {
  return file.name.split(".").pop();
};

export const validateUploadFile = ({ file }) => {
  const fileExtension = getFileExtension({ file });

  if (ALLOWED_EXTENSIONS.indexOf(fileExtension) === -1) {
    return {
      valid: false,
      error: `File extension ${fileExtension} is not allowed.
      Allowed extensions are: '${ALLOWED_EXTENSIONS.join(", ")}'.`
    };
  }

  if (file.size > UPLOAD_FILE_MAX_SIZE) {
    return {
      valid: false,
      error: `Ensure this file size is not greater than ${allowedSizeInMBs} MB.
      Your file size is ${formatBytes({ bytes: file.size })}.`
    };
  }

  return {
    valid: true
  };
};
