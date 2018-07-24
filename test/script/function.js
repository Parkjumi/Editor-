jQuery(function($) {
  var fbEditor = document.getElementById('build-wrap');
  var formBuilder = $(fbEditor).formBuilder();

  $(document).on('click', '.save-template', function(){
    var t = formBuilder.actions.getData('json');
    $.ajax({
      type:"post",
      url:"/poster/insert",
      data:{
        d:t
      },
      success: function (response) {
        console.log(response.result);
        if(response.result == "심각"){
          location.href = "/noanswer";
        }else{
          alert('실패');
        }
      }
    })
  });
});
