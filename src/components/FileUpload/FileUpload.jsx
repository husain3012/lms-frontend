import React, { useMemo, useEffect, useState } from "react";
import classes from "./FileUpload.module.css";
import { AiOutlineCloudDownload, AiOutlineFileUnknown } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";
import loadCloudinaryWidget from "../../utils/load-cloudinaryWidget";
var myWidget;

const iframeRenderAbleFiles = ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv", "jpg", "jpeg", "png", "gif", "svg"];

const PreviewFile = ({ uploadedFile, setUploadedFile }) => {
  // preview file in iframe


  // check file extension
  console.log(uploadedFile);
  const fileExtension = uploadedFile.split(".").pop();
  const iframeRenderable = iframeRenderAbleFiles.includes(fileExtension);

  return (
    <div className={classes.previewFile}>
      {iframeRenderable ? (
        <iframe
        style={{borderRadius: "5px"}}
          height={200}
          width={200}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          marginheight="0px"
          marginwidth="0px"
          src={uploadedFile}
          title="preview"
        />
      ) : (
        <div className={classes.filePlaceholder}><AiOutlineFileUnknown/></div>
      )}

      <div className={classes.actions}>
        <a href={uploadedFile} download="file" target="_blank" rel="noreferrer">
          <button className={classes.downloadButton}>
            <AiOutlineCloudDownload />
          </button>
        </a>
        <button className={classes.removeButton} onClick={() => setUploadedFile(null)}>
          <MdClear />
        </button>
      </div>
    </div>
  );
};

const FileUpload = ({ setUploadedFile = (x) => x, uploadedFile }) => {
  useEffect(() => {
    loadCloudinaryWidget(() => {
      const { cloudinary } = window;
      myWidget = cloudinary.createUploadWidget(
        {
          cloudName: "husain3012",
          upload_preset: "kx68dpnw",
        },
        (error, result) => {
          if (result.event === "success") {
            console.log(result.info); // result.info contains data from upload
            setUploadedFile(result.info.secure_url);
          }
          console.log(error);
        }
      );
    });
  }, [setUploadedFile]);

  return uploadedFile ? (
    <PreviewFile uploadedFile={uploadedFile} setUploadedFile={setUploadedFile} />
  ) : (
    <button onClick={() => myWidget.open()} className={classes.uploadBtn}>
      <BiImageAdd />
    </button>
  );
};

export default FileUpload;
