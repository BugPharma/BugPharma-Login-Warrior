import ChartM from '../../manager/ChartM';
import {useNavigate} from 'react-router';

function CircleChart(props) {
    const chartM = new ChartM(props.name);
    const navigate = useNavigate();

    async function trigger() {
        await navigate('plot');
        chartM.makeChart();
    }

    return (
        <div className={`circle-${props.img}`} onClick={trigger}>
            <p data-testid={`circle-${props.img}`}>{props.name}</p>
        </div>
    );
}
export default CircleChart;
