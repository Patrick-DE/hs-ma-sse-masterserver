$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
 });

$('#login').click(function(e){
    e.preventDefault();
    $.post('api/login', $('#loginForm').serialize(), function(data){
        //success
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
    $.post('api/register', $('#registerForm').serialize()).then(function(data){
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
