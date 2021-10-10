import { useState } from 'react'
import { Form, Toast, ToastContainer } from "react-bootstrap"

const SelectImageFromDevice = ({ uploadImage = () => void 0 }) => {

    const [err, setErr] = useState('')

    const handleChange = (event) => {
        try {
            uploadImage(event.target.files[0])
        }
        catch(err){
            setErr('Selected photo is corrupted, please choose another photo')
        }
    }

    return  (<>
                <Form.Group>
                    <Form.Label>Upload photo from your device (only png / jpeg / gif)</Form.Label>
                    <Form.Control type="file" accept="image/*" name="image" id="fileUpload" onChange={handleChange} />
                </Form.Group>
               { err && 
               <ToastContainer className="p-3" position={'top-end'}>
                   <Toast className="d-inline-block m-1" bg="warning" onClose={() => setErr('')} show={err} delay={3000} autohide>
                        <Toast.Header>
                        </Toast.Header>
                        <Toast.Body>
                            {err}
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
                }
           </>)
}

export default SelectImageFromDevice