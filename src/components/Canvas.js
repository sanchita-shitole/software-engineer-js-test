import { useState, useEffect, useRef } from "react"
import Constants from "../common/constants"
import { storePhoto, getLocalStorage, convertBase64ToBlob } from "../common/utils"
import Controls from './Controls'
const Canvas = ({ imgSrc, storageUpdated }) => {

    const canvasRef = useRef(null)
    const [cordinates, setCordinates] = useState({ x: 0, y: 0 })
    const [dim, setDim] = useState({ height: 0, width: 0 })

    const drawImage = (src, x, y, inputW, inputH, editMode = false, localFileObj = null) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = async function() {
                const photo_obj = (localFileObj || (editMode && getLocalStorage(src.name.split('.')[0]))) || {}
                const canvas = canvasRef.current
                var ctx = canvas.getContext("2d")


                if (localFileObj) {
                    img.width = localFileObj.width
                    img.height = localFileObj.height
                }

                const { width, height } = img

                if (typeof src !== 'string') {
                    /* if it file type store name, type and data of the file */
                    photo_obj.name = src.name
                    photo_obj.type = src.type
                    canvas.height = height
                    canvas.width = width
                    ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height)
                    photo_obj.dataUrl = canvas.toDataURL(src.type)
                }

                canvas.height = Constants.MAX_HEIGHT
                canvas.width = Constants.MAX_WIDTH
                
                const canvasW = parseInt(inputW || photo_obj.canvasWidth || Constants.MAX_WIDTH)
                const canvasH = parseInt(inputH || photo_obj.canvasHeight || Constants.MAX_HEIGHT)

                const _x = parseInt(x || photo_obj.x || 0)
                const _y = parseInt(y || photo_obj.y || 0)

                ctx.drawImage(img, 0, 0, width, height, _x, _y, canvasW, canvasH)

                photo_obj.height = height
                photo_obj.width = width
                photo_obj.x = _x
                photo_obj.y = _y
                photo_obj.canvasHeight = canvasH
                photo_obj.canvasWidth = canvasW
        
                await storePhoto(photo_obj)
                storageUpdated()
                setCordinates({x: _x, y: _y})
                setDim({height: canvasH, width: canvasW })
            }
        }
        const blob = typeof src === 'string' ? convertBase64ToBlob(src) : src
        reader.readAsDataURL(blob);
    }

    useEffect(()=>{
        if (!imgSrc?.file) {
            /* clear the canvas */
            const canvas = canvasRef.current
            canvas.height = Constants.MAX_HEIGHT
        }
        else {
            drawImage(imgSrc.file, 0, 0, 0, 0, false, imgSrc.fileObj)
        }
    },[imgSrc])

    const onValueChange = (e) => {
        const { value, name} = e.target
        switch(name) {
            case 'width': 
                drawImage(imgSrc.file, 0, 0, value, 0, true, imgSrc.fileObj)
                break
            case 'height': 
                drawImage(imgSrc.file, 0, 0, 0, value, true, imgSrc.fileObj)
                break
            case 'x': 
                drawImage(imgSrc.file, value, 0, 0, 0, true, imgSrc.fileObj)
                break
            case 'y': 
                drawImage(imgSrc.file, 0, value, 0, 0, true, imgSrc.fileObj)
                break
        }
    }

    return  <div className="grid-container">
                <canvas className='canvas' ref={canvasRef}></canvas>
                <Controls onValueChange={onValueChange} w={dim.width} h={dim.height} x={cordinates.x} y={cordinates.y}/>
            </div>
}

export default Canvas