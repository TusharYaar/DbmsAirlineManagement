console.log("COnnected");

$("#departure_time").on("change", function () {
  Duration();
});
$("#arrival_time").on("change", function () {
  Duration();
});
$("#departure_date").on("change", function () {
  var d_date = document.getElementById("departure_date");
  d_date = d_date["value"];
  document.getElementById("arrival_date").min = d_date;
});

function Duration() {
  var departure_time = $("#departure_time").val();
  var arrival_time = $("#arrival_time").val();
  hrs = parseInt(arrival_time.slice(0, 2)) - parseInt(departure_time.slice(0, 2));
  mins = parseInt(arrival_time.slice(3, 5)) - parseInt(departure_time.slice(3, 5));
  var d_date = document.getElementById("departure_date");
  var a_date = document.getElementById("arrival_date");
  d_date = Date.parse(d_date["value"]);
  a_date = Date.parse(a_date["value"]);
  console.log(typeof a_date);
  // difference = $("#arrival_date").val().getTime() - $("#departure_date").val().getTime();
  // daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  if (mins < 0) {
    hrs--;
    mins += 60;
  }
  if (d_date == a_date) {
    $("#arrival_time").prop("min", $("#departure_time").val());
  }
  else {
    hrs += 24;
  }
  if (d_date == a_date && hrs < 0) {
    $("#duration_view").val("Not Allowed");
  }

  else {
    hrs = ("0" + hrs).slice(-2)
    $("#duration_view").val(hrs + "Hrs " + mins + "mins ");
    $("#duration").val(hrs + ":" + mins);
  }
}

var departure_time = $("#departure_time").val();
var arrival_time = $("#arrival_time").val();
// $("#departure_date").val().setHours(parseInt(departure_time.slice(0, 2)), parseInt(departure_time.slice(3, 5)));;
// $("#duration").text(timeDifference($("#departure_time").val(), $("#arrival_time").val()));
function timeDifference(date1, date2) {
  var difference = date1.getTime() - date2.getTime();
  var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24;

  var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;

  var minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;

  var secondsDifference = Math.floor(difference / 1000);

  return daysDifference + " day/s " + hoursDifference + " hr/s " + minutesDifference + " min/s ";
}
