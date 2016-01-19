Meteor.methods({

  fetchData: function (){

          var url= 'http://arms.dat-friends.appspot.com/categories/All.json'
          var method="GET";
            return Meteor.http.call(method, url);
}
});

if(Meteor.isServer){
//armsdata = HTTP.get(Meteor.absoluteUrl("/data.json")).data;

};
