moment.locale('pt-br');

FB.init({
  appId  : '239936209752384',
  status : true,
  cookie : true,
  xfbml  : true
});

var usuario = {};

FB.getLoginStatus(function(response){
  if (response.status === 'connected') {
    obterUsuarioLogado();
  } else {
    exibirBotaoLogar();
  }
});

$('#lodin-fb').click(function(){
  FB.login(function(response) {
      if (response.authResponse) {
        location.href = location.href;
      }
  }, {
    scope: 'public_profile,email'
  });
})

function obterUsuarioLogado(){
  FB.api('/me', {fields: 'name,email'}, function(response) {
    if (response) {
      usuario = response;
      usuario.photo = 'http://graph.facebook.com/'+response.id+'/picture?type=normal';
      $('#lodin-fb').hide();
      $('#aviso').hide();
      $('#editor').prop('disabled', false);
      $('#editor').prop('placeholder', 'Digite uma mensagem e pressione enter para enviar...');
      $('#editor').show().focus();
      $('#editor').css('background-image','url('+usuario.photo+')');
      $('#editor').css('padding-left','50px');
      $('.salas').first().prepend('<button id="bt-sair" type="button">sair</button>');
      $('.salas').first().find('#bt-sair').click(function(){
        FB.logout(function(response) {
          location.href = location.href;
        });
      });
    }
  });
  initSocketIO();
}

function exibirBotaoLogar(){
  $('#editor').hide();
  $('#lodin-fb').show();
  $('#aviso').show();
}

$('#editor').keyup(function(e){
    if(e.keyCode == 13 && usuario && usuario.email){
        var mensagem = $(this).val().trim();
        if(mensagem){
          if(mensagem.length > 10000){
            alert("Eita! Sua mensagem é muito grande, não foi possível enviar :(");
          } else {
            $(this).prop('disabled', true);
            var data = {usuario: usuario, mensagem:mensagem};
            $.post(location.pathname, data).done(function(res) {
              if(res.isValid){
                  exibeMensagem(res.data);
                  $(document).scrollTop(0);
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

var mensagensNaoLidas = 0;
var pageActive = true;
function exibeMensagem(data){
  if(!$('#'+data.timestamp).length){
      $('.chat').prepend('<div id="'+data.timestamp+'" class="mensagem"><img src="'+data.usuario.photo+'"><h1>'+data.usuario.name+'<span>'+moment(data.timestamp).fromNow()+'</span><p>'+data.mensagem+'</p></h1></div>');
      if($(document).scrollTop() > 25){
        var size = $('#'+data.timestamp).height() + 20;
        $(document).scrollTop($(document).scrollTop() + size);
        mensagensNaoLidas++;
        novaMensagemNaoLida();
        audio.play();
      } else {
        $(document).scrollTop(0);
        if(!pageActive){
          mensagensNaoLidas++;
          document.title = '('+mensagensNaoLidas+') LoremChat';
          audio.play();
        }
      }
  }
}

function novaMensagemNaoLida(){
  var msg = mensagensNaoLidas > 1 ? " novas mensagens não lidas" : " nova mensagem não lida";
  $('#notificacao span').text(mensagensNaoLidas + msg);
  document.title = '('+mensagensNaoLidas+') LoremChat';
  if($('#notificacao').position().top < 0){
    $('#notificacao').animate({
      top: "33px"
    }, 800);
  }
}

$('#notificacao').click(function(){
  $(document).scrollTop(0);
});

$(window).scroll(function (event) {
    if($(window).scrollTop() < 25 && mensagensNaoLidas){
      mensagensNaoLidas=0;
      document.title = 'LoremChat';
      $('#notificacao').animate({
        top: "-40px"
      }, 800);
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

function initSocketIO(){
  var sala = location.pathname.replace("/","");
  if(!sala){
    sala = "geral";
  }
  var socket = io.connect(location.origin);
  socket.on('userConnections', function (data) {
    var msg = data > 1 ? " usuários online." : " usuário online.";
    $('#footer').text(data + msg);
  });
  socket.on('sala:'+sala+':message', function (data) {
    exibeMensagem(data);
  });
}


function recalcularDatas(){
  $('.mensagem').each(function(i,e){
    var datetime = Number(e.id);
    $(e).find('span').text(moment(datetime).fromNow());
  });
  setTimeout(recalcularDatas, 60000);
}

setTimeout(recalcularDatas, 60000);
var audio = new Audio('/audio/notification.mp3');
$(document).ready(function(){
     $(window).blur(function(){
          pageActive=false;
     });
     $(window).focus(function(){
          pageActive=true;
          if($(window).scrollTop() < 25){
            mensagensNaoLidas=0;
            document.title = 'LoremChat';
          }
     });
});
