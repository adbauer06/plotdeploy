function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;

    sampleNames.forEach((sampleID) => {
      selector
        .append("option")
        .text(sampleID)
        .property("value", sampleID);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

// Update the dashboard each time a new sample is selected
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sampleID) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sampleID);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Clear any existing metadata
    PANEL.html("");
    // Add each key-value pair to panel
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Create all dashboard charts for the specified sample ID.
function buildCharts(sampleID) {
    console.log(`buildCharts function is called with sample ID: ${sampleID}`);
    // Load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      
      // Create a variable that holds the samples array. 
      var samples = data.samples;
      console.log(samples);
      
      // Filters the samples for the object with the desired sample number.
      var resultArray = samples.filter (sample => sample.id == sampleID);
      var metadata = data.metadata;
      
      // Filter the metadata for the object with teh desired sample number.
      var resultMetadata = metadata.filter(metadataObj => metadataObj.id == sampleID)


      // Create variables that hold the first sample in each array.
      var result = resultArray[0];
      var metadataResult = resultMetadata[0];

      // Create variables that hold the otu_ids, otu_labels, and sample_values, and washing frequency
      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;
      var washing_frequency = +(metadataResult.wfreq);

      // Create the yticks for the bar chart.
      var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

      // Create the trace for the bar chart. 
      var barData = [
          {
            y: yticks,
            x: sample_values.slice(0,10).reverse(),
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation: "h"
          }
      ];
          
      // Create the layout for the bar chart. 
      var barLayout = {title: '<b>Top 10 Bacteria Cultures Found<b>',
                      paper_bgcolor: 'rgb(176,227,240)'
                      };

      // Add variable to make chart mobile responsive. 
      var config = {responsive: true};

      // Plot bar chart
      Plotly.newPlot("bar", barData, barLayout, config);
    
      // Create the trace for the bubble chart.
       var bubbleData = [
         {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Earth'
          }
        }
      ];

      // Create the layout for the bubble chart.
      var bubbleLayout = {
        title: '<b>Bacteria Cultures Per Sample<b>',
        xaxis: {title: 'OTU ID'}

      };

      // Add variable to make chart mobile responsive
      var config = {responsive: true};
      
      // Plot bubble chart
      Plotly.newPlot("bubble", bubbleData, bubbleLayout, config); 

      // Create the trace for the gauge chart.
      var gaugeData = [
        {
          domain: {'x': [0,1], 'y':[0,1]},
          value: washing_frequency,
          type: 'indicator',
          mode: 'gauge+number',
          title: {text: '<b>Belly Button Washing Frequency</b><br>Scrubs Per Week'},
          gauge: {
            axis: { range: [null, 10] },
            bar: { color: "black" },
            steps: [
              { range: [0, 2], color: "red" },
              { range: [2, 4], color: "orange" },
              { range: [4, 6], color: "yellow"},
              { range: [6, 8], color: 'greenyellow'},
              { range: [8,10], color: 'green'}
            ],
          }
        }
     
      ];
    
      // Create the layout for the gauge chart.
      var gaugeLayout = {autosize: true,
                        paper_bgcolor: 'rgb(176, 227, 240)',
                        //width: 500, 
                        //height: 350
                        };
     
      // Create variable to make chart mobile responsive
      var config = {responsive: true};

      // Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout, config);
  });
};

