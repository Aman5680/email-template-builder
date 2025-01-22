import React, { useState, useEffect } from "react";
import { getEmailLayout } from "../api";
import ImageUploader from "./ImageUploader";
import axios from "axios";
import styles from './EmailEditor.module.css'; // Import the CSS module

const EmailEditor = () => {
  const [layout, setLayout] = useState("");
  const [title, setTitle] = useState("Default Title");
  const [content, setContent] = useState("Default Content");
  const [footer, setFooter] = useState("Default Footer");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchLayout = async () => {
      const layoutHTML = await getEmailLayout();
      if (layoutHTML) {
        setLayout(layoutHTML);
      }
    };
    fetchLayout();
  }, []);

  const renderPreview = () => {
    return layout
      .replace("{{ title }}", title)
      .replace("{{ content }}", content)
      .replace("{{ footer }}", footer)
      .replace("{{ imageUrl }}", imageUrl || "https://via.placeholder.com/300");
  };

  const handleDownload = async () => {
    const emailConfig = {
      title,
      content,
      footer,
      imageUrl,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/renderAndDownloadTemplate",
        emailConfig,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "updated_email.html";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the updated HTML file:", error);
      alert("Failed to download the updated HTML file.");
    }
  };

  return (
    <div className={styles.emailEditor}>
      <h1>Email Template Builder</h1>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label className={styles.content1}>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label>Footer:</label>
        <input
          type="text"
          value={footer}
          onChange={(e) => setFooter(e.target.value)}
        />
      </div>
      <ImageUploader onImageUpload={setImageUrl} />
      <h2>Preview</h2>
      <div
        className={styles.previewBox}
        dangerouslySetInnerHTML={{ __html: renderPreview() }}
      ></div>
      <div className={styles.centerButton}>
        <button onClick={handleDownload} style={{ marginTop: "20px" }}>
          Download Updated HTML
        </button>
      </div>
    </div>
  );
};

export default EmailEditor;
