function getUser(){
	$.getJSON('api/user/', function (profile) {
        $("#content").empty();
        var header = ["alias", "name", "surename"];
        var formContent ="<h3>Profile</h3>";
        header.forEach(function(key, index){
            formContent += '<label for="'+key+'">'+key.toUpperCase()+' </label>';
            formContent += '<input type="text" autocomplete="off" placeholder="'+key+'" name="'+key+'" value="'+profile.user[key]+'" required />';
        });
		$("#content").prepend(formContent);
	}).fail(function (msg) {
		$("#errDisplay").show();
		if (msg.responseJSON != undefined)
			$("#errmsg").text(msg.responseJSON.err);
		else
			$("#errmsg").text(msg.statusText);
	});
}

$("#editProfile").click(function(e){
    e.preventDefault();
    $.ajax({
        url: 'api/user/',
        type: 'PUT',
        data: $('#editProfileForm').serialize(),
        success: function(result) {
            getUser();
        },
        error: function(msg,error) {
            $("#errDisplay").show();
            if(msg.responseJSON != undefined)
                $("#errmsg").text(msg.responseJSON.err);
            else
                $("#errmsg").text(msg.statusText);
        }
    });
});

getUser();