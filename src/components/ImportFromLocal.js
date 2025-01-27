import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { getLocalStorage } from '../common/utils';

const ImportFromLocal = ({hash, reDraw}) => {
    const [imgList, setImgList] = useState(null)
    const [selectedFile, setSelectedFile] = useState('')

    useEffect(()=>{
        /* once storage is updated then create select options */
        const images = getLocalStorage()
        setImgList(images && Object.keys(images))
    },[hash])

    const onFileChange = (event) => {
        /* load image file from local storage */
        const value = event.target.value
        setSelectedFile(value)
        if (value) {
            ;(async() => {
                const img = await getLocalStorage(value)
                if (!img) {
                    /* if no file is found, that means local storage is cleared somehow, reset list */
                    setImgList(null)
                } else {
                    reDraw(img)
                }
            })()
        } else {
            /* clear the canvas */
            reDraw('')
        }
    }

    return <>
                <div>
                    <Form.Label>Choose recently edited photo</Form.Label>
                    <Form.Select aria-label="Default select example" value={selectedFile} onChange={onFileChange}>
                    <option id={`empty-value`} key={`empty-value`} value={''}>Clear canvas</option>
                        {imgList && imgList.map((key)=>{
                            return <option id={key} key={key} value={key}>{key}</option>
                        })}
                    </Form.Select>
                </div>
        </>
}

export default ImportFromLocal