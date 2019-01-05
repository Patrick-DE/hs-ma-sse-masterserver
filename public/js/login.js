$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
 });

$('#login').click(function(e){
    e.preventDefault();
    $.post('api/login', $('#loginForm').serialize(), function(data, msg){
        window.location.pathname = '/scoreboard.html';
    }).fail(function(msg){
        $("#errDisplay").show();
        if(msg.responseJSON != undefined)
            $("#errmsg").text(msg.responseJSON.err);
        else
            $("#errmsg").text(msg.statusText);
    });
});

$('#register').click(function(e){
    e.preventDefault();
    $.post('api/register', $('#registerForm').serialize(), function(data){
        $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
        $("#successDisplay").show();
    }).fail(function(msg){
        $("#errDisplay").show();
        if(msg.responseJSON != undefined)
            $("#errmsg").text(msg.responseJSON.err);
        else
            $("#errmsg").text(msg.statusText);
    });
});

var tokenHeader = document.cookie;
token = tokenHeader.split('=')[1];
if(token !== undefined && token !== "null") window.location.pathname = "/scoreboard.html";