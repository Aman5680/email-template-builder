import React, { useState } from "react";
import { uploadImage } from "../api";
import styles from './ImageUploader.module.css';

const ImageUploader = ({ onImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const response = await uploadImage(selectedFile);
      if (response && response.url) {
        onImageUpload(response.url);
        alert("Image uploaded successfully!");
      } else {
        alert("Failed to upload image.");
      }
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <div className={styles.imageUploader}>
      <h3>Upload an Image</h3>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImageUploader;
