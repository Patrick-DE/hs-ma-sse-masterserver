function getUser(){
	$.getJSON('api/user/', function (profile) {
        $("#content").empty();
        var header = ["alias", "name", "surname"];
        var formContent ="<h3>Profile</h3>";
        header.forEach(function(key, index){
            formContent += '<label for="'+key+'">'+key.toUpperCase()+' </label>';
            formContent += '<input type="text" autocomplete="off" placeholder="'+key+'" name="'+key+'" value="'+profile.user[key]+'" required />';
        });
        $("#profileExistsDiv").show();
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

$('#deleteProfile').click(function(e){
    e.preventDefault();
    var choice = confirm("Are you sure you want to delete your user?\nEverything will be lost!");
    if (choice == true) {
        var choice1 = confirm("This is your last chance to click deny!");
        if (choice1 == true) {
            var choice2 = confirm("Don't cry afterwards!!!");
            if (choice2 == true) {
                $.ajax({
                    url: 'api/user',
                    type: 'DELETE',
                    success: function(result) {
                        window.location.pathname = '/api/logout';
                    },
                    error: function(msg,error) {
                        $("#errDisplay").show();
                        if(msg.responseJSON != undefined)
                            $("#errmsg").text(msg.responseJSON.err);
                        else
                            $("#errmsg").text(msg.statusText);
                    }
                });
            }
        }
    }
});

getUser();