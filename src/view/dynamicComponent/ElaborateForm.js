import CircleChart from './CircleChart';
import FormCheck from './FormCheck';
function elaborateForm(props) {
    return (
        <div className="new-form">
            <FormCheck list={props.list} isNumeric={props.isNumeric} isSelected={props.isSelected} />
            <div className="circle">
                <CircleChart name="scatter plot" img="scatter" />
                <CircleChart name="sankey diagram" img="sankey" />
                <CircleChart name="parallel coordinates" img="parallel" />
                <CircleChart name="force directed" img="force-directed" />
            </div>
        </div>
    );
}
export default elaborateForm;