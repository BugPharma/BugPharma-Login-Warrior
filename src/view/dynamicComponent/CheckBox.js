import { useDispatch } from 'react-redux';
import { dimActions } from '../../stores/Dimension';
import React from 'react';

function CheckBox(props) {
    const dispatch = useDispatch();
    const checkRef = React.useRef();

    function trigger() {
        dispatch(dimActions.changeValue({ id: props.id, checked: checkRef.current.checked }));
    }

    return (
        <div className="checkbox" onClick={trigger}>
            <input
                type="checkbox"
                data-testid={`checkbox-${props.value}`}
                id={`checkbox-${props.value}`}
                ref={checkRef}
                checked={props.checked}
            />
            <label
                data-testid="label"
                htmlFor={`checkbox-${props.value}`}
            >{props.value}</label>
        </div>
    );
}
export default CheckBox;