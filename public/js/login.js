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
    var tmp = [];
    $("#registerForm").find('input:password').each(function(index){
        tmp[index] = $(this).val();
    });
    if(tmp[0] !== tmp[1]){
        $("#errmsg").text("Your passwords do not match!");
        $("#errDisplay").show();
    }else{
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
    }
});

var tokenHeader = document.cookie;
var cookies = tokenHeader.split(';');
cookies.forEach(function(elem, index){
	var token = elem.split('=');
	if(token[0].trim() === "token"){
		if(token[1].trim() !== undefined && token[1].trim() !== "null") window.location.pathname = "/scoreboard.html";
	}
});