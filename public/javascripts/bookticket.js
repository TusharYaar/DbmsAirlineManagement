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

document.addEventListener('DOMContentLoaded', function () {

    $(".cabin").on("click", "checkbox", function () { console.log("clicked"); });

});
