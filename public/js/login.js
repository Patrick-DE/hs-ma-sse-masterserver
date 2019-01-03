$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
 });


$('#login').click(function(){
    $.post('api/login', $('#loginForm').serialize()).then(function(data){
        console.log(data);
        if (data.auth === true) {
            setCookie("token", data.token, 1);
            window.location.replace("/scoreboard");
        }
    });
});

$('#register').click(function(){
    $.post('api/register', $('#registerForm').serialize()).then(function(data){
        console.log(data);
        if (data.auth === true) {
            setCookie("token", data.token, 1);
            window.location.replace("/scoreboard");
        }
    });
});

function setCookie(cname, cvalue, exhour) {
    var d = new Date();
    d.setTime(d.getTime() + (exhour*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }