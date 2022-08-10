import CheckBox from './CheckBox';

function formCheck(props) {
    function createCheckboxes() {
        let checkboxes = [];
        for (let i = 0; i < props.list.length; i++) {
            if (props.isNumeric[i]) {
                checkboxes.push(<CheckBox
                    value={props.list[i]}
                    key={`key${i}`}
                    id={i}
                    checked={props.isSelected[i]}
                />);
            }
        }
        return checkboxes;
    }

    return (
        <div className="box">
            <div className="form">
                <div className="title">Scegli le dimensioni desiderate</div>
                <div className="contenuto">
                    <form id="my-form">
                        {createCheckboxes()}
                    </form>
                </div>
            </div>
        </div>
    );
}
export default formCheck;