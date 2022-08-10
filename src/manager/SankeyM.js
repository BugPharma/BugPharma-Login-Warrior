import GraphM from './GraphM';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';
import {sliderBottom} from 'd3-simple-slider';
import GraphException from '../exception/GraphException';

class SankeyM extends GraphM {
    constructor(data) {
        super(data);
    }

    makeChart() {
        //override
        if (this.dimensionNumber() !== 2) {
            throw new GraphException(
                'Modificare la propria selezione, il grafico sankey diagram vuole 2 dimensioni scelte',
                this.dimensionNumber(),
                2
            );
        }
        let coords = [];
        for (let i = 0; i < this.dimensionNumber(); i++) {
            coords.push(this.takeCord(i));
        }
        let onlyValues = [];
        for (let row of this.data) {
            onlyValues.push(Object.values(row));
        }
        // Array valori
        let data = [];
        onlyValues.forEach((elt, index) => {
            let arrayTemp = [];
            coords.forEach((element) => {
                arrayTemp.push(onlyValues[index][element.index]);
            });
            data.push(arrayTemp);
        });
        let occur = data.reduce((counter, item) => {
            counter[item] = counter.hasOwnProperty(item) ? counter[item] + 1 : 1;
            return counter;
        }, {});
        const values = Object.values(occur);
        const sep_entries = Object.keys(occur).map((elem) => elem.split(','));
        // Array su cui lavorare
        let sankeyData = { nodes: [], links: [] };
        // Ciclo for che non delude mai
        for (let i = 0; i < sep_entries.length; i++) {
            // attacco il nome del dato a tutti i dati
            let tmp1 = coords[0].cord + ' ' + sep_entries[i][0];
            let tmp2 = coords[1].cord + ' ' + sep_entries[i][1];
            sankeyData.nodes.push({ name: tmp1 });
            sankeyData.nodes.push({ name: tmp2 });
            sankeyData.links.push({
                source: tmp1,
                target: tmp2,
                value: +values[i],
            });
        }
        this.d3Constructor(sankeyData, coords);
    }

    d3Constructor(sankeyData, coords) {
        //----------------- Setup array -----------------
        // Ritorna solo i nodi distinti
        sankeyData.nodes = Array.from(
            d3.group(sankeyData.nodes, (d) => d.name),
            ([value]) => value
        );
        // Loop through each link replacing the text with its index from node
        sankeyData.links.forEach((d, i) => {
            sankeyData.links[i].source = sankeyData.nodes.indexOf(sankeyData.links[i].source);
            sankeyData.links[i].target = sankeyData.nodes.indexOf(sankeyData.links[i].target);
        });
        // Loop su ogni nodo per rendere ognuno di essi un array di oggetti
        // invece che uno di stringhe
        sankeyData.nodes.forEach(function (d, i) {
            sankeyData.nodes[i] = { name: d };
        });
        //----------------- Setup diagramma -----------------
        let margin = { top: 25, right: 25, bottom: 25, left: 25 },
            width = 600 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
        // format variables (blocchi source target)
        let formatNumber = d3.format(',.0f');
        let format = (d) => {return formatNumber(d);};
        let color = d3.scaleOrdinal(d3.schemeCategory10);
        // Attacca l'oggetto svg al body della pagina
        let svg = d3
            .select('#my-dataviz')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .attr('data-testid', 'svg');
        // Setta le proprietà del diagramma
        let sankey = d3Sankey.sankey()
            .nodeWidth(36)
            .nodePadding(15)
            .extent([[1, 1], [width - 1, height - 6]]);

        let path = sankey.links();

        // Assegno la variabile graph all'oggetto che contiene le info
        let graph = sankey(sankeyData);

        // Aggiungo i link
        let link = svg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .selectAll('.link')
            .data(graph.links)
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('d', d3Sankey.sankeyLinkHorizontal())
            .attr('stroke-width', (d) => {return d.width;});

        // Aggiungo le etichette dei link
        link.append('title').text(function (d) {
            return d.source.name + ' -> ' + d.target.name + '\nFlusso: ' + format(d.value);
        });

        let diff;

        graph.nodes.forEach(function (n) {
            n.currentY = n.y0;
        });

        // Aggiungo i nodi
        let node = svg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`)
            .selectAll('.node')
            .data(graph.nodes)
            .enter()
            .append('g')
            .attr('class', 'node')
            .call(d3.drag()
                .on('start', function (e, d) {
                    diff = e.y - d.currentY;
                })
                .on('drag', dragmove)
                .on('end', function (e, d) {
                    d.currentY = e.y - diff;
                })
            );

        // Aggiungo i rettangoli per i nodi
        node
            .append('rect')
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            .attr('width', sankey.nodeWidth())
            .style('fill', function (d) { return (d.color = color(d.name)); })
            .style('stroke', function (d) { return d3.rgb(d.color).darker(2); })
            .append('title')
            .text(function (d) { return d.name + '\nOccorrenze: ' + format(d.value); });

        // Aggiungo i titoli dei nodi
        node
            .append('text')
            .attr('x', function (d) { return d.x0 - 6; })
            .attr('y', function (d) { return (d.y1 + d.y0) / 2; })
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .text(function (d) { return d.name; })
            .filter(function (d) { return d.x0 < width / 2; })
            .attr('x', function (d) { return d.x1 + 6; })
            .attr('text-anchor', 'start');

        console.log(graph.links);

        function dragmove(e, d) {
            console.log(d);
            d3
                .select(this)
                .attr('transform', 'translate(' +
                    0 +
                    ',' +
                    Math.max(- d.y0, Math.min(height - d.y1, e.y - diff - d.y0)) +
                    ')'
                );
            let linkSourceWidth = 0, linkTargetWidth = 0;
            graph.links
                .filter((link) => link.source.name === d.name || link.target.name === d.name)
                .sort(function(link1, link2) {
                    if (link1.source.name === d.name)
                        return link1.target.currentY > link2.target.currentY;
                    else
                        return link1.source.currentY > link2.source.currentY;
                })
                .forEach(function (link) {
                    if (link.source.name === d.name) {
                        link.y0 = linkSourceWidth + link.width / 2 + d.y0 + Math.max(- d.y0, Math.min(height - d.y1, e.y - diff - d.y0));
                        linkSourceWidth += link.width;
                    } else {
                        link.y1 = linkTargetWidth + link.width / 2 + d.y0 + Math.max(- d.y0, Math.min(height - d.y1, e.y - diff - d.y0));
                        linkTargetWidth += link.width;
                    }
                });
            link.attr('d', d3Sankey.sankeyLinkHorizontal());
        }

        function setLinksOpacity(opacity) {
            if (0 <= opacity && opacity <= 1) {
                link.style('stroke-opacity', opacity);
            }
        }

        setLinksOpacity(0.25);

        d3.select('#sankey-opacity')
            .append('svg')
            .attr('width', 300)
            .attr('viewBox', [0, 0, 350, 100])
            .attr('style', 'max-width: 100%;')
            .append('g')
            .attr('transform', 'translate(30,30)')
            .call(
                sliderBottom()
                    .min(0)
                    .max(1)
                    .step(0.01)
                    .width(300)
                    .tickFormat(d3.format('.0%'))
                    .default(0.25)
                    .on('onchange', (num) => {
                        setLinksOpacity(num);
                    })
            );

        d3.select('#sankey-personalization')
            .style('display', 'block');
    }
}

export default SankeyM;
