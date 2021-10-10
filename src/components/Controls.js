import { Form } from "react-bootstrap"
import Constants from "../common/constants"
const Controls = ({w, h, x, y, onValueChange}) => {

    return <div className="control-container">
        <Form.Group className="mb-3" controlId="photoWidth">
            <Form.Label>Width</Form.Label>
            <Form.Control type="number" name="width" value={w} max={Constants.MAX_WIDTH} min={1} onChange={onValueChange}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="photoHeight">
            <Form.Label>Height</Form.Label>
            <Form.Control type="number" name="height" value={h} max={Constants.MAX_HEIGHT} min={1} onChange={onValueChange}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="photoX">
            <Form.Label>X</Form.Label>
            <Form.Control type="number" name="x" value={x} onChange={onValueChange}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="photoY">
            <Form.Label>Y</Form.Label>
            <Form.Control type="number" name="y" value={y} onChange={onValueChange}/>
        </Form.Group>
    </div>
}

export default Controls