// setup
var scene1 = d3.select('#scene1');

var width = 900;
var height = 600;
var margin = { top: 50, right: 50, bottom: 50, left: 100 };

var x = d3.scaleLinear()
    .domain([0, 100])
    .range([margin.left, width - margin.right]);

var y = d3.scaleLinear()
    .range([height - margin.bottom, margin.top]);

var xAxis = d3.axisBottom()
    .scale(x);

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(5);

scene1.append("g")
    .attr("transform", "translate(0," + (height - margin.bottom) + ")")
    .attr("class", "axis")
    .call(xAxis);

scene1.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
    .attr("class", "axis")
    .call(yAxis);

scene1.append('text')
    .attr('x', width / 2)
    .attr('y', height - 10)
    .attr('text-anchor', 'middle')
    .text('Value');

scene1.append('text')
    .attr('x', -height / 2)
    .attr('y', 15)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Frequency');

var bar_tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white");

var country_tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white");

// first scene
async function load1(setting) {
    d3.csv("data.csv").then(function (data) {
        var adlIndexValues = data.map(d => +d['Antisemitism Index']);

        var histogramData = adlIndexValues;

        var adlIndexHistogram = d3.histogram()
            .value(d => d)
            .domain([0, 100])
            .thresholds(x.ticks(20));

        x.domain([0, 100]);
        y.domain([0, d3.max(adlIndexHistogram(histogramData), d => d.length)]);

        var bars = scene1.selectAll("rect")
            .data(adlIndexHistogram(histogramData));

        bars.enter()
            .append("rect")

            .merge(bars)
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", d => x(d.x1) - x(d.x0) - 1)
            .attr("height", d => height - margin.bottom - y(d.length))
            .attr("fill", "#91a3b0")
            .on("mouseover", function (d) {
                bar_tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);

                var countriesInBin = setting === "antisemitism" ? data.filter(row => row['Antisemitism Index'] >= d.x0 && row['Antisemitism Index'] < d.x1)
                    .map(row => row.country) : data.filter(row => row["Democracy Index"] >= d.x0 && row["Democracy Index"] < d.x1)
                    .map(row => row.country);

                country_tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                country_tooltip.html(`${countriesInBin.join("<br>")}`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                bar_tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);

                country_tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        bars.exit().remove();

        var histogramData = setting === "antisemitism" ? data.map(d => +d['Antisemitism Index']) : data.map(d => +d["Democracy Index"]);

        var histogram = d3.histogram()
            .value(d => d)
            .domain([0, 100])
            .thresholds(x.ticks(20));

        x.domain([0, 100]);
        y.domain([0, d3.max(histogram(histogramData), d => d.length)]);

        var bars = scene1.selectAll("rect")
            .data(histogram(histogramData));

        bars.enter()
            .append("rect")
            .merge(bars)
            .transition()
            .duration(2000)
            .attr("x", d => x(d.x0))
            .attr("y", d => y(d.length))
            .attr("width", d => x(d.x1) - x(d.x0) - 1)
            .attr("height", d => height - margin.bottom - y(d.length))
            .attr("fill", setting === "antisemitism" ? "#91a3b0" : "#c4c3d0")
            .on("mouseover", function (d) {
                bar_tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                var countriesInBin = setting === "antisemitism" ? data.filter(row => row['Antisemitism Index'] >= d.x0 && row['Antisemitism Index'] < d.x1)
                    .map(row => row.country) : data.filter(row => row["Democracy Index"] >= d.x0 && row["Democracy Index"] < d.x1)
                    .map(row => row.country);

                country_tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                country_tooltip.html(`${countriesInBin.join("<br>")}`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                bar_tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);

                country_tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        bars.exit().remove();

        scene1.selectAll(".axis").remove();
        scene1.append("g")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .attr("class", "axis")
            .call(xAxis);

        scene1.append("g")
            .attr("transform", "translate(" + margin.left + ",0)")
            .attr("class", "axis")
            .call(yAxis);
    });
}

function change(setting) {
    load1(setting);
}

// second scene


var tooltip = d3.select("body")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white");

async function load2(column) {
    d3.csv("data.csv").then(function (data) {
        var adlIndexValues = data.map(d => +d['Antisemitism Index']);
        var selectedColumnValues = data.map(d => +d[column]);

        var width = 900;
        var height = 600;
        var margin = { top: 50, right: 50, bottom: 50, left: 100 };

        var x = d3.scaleLinear()
            .range([margin.left, width - margin.right]);

        var y = d3.scaleLinear()
            .range([height - margin.bottom, margin.top]);

        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxis = d3.axisLeft()
            .scale(y)
            .ticks(5);

        var svg = d3.select('#scene2');
        svg.selectAll("*").remove();

        x.domain([d3.min(adlIndexValues), d3.max(adlIndexValues)]);
        y.domain([d3.min(selectedColumnValues), d3.max(selectedColumnValues)]);

        var dots = svg.selectAll("circle")
            .data(data);

        svg.append("g")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .attr("class", "axis")
            .call(xAxis);

        svg.append("g")
            .attr("transform", "translate(" + margin.left + ",0)")
            .attr("class", "axis")
            .call(yAxis);

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 10)
            .attr('text-anchor', 'middle')
            .text('Antisemitism Index');

        svg.append('text')
            .attr('x', -height / 2)
            .attr('y', 30)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text(column);

        dots.enter()
            .append("circle")
            .merge(dots)
            // .transition()
            // .duration(2000)
            .attr("cx", d => x(+d['Antisemitism Index']))
            .attr("cy", d => y(+d[column]))
            .attr("r", 5)
            .attr("fill", "#696969")
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(d.country)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        dots.exit().remove();
    });
}

// third scene

async function load3() {
    d3.csv("data.csv").then(function (data) {
        var columns = ["Antisemitism Index", "Democracy Index", "GDP per capita (current US$)",
        "Labor force, female (% of total labor force)", "Unemployment, total (% of total labor force)",
            "Unemployment, female (% of female labor force)", "Internet users (per 100 people)"];

        var width = 1200;
        var height = 800;
        var margin = { top: 100, right: 100, bottom: 250, left: 250 };

        var colorScale = d3.scaleSequential(d3.interpolateGreys);

        var x = d3.scaleBand()
            .range([margin.left, width - margin.right])
            .padding(0.1);

        var y = d3.scaleBand()
            .range([height - margin.bottom, margin.top])
            .padding(0.1);

        var color = d3.scaleSequential()
            .interpolator(d3.interpolateRdYlBu);

        var xAxis = d3.axisBottom()
            .scale(x);

        var yAxis = d3.axisLeft()
            .scale(y);

        var svg = d3.select('#scene3');
        svg.selectAll("*").remove();

        // Calculate the correlation coefficients for each pair of columns
        var correlationData = columns.map(function (column1) {
            return columns.map(function (column2) {
                if (column1 === column2) {
                    // Main diagonal, don't compute correlation and set value to 0
                    return {
                        column1: column1,
                        column2: column2,
                        value: 1
                    };
                } else {
                    var correlation = d3.mean(data, d => d[column1] * d[column2]) - d3.mean(data, d => d[column1]) * d3.mean(data, d => d[column2]);
                    correlation /= d3.deviation(data, d => d[column1]) * d3.deviation(data, d => d[column2]);
                    return {
                        column1: column1,
                        column2: column2,
                        value: correlation
                    };
                }
            });
        });

        var maxVal = d3.max(correlationData, row => d3.max(row, d => Math.abs(d.value)));
        var minVal = d3.min(correlationData, row => d3.min(row, d => Math.abs(d.value)));

        x.domain(columns);
        y.domain(columns.reverse()); // Reverse the order to match the heatmap

        color.domain([-maxVal, maxVal]);

        svg.append("g")
            .selectAll("g")
            .data(correlationData)
            .enter()
            .append("g")
            .selectAll("rect")
            .data(d => d)
            .enter()
            .append("rect")
            .attr("x", d => x(d.column1))
            .attr("y", d => y(d.column2))
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => colorScale(Math.abs(d.value)))
            .on("mouseover", function (d) {
                country_tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                country_tooltip.html(`Correlation: ${d.value.toFixed(2)}`)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function (d) {
                country_tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("g")
            .attr("transform", "translate(0," + (height - margin.bottom) + ")")
            .attr("class", "axis")
            .call(xAxis)
            .selectAll(".tick text") // Select all x-axis labels
            .attr("transform", "rotate(-45)") // Rotate them by -45 degrees
            .style("text-anchor", "end") // Adjust the text-anchor to 'end'
            .attr("dx", "-.8em") // Shift them slightly to the left
            .attr("dy", ".15em"); // Shift them slightly down

        svg.append("g")
            .attr("transform", "translate(" + margin.left + ",0)")
            .attr("class", "axis")
            .call(yAxis);
    });
}
