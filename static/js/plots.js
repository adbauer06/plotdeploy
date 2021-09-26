function init() {
    var selector = d3.select("#selDataset");
  
    // Populate the Test Subject ID dropdown list
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    });
};
  
function optionChanged(newSample) {
    buildMetadata(newSample);
    //buildCharts(newSample);
};

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
        console.log(result);
  
        PANEL.html("");
        Object.entries(result).forEach(function ([key, value]) {
            PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
};
   
init();