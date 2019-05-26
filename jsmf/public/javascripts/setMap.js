var mymap = L.map('mapid').setView([0, 0], 0);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiODE3MDU3MyIsImEiOiJjanRvenltbmgzMDg2M3lycnJpZWJxdWxsIn0.jHpMyICW167U4l6tGPQyZQ'
}).addTo(mymap);

var x = document.getElementById("locc").value;


mymap.setView([41.378138799999995, -8.0683536],7);
console.log(x);
if(Array.isArray(x)){
    for(var i=0;i<x.length;i++){
        var tempLoc=JSON.parse(x[i]);
        var marker1 = L.marker([tempLoc.lat, tempLoc.long]);
        marker1.addTo(mymap);
    }
}

