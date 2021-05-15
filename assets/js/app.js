// @TODO: YOUR CODE HERE!
//set the dimensions of the chart
var svgWidth = 800;
var svgHeight = 700;


// creating margin
var margin ={
    top: 60,
    right: 60,
    bottom: 50,
    left: 60
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// creating the wrapper
var svg = d3.select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data from the csv
d3.csv("../assets/data/data.csv").then(function(povertyData) {
    console.log(povertyData);
    povertyData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.obesity = +data.obesity;
    });

    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(povertyData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([15, d3.max(povertyData, d => d.obesity)])
      .range([height, 0]);
      
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(povertyData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "lightblue")
        .attr("opacity", "1");
        
//Thanks to Alyssa and TA Farshaad for working on this in Slack. It helped me solve the problem i had with the states.
    var stateGroup = chartGroup.selectAll(null)
        .data(povertyData)
        .enter()
        .append('text')
        .text(d => d.abbr)
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.obesity))
        .attr('dx', d=>-10)
        .attr('dy', d=>4)
        .attr('color', 'white')
        .attr('font-size', 12);

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`State: ${d.state}<br> % In Poverty: ${d.poverty}<br> % Obese: ${d.obesity}`);
      });


    chartGroup.call(toolTip);


    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
    stateGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("% Obese");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 20})`)
      .attr("class", "axisText")
      .text("% In Poverty");
  }).catch(function(error) {
    console.log(error);
  });
