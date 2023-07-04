import React, { useState } from 'react';

function ClipboardImageToBase64(props) {
  const [errorMessage, setErrorMessage] = useState('');

  const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const files = clipboardData.files;
    const imageFile = files[0];

    if (imageFile && imageFile.type.startsWith('image/')) {
      convertImageToBase64(imageFile);
    } else {
      setErrorMessage('Please paste an image file');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
      convertImageToBase64(file);
    } else {
      setErrorMessage('Please select an image file');
    }
  };

  const convertImageToBase64 = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64Image = e.target.result;
      setErrorMessage('');

      props.onValueChange(base64Image)

      console.log("Image loaded")
    };

    reader.readAsDataURL(file);
  };

  // const loadBase64 = (base64ImageStr) => {
  //   if((base64ImageStr + '').length< 10) {
  //     return;
  //   }

  //   const base64Image = base64ImageStr;
  //   setImageData(base64Image);
  //   setConverted(true);
  //   setErrorMessage('');

  //   console.log("From Image loaded")
  // };

  // loadBase64(props.base64Image)

  const reset = () => {
    setErrorMessage('');

    props.onValueChange('')
  };

  var imageData = props.base64Image
  var converted = (imageData === null || imageData === '' || imageData === undefined) === false


  const ImageGuide = ({ imageData }) => {
    console.log("ImageData", imageData)
    if (converted === false) {
      return (<div>
        <textarea
          onPaste={handlePaste}
          placeholder="Paste an image here"
        ></textarea>
        <p>OR Upload an image file:</p>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>);
    }

    return <button onClick={reset}>Reset</button>;
  }

  return (
    <div className="image-container">
      <ImageGuide imageData={props.base64Image} />
      {errorMessage && <p className="error">{errorMessage}</p>}
      {converted && <img src={props.base64Image} alt="Converted" className="image" />}
    </div>
  );
}

export default ClipboardImageToBase64;
