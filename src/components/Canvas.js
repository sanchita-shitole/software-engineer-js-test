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
                    /* update img wifth and height from local storage */
                    img.width = localFileObj.width
                    img.height = localFileObj.height
                }

                const { width, height } = img

                if (typeof src !== 'string') {
                    /* if it is file type store name, type and data of the file */
                    photo_obj.name = src.name
                    photo_obj.type = src.type
                    canvas.height = height
                    canvas.width = width

                    /* calculate correct height and width of image into data url */
                    ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height)
                    photo_obj.dataUrl = canvas.toDataURL(src.type)
                }
                
                /* reset canvas width and height */
                canvas.height = Constants.MAX_HEIGHT
                canvas.width = Constants.MAX_WIDTH
                
                /* new photo will be resized to MAX_WIDTH and MAX_HEIGHT and for edited photo it will resized by stored data or current parameters */
                const canvasW = parseInt(inputW || photo_obj.canvasWidth || Constants.MAX_WIDTH)
                const canvasH = parseInt(inputH || photo_obj.canvasHeight || Constants.MAX_HEIGHT)
                const _x = parseInt(x || photo_obj.x || 0)
                const _y = parseInt(y || photo_obj.y || 0)

                ctx.drawImage(img, 0, 0, width, height, _x, _y, canvasW, canvasH)

                /* store current values in localstorage */
                photo_obj.height = height
                photo_obj.width = width
                photo_obj.x = _x
                photo_obj.y = _y
                photo_obj.canvasHeight = canvasH
                photo_obj.canvasWidth = canvasW
                await storePhoto(photo_obj)

                /* send a signal that storage is updated now */
                storageUpdated()

                /* set controls */
                setCordinates({x: _x, y: _y})
                setDim({height: canvasH, width: canvasW })
            }
        }
        const blob = typeof src === 'string' ? convertBase64ToBlob(src) : src
        reader.readAsDataURL(blob);
    }

    useEffect(()=>{
        if (!imgSrc?.file) {
            /* clear the canvas if no file is selected */
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
            default:
                console.error("Not a valid input")
                break
        }
    }

    return  <div className="grid-container">
                <div>
                    {typeof imgSrc?.file === 'string' ? imgSrc.fileObj?.name : imgSrc?.file?.name || 'Please select photo from above two options'}
                    <canvas className='canvas' ref={canvasRef} id="canvas"></canvas>
                </div>
                <Controls onValueChange={onValueChange} w={dim.width} h={dim.height} x={cordinates.x} y={cordinates.y}/>
            </div>
}

export default Canvas