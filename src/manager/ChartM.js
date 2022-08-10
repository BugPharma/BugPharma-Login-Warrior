import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router';
import ParallelCoordinatesM from './ParallelCoordinatesM';
import ScatterM from './ScatterM';
import SankeyM from './SankeyM';
import ForceDirectedM from './ForceDirectedM';

class ChartM {
    constructor(name) {
        this.graph = name;
        this.scatter = new ScatterM(this.data);
        this.parallel = new ParallelCoordinatesM(this.data);
        this.sankey = new SankeyM(this.data);
        this.force = new ForceDirectedM(this.data);
    }

    data = useSelector((state) => state.data.data);
    navigate = useNavigate();

    makeChart() {
        if (this.graph === 'scatter plot') {
            try {
                this.scatter.makeChart();
            } catch (error) {
                this.navigate(-1);
                alert(error.message + error.messageDim());
                return false;
            }
        } else if (this.graph === 'parallel coordinates') {
            try {
                this.parallel.makeChart();
            } catch (error) {
                this.navigate(-1);
                alert(error.message);
                return false;
            }
        } else if (this.graph === 'sankey diagram') {
            try {
                this.sankey.makeChart();
            } catch (error) {
                this.navigate(-1);
                alert(error.message + error.messageDim());
                return false;
            }
        } else {
            if (this.graph === 'force directed') {
                try {
                    this.force.makeChart();
                } catch (error) {
                    this.navigate(-1);
                    alert(error.message + error.messageDim());
                    return false;
                }
            }
        }

        const hamburger = document.getElementById('hamburger-menu');
        if (hamburger) {
            hamburger.style.display = 'block';
        }
        const menu = document.getElementById('personalization');
        if (menu) {
            menu.style.width = '0';
            menu.style.transition = 'width .5s';
        }

        return true;
    }
}

export default ChartM;
