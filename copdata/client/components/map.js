

Session.setDefault("45");

  Template.map.helpers({
    year: function () {
      return  Session.get("year");
    }
  });

  Template.map.events({
    'keyup input': function (event) {
      Session.set("year", event.target.value);



    }
  });





Template.map.onRendered( function (){
var map= new Datamap({element: document.getElementById('container'),
fills: {
      defaultFill:  '#f0f5f5' //the keys in this object map to the "fillKey" of [data] or [bubbles]
    },
done: function(datamap) {

datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography, data) {

var url_single= "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/cru/tas/year/" + geography.id;

  Meteor.call("serverCall", url_single, function(err, results) {
    if(!err){
      //console.log(results);
      var parsed = results.data;
      for(var i=0; i<parsed.length; i++){

        if(parsed[i].year == document.getElementById("rangeinput").value){

          geography.properties.temp= parsed[i].data;
          var temp= parsed[i].data + 10;
          geography.properties.year= parsed[i].year;

          var redness= Math.round(Math.pow(temp, 2)/ 4.9);
          var blueness= Math.round(200/(Math.pow(temp, 2)));
          var greenness= Math.round(blueness/5);
        var color= tinycolor({r:redness, g:greenness, b:blueness});
        var hexcolor= color.toHexString();

        var m = {};
        m[geography.id] = hexcolor;
          datamap.updateChoropleth(m);
      }
    else{
      console.log(err);
       }
  };
};
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
                      ' was <br>',
                      geo.properties.temp,
                      '<br> degrees celcius on average in ',
                      geo.properties.year,
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
