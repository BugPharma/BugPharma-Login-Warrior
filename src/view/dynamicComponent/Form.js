import React from 'react';
import { useDispatch } from 'react-redux';
import { formActions } from '../../stores/FormSlice';
import FormM from '../../manager/FormM';

function Form() {
    const formM = new FormM();
    const dispatch = useDispatch();

    function gestioneCsv(event) {
        const file = event.target.files[0];

        const reader = new FileReader();

        reader.onload = function (e) {
            const text = e.target.result;
            sendCsv(text);
        };
        reader.readAsText(file);
    }
    function sendCsv(text) {
        //props.change();/*SI POTREBBE USARE LO STORE INVECE, USATO SOTTO*/
        dispatch(formActions.deactive());
        formM.send(text);
    }

    return (
        <div className="box" id="form-container">
            <div className="form">
                <div className="title">Carica qui il CSV</div>
                <div className="content">
                    <form id="my-form">
                        <div className="form-button" id="csv-file">
                            <input
                                data-testid="input-csv"
                                type="file"
                                accept=".csv"
                                onChange={gestioneCsv}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Form;
