


Template.map.onRendered( function (){

function fahrenheit(temp){
  return ((temp * 9) /5) + 32;

  }

var map= new Datamap({element: document.getElementById('data_map'),
fills: {
      defaultFill:  '#f0f5f5'
    },
done: function(datamap) {

datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography, data) {

var url= "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/tas/year/" + geography.id;

  Meteor.call("serverCall", url, function(err, results) {
    if(!err){
      var parsed = results.data;
      for(var i=0; i < parsed.length; i++){

        if(parsed[i].year == document.getElementById("rangeinput2").value /*&& document.getElementById("rangeinput2").value > document.getElementById("rangeinput1")*/){

          var  end_temp= fahrenheit(parsed[i].data);


          var j = i -(parsed[i].year - document.getElementById("rangeinput1").value);
          var start_temp= fahrenheit(parsed[j].data);


           var temp_diff= end_temp- start_temp;

          geography.properties.temp= temp_diff;
          geography.properties.year1= parsed[j].year;
          geography.properties.year2= parsed[i].year;

          var redness= Math.round(75 * (temp_diff));
          var blueness= Math.round(255 / Math.pow(temp_diff, 3) );
          var greenness= Math.round(blueness/3);
        var color= tinycolor({r:redness, g:greenness, b:blueness});
        var hexcolor= color.toHexString();

        var m = {};
        m[geography.id] = hexcolor;
          datamap.updateChoropleth(m);
          m[geography.id] = diff;
        map.labels({'customLabelText': "test"});


      }
    else if(document.getElementById("rangeinput2") < document.getElementById("rangeinput1")){
      console.log("invalid range");
        alert("Time moves forwards, not backwards.");
     }
};

    } else{
      console.log(err);
       }

});
});

},
projection: 'mercator',
geographyConfig: {
   dataUrl: null, //if not null, datamaps will fetch the map JSON (currently only supports topojson)
   hideAntarctica: true,
   borderWidth: 1,
   borderOpacity: 1,
   borderColor: '#334c4c',
   popupTemplate: function(geo, data) {
     if(geo.properties.temp){
       return ['<div class="hoverinfo"><strong>',
                      geo.properties.name,
                      ' increased <br>',
                      geo.properties.temp,
                      '<br> degrees from ',
                      geo.properties.year1,
                      ' to ',
                      geo.properties.year2,
                      '</strong></div>'].join('');
     }else{
       return   ['<div class="hoverinfo"><strong>',
                      geo.properties.name,
                      '</strong></div>'].join('');
     }

   },
   popupOnHover: true, //disable the popup while hovering
   highlightOnHover: true,
   highlightFillColor: '#e0ebeb',
   highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
   highlightBorderWidth: 2,
   highlightBorderOpacity: 1
}
});

});
