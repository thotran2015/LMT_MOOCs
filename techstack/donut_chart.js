var chartData = {
  dataInner : [{index: 0,label: "Data 1", value: 49}, 
         {index: 1,label: "Data 2", value: 51}],
  dataMain : [{index: 2,label: "Data 4", value: 77}, 
         {index: 3,label: "Data 5", value: 20},
          {index: 4,label: "Data 3", value: 3}]
};
var dataTst = [{index: 0,label: "Data 1", value: 49}, 
         {index: 1,label: "Data 2", value: 51}];

// Chart Colors
var maincoloresCode = ["#e64147","#636363"];
var detailcoloresCode = ["#34a0c6", "#ff9933", "#00bf83"];

var mergeList = $.merge(chartData.dataInner,chartData.dataMain);
var mergeColores = $.merge(maincoloresCode,detailcoloresCode);

function textColor(index){
  var allcoloresCodes = maincoloresCode.concat(detailcoloresCode);
  return allcoloresCodes[index];
}

function mainChartColor(n) {
  return maincoloresCode[n % maincoloresCode.length];
}

function detailChartColor(n) {
  return detailcoloresCode[n % detailcoloresCode.length];
}

function mergeChartColor(n) {
  return mergeColores[n % mergeColores.length];
}

var selectLegend = function(pathID,color="#000",type="none"){
  var allLegend = d3.selectAll(".legend");
    allLegend.each(function(){
      var getTransform = $(this).attr("transform");
      var parTransform = getTransform.split(" ");
      var getTranslate = parTransform[0];
      if(type == "select"){
        var dataID = parseInt(d3.select(this).attr("data-id"));
        if(pathID == dataID){
          $(this)
            .attr("fill", color)
            .attr("transform", getTranslate +" scale(1.2)");
        }else{
            $(this)
              .attr("transform", getTranslate);  
        }
      }else{
        $(this)
        .attr("fill", "#000")
        .attr("transform", getTranslate); 
      }
      
    }); 
  
}

var legend;
var width = 240,
    height = 240,
    radius = Math.min(width, height) / 2;

var donutWidth = 75;
var legendRectSize = 18;                                 
var legendSpacing = 30; 

// Main Chart Draw
var arc = d3.svg.arc()
  .innerRadius(radius - 17)
  .outerRadius(radius - 0);

  // Hover Animations
var arcInner = d3.svg.arc()
    .innerRadius(radius - 17)
    .outerRadius(radius - 0);

var arcInnerOver = d3.svg.arc()
    .innerRadius(radius - 27)
	  .outerRadius(radius - 0);

var svg = d3.select(".chart").append("svg")
    .data([dataTst])          
    .attr("width", width)
    .attr("height", height)
    .append("svg:g")       
    .attr("transform", "translate(172,160)");

var detailText = svg.append("g:text")
  .attr("dy", "0")
  .attr("x", "-35px")
  .attr("y", "7")
  .attr("class", "text-center")
  .style("fill", "red")
  .text("");

var pie = d3.layout.pie()
.value(function(d) {
  return d.value;
})

var path = svg.selectAll("path")
  .data(pie)
  .enter().append("g:path")
  .attr("fill", function(d,i) { return mainChartColor(i); } )
  .attr("d", arc)
  .attr("data-id", function(d) {return d.data.index;})
  .attr("data-type", "over")
  .on("mouseenter", function(d) {
    var color  = textColor(d.data.index);
    selectLegend(d.data.index,color,"select");
    
    detailText.text("%" + d.data.value)
      .style('fill',textColor(d.data.index));

    d3.select(this).transition()
      .duration(400)
      .attr("d", arcInnerOver)      
  })
  .on("mouseleave", function(d) {
    selectLegend(d.data.index);
    detailText.text("");
    d3.select(this).transition()
      .duration(200)
      .attr("d", arcInner);
  });;

var line = svg.append("line")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", 0)
  .attr("y2", 13)
  .attr("stroke-width", 7)
  .attr("stroke", "#e64147")
  .attr("transform", "translate(-133,0) rotate(-90)");   

