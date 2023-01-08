import React, { useRef, useState, useEffect } from "react";

import "./ImageUpload.css";
import Button from "../FormElements/Button";

//2 places where we want to accept files
// can reuse component on new place and auth page

const ImageUpload = (props) => {
  const filePickerRef = useRef();
  const [file, setFile] = useState(null); // need useState as we need to manage the file.
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isValid, setIsValid] = useState(false);

  const pickImageHandler = () => {
    filePickerRef.current.click(); //.click method simulates a mouse click on a DOM element. Default behaviour when we click on an input with type='file' that it will open the filepicker.
  };

  // should execute on first render and whenever the file changes. When the file changes we will want to set the previewImage.
  useEffect(() => {
    if (!file) {
      return;
    }
    // FileReader object lets web applications asynchronously read contents of files stored on the users computer. File objects may be obtained from a fileslist object returned returned as result of a user selecting files using the <input> element.
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (e) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (e.target.files && e.target.files.length === 1) {
      pickedFile = e.target.files[0];
      setFile(pickedFile);
      setIsValid(true); // this will not update the state value straight away. The change of state will be done once the whole function has completed, therefore the value of isValid will be the old isValid value.
      fileIsValid = true;
    } else {
      setIsValid(false);
    }
    props.onInput(props.id, pickedFile, fileIsValid); // call a function to pass data to the parent component that will use the pickedFile.
  };

  return (
    <div className="form-control">
      <input
        type="file"
        id={props.id}
        style={{ display: "none" }} // set display to none as the filePicker by default is ugly. we simulate a click on the file picker using the pickImageHandler function.
        accept=".jpg, .png, .jpeg, .PNG"
        ref={filePickerRef}
        onChange={pickedHandler} // when we pick a file the onChange function will run.
      />
      {/*set inline style here set display to none, still part of DOM but no visible*/}
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="PREVIEW" />}
          {!previewUrl && <p>Pick an Image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
