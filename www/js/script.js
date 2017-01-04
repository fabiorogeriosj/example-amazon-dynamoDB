FB.init({
  appId  : '239936209752384',
  status : true,
  cookie : true,
  xfbml  : true
});

var usuario = {};

$('#lodin-fb').click(function(){
  FB.login(function(response) {
      if (response.authResponse) {
        FB.api('/me', {fields: 'name,email'}, function(response) {
          if (response) {
            usuario = response;
            usuario.photo = 'http://graph.facebook.com/'+response.id+'/picture?type=normal';
            $('#lodin-fb').hide();
            $('#aviso').hide();
            $('#editor').show().focus();
          }
        });
      }
  }, {
    scope: 'public_profile,email'
  });
})

$('#editor').keyup(function(e){
    if(e.keyCode == 13 && usuario && usuario.email){
        var mensagem = $(this).val();
        if(mensagem){
          if(mensagem.length > 10000){
            alert("Eita! Sua mensagem é muito grande, não foi possível enviar :(");
          } else {
            $(this).prop('disabled', true);
            var data = {usuario: usuario, mensagem:mensagem};
            $.post(location.pathname, data).done(function(res) {
              if(res.isValid){
                  $('.chat').prepend('<div class="mensagem"><img src="'+usuario.photo+'"><h1>'+usuario.name+'<span>poucos segundos atrás</span><p>'+mensagem+'</p></h1></div>');
              } else {
                alert("Não foi possível enviar sua mensagem neste momento!");
              }
              $('#editor').prop('disabled', false);
              $('#editor').val("").focus();
            });
          }
        }
    }
});

$('#formnovasala').submit(function(e){
  e.preventDefault();
  var sala = $("#novasala").val();
  if(sala){
    location.href = "/" + sala;
  }
});

function criarNovaSala(){
  $('.form').show();
  $('#linkNovaSala').hide();
}