// Sub Chart (Detail)
  var w = 600,                       
      h = 300,                      
      r = Math.min(w, h) / 2,                           
      ir = 60,
      pi = Math.PI,
      color = d3.scale.category20c();     

// Chart 2 Animation
  var arcDetail = d3.svg.arc()
    .innerRadius(radius - 25)
    .outerRadius(radius - 0);

  var arcOver = d3.svg.arc()
    .innerRadius(radius + 40)
    .outerRadius((radius ) + 5);

  var vis = d3.select(".chart svg") 
    .data([chartData.dataMain])          
    .attr("width", w)  
    .attr("height", 350)
    .append("svg:g")       
    .attr("transform", "translate(165,160) rotate(-90)");   
 
  var arc = d3.svg.arc()
    .innerRadius(r - 25)
    .outerRadius(r - 0);
 
  var pie = d3.layout.pie()           
    .value(function(d) { return d.value; })
    .startAngle(-90 * (pi/200))
    .endAngle(90 * (pi/200));

  var arcs = vis.selectAll("g.slice")     
    .data(pie)                          
    .enter()                            
    .append("svg:g")                
    .attr("class", "slice");    
 
  arcs.append("svg:path")
    .attr("fill", function(d,i) { return detailChartColor(i); } )
    .attr("d", arc)
    .attr("data-id", function(d) {return d.data.index;})
    .on("mouseenter", function(d) {
      var color = textColor(d.data.index);
      selectLegend(d.data.index,color,"select");
      detailText.text("%" + d.data.value)                    
      .style('fill',textColor(d.data.index));

      d3.select(this).transition()
      .duration(400)
      .attr("d", arcOver)      
    })
    .on("mouseleave", function(d) {
       selectLegend(d.data.index,);
                    
       detailText.text("");
       d3.select(this).transition()
			.duration(200)
			.attr("d", arc);
    });
 


// List
var legendMake = function(listData){
 legend = svg.selectAll('.legend')
  .data(listData)                                   
  .enter()                                                
  .append('g')                                            
  .attr('class', 'legend') 
  .attr('data-id', function(d) {return d.index;}) 
  .attr('transition','all 1s ease')
  .attr('transform', function(d, i) {                     
    var height = legendRectSize + legendSpacing;          
    var offset =  height * color.domain().length / 2;     
    var horz = 10 * legendRectSize;                       
    var vert = i * height - offset - 100;                       
    return 'translate(' + horz + ',' + vert + ')';        
  })
  .on("mouseenter", function(d) {
   var dataIndex = d.index;
   d3.selectAll("path").each(function(index){
     var dataID = d3.select(this).attr("data-id");
     var dataType = d3.select(this).attr("data-type");
     if(dataIndex == dataID){
       detailText.text("%" + d.value)                    
      .style('fill',textColor(d.index));
       
       if(dataType == "over"){
         d3.select(this).transition()
         .duration(400)
         .attr("d", arcInnerOver)
       }else{
         d3.select(this).transition()
         .duration(400)
         .attr("d", arcOver)
       }
     }
   });
  }).on("mouseleave", function(d) {
   var dataIndex = d.index;
   d3.selectAll("path").each(function(index){
     var dataID = d3.select(this).attr("data-id");
     var dataType = d3.select(this).attr("data-type");
     if(dataIndex == dataID){
       detailText.text("");
       if(dataType == "over"){
         d3.select(this).transition()
         .duration(400)
         .attr("d", arcInner)
       }else{
         d3.select(this).transition()
         .duration(400)
         .attr("d", arc)
       }
     }
   });
  });
  
  legend.append('rect')                                     
    .attr('width', legendRectSize)                       
    .attr('height', legendRectSize)
    .attr('rx',20)
    .attr('ry',20)
    .style('fill', function(d,i) { return mergeChartColor(i); })            
    .style('stroke', function(d,i) { return mergeChartColor(i); }); 
  
  legend.append('text')                                     
    .attr('x', legendRectSize + legendSpacing)              
    .attr('y', 13)              
    .text(function(d) { return d.label; });   
}

var legendPrimary = legendMake(mergeList);