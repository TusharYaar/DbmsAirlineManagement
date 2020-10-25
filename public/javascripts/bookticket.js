// var i, boxes;
// document.addEventListener('DOMContentLoaded',function(){
//     $(".plane-body").removeClass("no-click");
//     $(".plane-body").on("click",".checkbox", function(box){
//        if($("input:checked.checkbox").length > 5)
//         $(this).prop("checked",false);
//     boxes = $("input:checked.checkbox")
// console.log(boxes.length);
// $(".text_values").html("");
// for(i=2;i<boxes.length + 1;i++){
//     $(".text_values").append("<input type='text' name='username[]' value='' id='input" + i + " required maxlength='50' class='animate__animated animate__fadeIn mx-4'></input>");
// }

// });

// });
var booked_seats = [];
var booked_seats_name = [];

document.addEventListener("DOMContentLoaded", function () {
  price = parseInt($("#flight_value").text().slice(2));
  $("input[type='checkbox']").prop("checked", false);
  $("input[type='checkbox']").on("click", function () {
    if (this.checked) {
      if (booked_seats.length < 5) {
        booked_seats.push(this.value);
      } else {
        this.checked = false;
        alert("You can only Select maximum of 5 seats");
      }
    } else if (!this.checked) {
      booked_seats.splice(booked_seats.indexOf(this.value), 1);
    }
    $("#seat_number_parent").text(booked_seats.length);
    addInput();
    ButtonCheck();
  });
  $("#seat_reset").on("click", function () {
    booked_seats = [];
    $("input[type='checkbox']").prop("checked", false);
    $("#seat_number_parent").text("0");
    ButtonCheck();
    addInput();
  });
  ButtonCheck();
});

function ButtonCheck() {
  if (booked_seats.length === 0) {
    document.getElementById("submitButton").disabled = true;
    $("#submitButton").addClass("disabled");
  } else if (booked_seats.length === 1) {
    document.getElementById("submitButton").disabled = false;
    $("#submitButton").removeClass("disabled");
  }
}

function addInput() {
  $(".text_values").html("");
  $("#seat_status_seat").html("");
  $("#value_f").html("");
  booked_seats.forEach(function (seat, i) {
    $(".text_values").append(seat + "<input type='text' name='username[]' value='' id='input" + i + "' required maxlength='50' placeholder='Enter Name' class='animate__animated animate__fadeInDown mx-4'><br>");
    $("#seat_status_seat").append("<div> " + seat + "</div>");
    $("#value_f").html(price * (i + 1));
  });
}
