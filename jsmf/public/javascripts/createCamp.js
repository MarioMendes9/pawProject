$(function() {
    $("#addMore").click(function(e) {
      e.preventDefault();
      $("#fieldList").append("<input type='text' name='responsaveis[]' class='form-control' placeholder='Nome do responsavel' /></br>");
    });
  });
  