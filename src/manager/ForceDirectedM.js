import GraphM from './GraphM';
import * as d3 from 'd3';
import GraphException from '../exception/GraphException';

class ForceDirectedM extends GraphM {
    constructor(data) {
        super(data);
    }

    makeChart() {//override
        if (this.dimensionNumber() !== 2) {
            throw new GraphException(
                'Modificare la propria selezione, il grafico force directed vuole 2 dimensioni scelte',
                this.dimensionNumber(),
                2
            );
        }
        let coords = [];
        for (let i = 0; i < this.dimensionNumber(); i++) {
            coords.push(this.takeCord(i));
        }
        let sample = [];
        if (this.data.length) {
            for (let i = 0; i < 40; i++) {
                const el = this.data[Math.floor(Math.random() * (this.data.length - 1))];
                sample.push(el);
            }
        }
        const onlyValues = sample.map((row) => Object.values(row));
        let data = [];
        sample.forEach((elt, index) => {
            const arrayTemp = coords.map((c) => onlyValues[index][c.index]);
            data.push(arrayTemp);
        });

        //START ELABORAZIONI DATI -------------------------------------------------------------

        const min = [];
        min[0] = Math.min(...data.map((d) => d[0]));
        min[1] = Math.min(...data.map((d) => d[1]));

        const max = [];
        max[0] = Math.max(...data.map((d) => d[0]));
        max[1] = Math.max(...data.map((d) => d[1]));

        const normalized = data.map((d) => (d[0] - min[0])/(max[0] - min[0]));
        const normalized2 = data.map((d) => (d[1] - min[1])/(max[1] - min[1]));

        //Correzione per array normalizzati NaN (succede se si inserisce solo una coordinata, oppure se una coordinata ha valori tutti uguali)
        if(isNaN(normalized[0])){
            data.forEach((row, i) => {
                if (row[0])
                    normalized[i] = 1;
                else
                    normalized[i] = 0;
            });
        }
        if(isNaN(normalized2[0])){
            data.forEach((row, i) => {
                if (row[0])
                    normalized2[i] = 1;
                else
                    normalized2[i] = 0;
            });
        }
        const nodes = data.map((d, i) => ({
            id: d,
            size: [
                Math.round(normalized[i] * 10) + 5,
                Math.round(normalized2[i] * 10) + 5
            ]
        }));
        const links = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i; j < nodes.length; j++) {
                if (Math.abs(normalized[i]-normalized[j]) < 0.3 &&
                    Math.abs(normalized2[i]-normalized2[j]) < 0.3 &&
                    (i !== j) ) {
                    links.push({
                        source: i,
                        target: j,
                        weight: Math.abs(normalized[i]-normalized[j]) + Math.abs(normalized2[i]-normalized2[j])
                    });
                }
            }
        }
        const obj = {
            nodes: nodes,
            links: links
        }

        //END ELABORAZIONI DATI -------------------------------------------------------------

        this.d3Constructor(obj);
    }

    d3Constructor(obj) {
        const margin = {top: 25, right: 25, bottom: 25, left: 25},
            width = 600 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
        const svg = d3.select('#my-dataviz')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('data-testid', 'svg')
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        let preferences = {
            nodeLabels: 'Nessuna',
            variableNodeRadius: false,
        };
        const variableNodeRadius = {};
        variableNodeRadius.enable = function (enable) {
            preferences['VariableNodeRadius'] = enable;
            ticked();
        };
        const setNodeLabels = function (nodeLabels) {
            if (['Nessuna', 'I Dimensione', 'II Dimensione', 'Entrambe'].find(
                    (c) => c === nodeLabels
                )
            ) {
                preferences['nodeLabels'] = nodeLabels;
            }
            ticked();
        }
        const simulation = d3.forceSimulation(obj.nodes)
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('link', d3.forceLink().links(obj.links))
            .force('x', d3.forceX(width/3).strength(0.05))
            .force('y', d3.forceY(height/3).strength(0.05))
            .on('tick', ticked);
        const link = svg.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(obj.links)
            .enter()
            .append('line')
            .attr('stroke', '#517c9a')
            .attr('stroke-width', (d) => Math.pow(2 - d.weight, 4) - 3)
            .attr('stroke-opacity', 0.4)
            .attr('stroke-linecap', 'round');
        const node = svg.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(obj.nodes)
            .enter()
            .append('circle')
            .attr('r', 10)
            .attr('fill', '#0eadf1')
            .attr('stroke', '#f8f3ed')
            .attr('stroke-width', 2)
            .call(drag(simulation));
        var text = svg.append('g').selectAll('text')
            .data(obj.nodes)
            .enter().append('text')
            .attr('x', 8)
            .attr('y', '.31em');

        function ticked() {
            //update link positions
            //simply tells one end of the line to follow one node around
            //and the other end of the line to follow the other node around
            link
                .attr('x1', function(d) { return d.source.x; })
                .attr('y1', function(d) { return d.source.y; })
                .attr('x2', function(d) { return d.target.x; })
                .attr('y2', function(d) { return d.target.y; });
            //update circle positions each tick of the simulation
            node
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
                .attr('r', function(d){
                    if(preferences['VariableNodeRadius']) {
                        if (preferences['nodeLabels'] === 'Nessuna') return 10;
                        else if (preferences['nodeLabels'] === 'I Dimensione') return d.size[0];
                        else if (preferences['nodeLabels'] === 'II Dimensione') return d.size[1];
                        else if (preferences['nodeLabels'] === 'Entrambe') return (d.size[0] + d.size[1])/2;
                    }
                    else{
                        return 10;
                    }
                });
            //update text position each tick
            text
                .attr('x', function(d) { return d.x; })
                .attr('y', function(d) { return d.y; })
                .text(function(d){
                    if(preferences['nodeLabels'] === 'Nessuna') return '';
                    else if(preferences['nodeLabels'] === 'I Dimensione') return d.id[0];
                    else if(preferences['nodeLabels'] === 'II Dimensione') return d.id[1];
                    else if(preferences['nodeLabels'] === 'Entrambe') return d.id;
                });
        }

        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
            }

            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }

            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
            }

            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }

        //APPEND CHECKBOX AND SELECTOR FOR PERSONALIZATION

        // Add inputs
        d3.select('#fdg-personalization').style('display', 'block');

        //Selector
        ['Nessuna', 'I Dimensione', 'II Dimensione', 'Entrambe'].forEach(function (c) {
            d3.select('#fdg-label-content')
                .append('option')
                .text(c);
        });

        d3.select('#fdg-label-content')
            .on('change', function (e) {
                setNodeLabels(e.target.value);
            });

        //Checkbox
        d3.select('#fdg-variable-nodes')
            .on('change', function (e) {
                variableNodeRadius.enable(e.target.checked);
            });
    }

}

export default ForceDirectedM;