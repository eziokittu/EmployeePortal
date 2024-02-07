import React, { useRef, useState, useEffect } from 'react';

function UploadImage() {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = event => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="p-4 border-2 mt-6 border-gray-200 rounded-lg dark:border-gray-700">

      {/* Heading */}
      <h1>Your photo</h1>

      {/* Image preview */}
      <div className="mt-4 flex flex-row">
        <div className="w-12 h-12 rounded-full object-cover bg-gray-100 text-sm" >
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <img src={"noimage"} alt="default" />}
        </div>
        <div>
          <div className="flex flex-col">
            <h1 className="ml-2">Edit your photo</h1>
            <div className="flex flex-row">
              <button className=" text-black px-2 py-1 rounded-full  ">
                Delete
              </button>
              <button className=" text-black px-2 py-1 rounded-full ">
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Selecting the file */}
      <div className="mt-4 p-8 border-dashed border-2 border-gray-400 ">
        <p className="text-gray-500 text-center">
          Click to upload or drag and drop
        </p>
        <p className="text-blue-300 text-center">SVG, PNG, JPG or GIF</p>
        <p className="text-gray-500 text-center">(max 800 x 800px)</p>
        <input type="file" className="mt-2" />
      </div>

      {/* Cancel and Save Buttons */}
      <div className="mt-5 flex justify-end">
        <button className="px-6 py-2 mr-2 border-black-100 text-black rounded-md shadow hover:bg-gray-100">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-gray-600">
          Save
        </button>
      </div>

    </div>
  )
}

export default UploadImage