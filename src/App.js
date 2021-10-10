import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import Header from './components/Header';
import SelectImageFromDevice from './components/SelectImageFromDevice';
import Canvas from './components/Canvas';
import { useState } from 'react';
import ImportFromLocal from './components/ImportFromLocal';


function App() {

  const [imgSrc, setImgSrc] = useState(null)
  const [storageHash, setStorageHash] = useState('inital')

  const uploadImage = (file) => {
    setImgSrc({file: file, init: true})
  }

  const storageUpdated = () => {
    setStorageHash(new Date().getMilliseconds())
  }

  const reDrawImageFromStorage = (img) => {
    setImgSrc({file: img?.dataUrl, init: false, fileObj: img})
  }

  return (
      <div className="app-container">
        <Header title={'Photo editor'}/>
        <div className="content">
          <div className="grid-container">
            <SelectImageFromDevice uploadImage={uploadImage}/>
            <ImportFromLocal hash={storageHash} reDraw={reDrawImageFromStorage}/>
          </div>
          <Canvas imgSrc={imgSrc} storageUpdated={storageUpdated}/>
        </div>
      </div>)
}

export default App;
