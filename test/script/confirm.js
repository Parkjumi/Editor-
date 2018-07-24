jQuery(function($) {
  $.ajax({
    type:"post",
    url:"/setdata",
    data:{
      title:"제목"
    },
    success: function (response) {
      document.getElementById('setData').addEventListener('click', function(){
        var fbEditor = document.getElementById('build-wrap');
        var formBuilder = $(fbEditor).formBuilder();
        var formData = '[{"type":"text","label":"Full Name","subtype":"text","className":"form-control","name":"text-1476748004559"},{"type":"select","label":"Occupation","className":"form-control","name":"select-1476748006618","values":[{"label":"Street Sweeper","value":"option-1","selected":true},{"label":"Moth Man","value":"option-2"},{"label":"Chemist","value":"option-3"}]},{"type":"textarea","label":"Short Bio","rows":"5","className":"form-control","name":"textarea-1476748007461"}]';
        formBuilder.actions.setData(formData);
        location.href="/noanswer";
      });
    }
  })
});
