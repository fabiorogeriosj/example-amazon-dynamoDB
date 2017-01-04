FB.init({
  appId  : '1714996615434678',
  status : true, // verifica status do login
  cookie : true, // habilita cookies para permitir acesso via servidor
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
        console.log(mensagem, usuario);
        $('.chat').prepend('<div class="mensagem"><img src="'+usuario.photo+'"><h1>'+usuario.name+'<span>poucos segundos atrás</span><p>'+mensagem+'</p></h1></div>');
        $('#editor').val("").focus();
    }
});

