
function getLocation(){
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} else {
    alert("geolocation nao funciona");
}}


function showPosition(pos) {

    var loc={
        lat:pos.coords.latitude,
        lon:pos.coords.longitude
    };

    $("#loca").val(JSON.stringify(loc));

}

$("#divloca").click(function(){
    getLocation();
})