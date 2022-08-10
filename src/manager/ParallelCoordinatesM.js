import GraphM from './GraphM';
import * as d3 from 'd3';
import {sliderBottom} from 'd3-simple-slider';

class ParallelCoordinatesM extends GraphM {
    constructor(data) {
        super(data);
    }
    makeChart() {
        //override
        if (this.dimensionNumber() <= 1) {
            throw new Error(
                'Modificare la propria selezione, il grafico parallel coordinates vuole dalle 2 dimensioni scelte in su'
            );
        }
        let coords = [];
        for (let i = 0; i < this.dimensionNumber(); i++) {
            coords.push(this.takeCord(i));
        }
        this.d3Constructor(this.data, coords);
    }

    d3Constructor(allData, coords) {
        const margin = { top: 25, right: 25, bottom: 25, left: 50 },
            width = 600 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;
        // Append the svg object to the container.
        let svg = d3
            .select('#my-dataviz')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        // For each dimension, I build a linear scale. I store all in a y object
        let dimensions = [];
        for (let row of coords) {
            dimensions.push(row.cord);
        }
        let data = [];
        for (let row of allData) {
            let tmp = {};
            for (let d of dimensions) {
                tmp[d] = Number(row[d]);
            }
            data.push(tmp);
        }
        const dimensionsOriginal = dimensions.map((d) => d);
        let dragging = {},
            y = {};
        for (let i in dimensions) {
            let name = dimensions[i];
            y[name] = d3
                .scaleLinear()
                .domain(
                    d3.extent(data, function (d) {
                        return +d[name];
                    })
                )
                .range([height, 0]);
        }
        // Build the X scale -> it find the best position for each axis
        let x = d3.scalePoint().domain(dimensions).range([0, width]);
        // Add a foreground canvas
        const foreground = d3
            .select('#my-dataviz')
            .append('canvas')
            .attr('width', width)
            .attr('height', height);
        let foregroundCtx = foreground.node().getContext('2d');
        foregroundCtx.lineWidth = 1;
        let preferences = {
            bundlingDimension: dimensions[0],
            bundlingStrength: 0,
            compositing: 'source-over',
            opacity: 0.5,
            renderingRate: 0,
            smoothness: 0,
            statisticalColoring: false,
            statisticalColoringDimension: dimensions[0],
        };
        const bundling = {},
            statisticalColoring = {},
            setCompositing = function (compositing) {
                if (['source-over', 'lighter', 'darker', 'destination-over'].find(
                        (c) => c === compositing
                    )
                ) {
                    preferences['compositing'] = compositing === 'darker' ? 'difference' : compositing;
                    brushed();
                }
            },
            setOpacity = function (opacity) {
                if (0 <= opacity && opacity <= 1) {
                    preferences['opacity'] = opacity;
                    brushed();
                }
            },
            setRenderingRate = function (rate) {
                if (0 <= rate && rate <= 50) {
                    preferences['renderingRate'] = rate;
                    brushed();
                }
            },
            setSmoothness = function (smoothness) {
                if (0 <= smoothness && smoothness <= 1) {
                    preferences['smoothness'] = smoothness;
                    brushed();
                }
            };
        bundling.setDimension = function (dimension) {
            if (dimensions.find((d) => d === dimension)) {
                preferences['bundlingDimension'] = dimension;
                brushed();
            }
        };
        bundling.setStrength = function (strength) {
            if (0 <= strength && strength <= 1) {
                preferences['bundlingStrength'] = strength;
                brushed();
            }
        };
        statisticalColoring.enable = function (enable) {
            preferences['statisticalColoring'] = enable;
            brushed();
        };
        statisticalColoring.setDimension = function (dimension) {
            if (dimensions.find((d) => d === dimension)) {
                preferences['statisticalColoringDimension'] = dimension;
                brushed();
            }
        };

        function path(d) {
            return dimensions.map(function (p) {
                return [position(p), y[p](d[p])];
            });
        }

        function position(d) {
            const v = dragging[d];
            return v == null ? x(d) : v;
        }

        let timeouts = [];

        function render(data, ctx) {
            timeouts.forEach(t => {clearTimeout(t);});
            timeouts = [];
            ctx.clearRect(0, 0, width, height);
            ctx.globalAlpha = preferences['opacity'];
            ctx.globalCompositeOperation = preferences['compositing'];
            foregroundCtx.strokeStyle = '#316bff';
            let index = 0;
            clusteredData(data, preferences['bundlingDimension']).forEach(function (c) {
                let bundling = {};
                for (let i in dimensions) {
                    bundling[dimensions[i]] = 0;
                    for (let j in c) bundling[dimensions[i]] += c[j][dimensions[i]];
                    bundling[dimensions[i]] /= c.length;
                }
                c.forEach(function (d, i) {
                    c[i] = path(d);
                });
                bundling = path(bundling);
                c.forEach((p) => {
                    renderLineProgressive(p, bundling, index++);
                });
            });

            function clusteredData(data, dimension) {
                let array = [];
                data.forEach(function (d) {
                    let key = d[dimension];
                    if (array[key] == null) array[key] = [];
                    array[key].push(d);
                });
                return array;
            }

            function renderLine(p, bundling) {
                let smoothness = preferences['smoothness'] * 0.75,
                    strength = preferences['bundlingStrength'];
                if (preferences['statisticalColoring']) {
                    let d = dimensions.indexOf(preferences['statisticalColoringDimension']);
                    ctx.strokeStyle = d3.scaleLinear()
                        .domain([0, height])
                        .range(['#316bff', '#00ff00'])
                        .interpolate(d3.interpolateLab)(p[d][1]);
                }
                ctx.beginPath();
                ctx.moveTo(p[0][0], p[0][1]);
                for (let i = 1; i < dimensions.length; ++i) {
                    let x = (p[i - 1][0] + p[i][0]) / 2,
                        y = (p[i - 1][1] + p[i][1]) / 2;
                    y = y * (1 - strength) + ((bundling[i - 1][1] + bundling[i][1]) / 2) * strength;
                    let cp1x = p[i - 1][0] + smoothness * (x - p[i - 1][0]),
                        cp1y = p[i - 1][1],
                        cp2x = x - smoothness * strength * (x - p[i - 1][0]),
                        cp2y = y - smoothness * strength * (p[i][1] - y);
                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                    cp1x = x + smoothness * strength * (p[i][0] - x);
                    cp1y = y + smoothness * strength * (p[i][1] - y);
                    cp2x = p[i][0] - smoothness * (p[i][0] - x);
                    cp2y = p[i][1];
                    x = p[i][0];
                    y = p[i][1];
                    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
                }
                ctx.stroke();
            }

            function renderLineProgressive(p, bundling, index) {
                let rate = preferences['renderingRate'];
                timeouts.push(setTimeout(
                    function() {renderLine(p, bundling)},
                    rate * index)
                );
            }
        }
        // Add a group element for each dimension.
        let g = svg
            .selectAll('.dimension')
            .data(dimensions)
            .enter()
            .append('g')
            .attr('class', 'dimension')
            .attr('transform', function (d) {
                return 'translate(' + x(d) + ')';
            })
            .each(function (d) {
                d3.select(this).call(
                    d3
                        .drag()
                        .on('start', function (e) {
                            dragging[e.subject] = x(e.subject);
                        })
                        .on('drag', function (e) {
                            dragged(e);
                        })
                        .on('end', function (e) {
                            delete dragging[e.subject];
                            d3.select(this)
                                .transition()
                                .duration(500)
                                .attr('transform', 'translate(' + x(e.subject) + ')');
                            brushed();
                        })
                );
            });
        // Add an axis and title.
        g.append('g')
            .attr('class', 'axis')
            .each(function (d) {
                d3.select(this).call(d3.axisLeft().scale(y[d]));
            })
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('y', -9)
            .text(function (d) {
                return d;
            })
            .style('fill', 'black');
        // Add and store a brush for each axis.
        g.append('g')
            .attr('class', 'brush')
            .each(function (d) {
                d3.select(this).call(
                    d3
                        .brushY()
                        .extent([
                            [-10, 0],
                            [10, height],
                        ])
                        .on('start', function (e) {e.sourceEvent.stopPropagation();})
                        .on('brush end', brushed)
                );
            })
            .selectAll('rect')
            .attr('x', -8)
            .attr('width', 16);
        // Handles a brush event
        function brushed() {
            let selections = {};
            dimensionsOriginal.forEach(function (d, i) {
                selections[d] = d3.brushSelection(g.selectAll('.brush').nodes()[i]);
            });
            let selectedDims = dimensionsOriginal.filter(
                    (d) => selections[d] != null
                ),
                selectedData = data;
            if (selectedDims.length > 0) {
                selectedData = data.filter(function (d) {
                    return selectedDims.every(function (s) {
                        return (
                            y[s](d[s]) >= selections[s][0] && y[s](d[s]) <= selections[s][1]
                        );
                    });
                });
            }
            render(selectedData, foregroundCtx);
        }

        function dragged(event) {
            dragging[event.subject] = Math.min(width, Math.max(0, event.x));
            brushed();
            dimensions.sort(function (a, b) {
                return position(a) - position(b);
            });
            x.domain(dimensions);
            g.attr('transform', function (d) {
                return 'translate(' + position(d) + ')';
            });
        }

        // Plot the lines
        brushed();
        // Add inputs
        d3.select('#pc-personalization').style('display', 'block');
        dimensions.forEach(d => {
            d3.select('#pc-bundling-dimension')
                .append('option')
                .text(d);
            d3.select('#pc-statistical-color-dim')
                .append('option')
                .text(d);
        });
        ['source-over', 'lighter', 'darker', 'destination-over'].forEach(function (c) {
            d3.select('#pc-compositing')
                .append('option')
                .text(c);
        });
        d3.select('#pc-bundling-strength')
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
                    .default(0)
                    .on('onchange', (num) => {
                        console.log(num);
                        bundling.setStrength(num);
                    })
            );
        d3.select('#pc-smoothness')
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
                    .default(0)
                    .on('onchange', (num) => {
                        setSmoothness(num);
                    })
            );
        d3.select('#pc-bundling-dimension')
            .on('change', function (e) {
                bundling.setDimension(e.target.value);
            });
        d3.select('#pc-statistical-color')
            .on('click', function (e) {
                statisticalColoring.enable(e.target.checked);
            });
        d3.select('#pc-statistical-color-dim')
            .on('change', function (e) {
                statisticalColoring.setDimension(e.target.value);
            });
        d3.select('#pc-opacity')
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
                    .default(0.5)
                    .on('onchange', (num) => {
                        setOpacity(num);
                    })
            );
        d3.select('#pc-compositing')
            .on('change', function (e) {
                setCompositing(e.target.value);
            });
        d3.select('#pc-rendering-rate')
            .append('svg')
            .attr('width', 300)
            .attr('viewBox', [0, 0, 350, 100])
            .attr('style', 'max-width: 100%;')
            .append('g')
            .attr('transform', 'translate(30,30)')
            .call(
                sliderBottom()
                    .min(0)
                    .max(50)
                    .step(1)
                    .width(300)
                    .default(0)
                    .on('onchange', (num) => {
                        setRenderingRate(num);
                    })
            );
    }
}

export default ParallelCoordinatesM;
