import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import Icon from "@/components/ui/Icon";
const baseStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "15px",
  borderWidth: 2,
  borderRadius: 6,
  borderColor: "#000000",
  borderStyle: "dashed",
  backgroundColor: "#ffffff",
  color: "#000000",
  transition: "border .3s ease-in-out",
};
const activeStyle = {
  borderColor: "#2196f3",
};
const acceptStyle = {
  borderColor: "#00e676",
};
const rejectStyle = {
  borderColor: "#ff1744",
};
const DropzoneComponents = ({ setFiless, fileData, styles = false }) => {
  const [files, setFiles] = useState([]);
  const onDrop = useCallback((acceptedFiles) => {
    //console.log(acceptedFiles);
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )
    );
  }, []);
  useEffect(() => {
    // console.log(fileData);
    if (fileData.preview) {
      setFiles([fileData]);
    }
  }, [fileData]);
  const handleFile = (e) => {
    setFiless(e.target.files[0]);
  };
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxFiles: 1,
    onDrop,
    accept: "image/jpeg, image/png",
  });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  const removeFile = (file) => () => {
    setFiless([]);
    acceptedFiles.splice(acceptedFiles.indexOf(file), 1);
    files.splice(files.indexOf(file), 1);
  };
  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div className="relative w-max rounded-2xl max-w-[530px]">
        <img src={file.preview} alt={file.name} className={`${style&&"w-52 h-24"}`}/>
        <p
          onClick={removeFile(file)}
          className=" text-end absolute -top-3.5 -right-3.5 cursor-pointer"
        >
          <Icon
            icon="ic:outline-cancel"
            className="w-6 h-6 text-gray-800  bg-white/90 rounded-full "
          />
        </p>
      </div>
    </div>
  ));
  // clean up
  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
      //console.log(files);
    },
    [files]
  );
  return (
    <section>
      {styles ? (
        <>
          {files.length == 0 && (
            <div {...getRootProps({ style })}>
              <input {...getInputProps({ onChange: handleFile })} />

              <div className="flex gap-4 items-center justify-center">
                <Icon icon="ph:images-thin" className="w-16 h-16  "/>
                <div className="">
                  <h1 className="text-sm font-bold">
                    Upload your business logo{" "}
                  </h1>
                  <p className="text-xs">
                    Image formats will be png, jpg, and svg, and the file size
                    will be 2 MB.
                  </p>
                </div>
              </div>
            </div>
          )}
          <aside>{thumbs}</aside>
        </>
      ) : (
        <>
          {files.length == 0 && (
            <div {...getRootProps({ style })}>
              <input {...getInputProps({ onChange: handleFile })} />
              <div>Drag and drop your images here.</div>
            </div>
          )}
          <aside>{thumbs}</aside>
        </>
      )}
    </section>
  );
};
export default DropzoneComponents;
