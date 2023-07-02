import React, { useState } from 'react';

function ClipboardImageToBase64(props) {
  const [imageData, setImageData] = useState('');
  const [converted, setConverted] = useState(false);
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
      setImageData(base64Image);
      setConverted(true);
      setErrorMessage('');

      props.onValueChange(base64Image)

      console.log("Image loaded")
    };

    reader.readAsDataURL(file);
  };

  const reset = () => {
    setImageData('');
    setConverted(false);
    setErrorMessage('');

    props.onValueChange('')
  };

  const ImageGuide = ({ imageData }) => {
    if (imageData === null || imageData === '') {
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
      <ImageGuide imageData={imageData} />
      {errorMessage && <p className="error">{errorMessage}</p>}
      {converted && <img src={imageData} alt="Converted" className="image" />}
    </div>
  );
}

export default ClipboardImageToBase64;
