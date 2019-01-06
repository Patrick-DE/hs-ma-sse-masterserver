$('#editTeam').click(function(e){
    e.preventDefault();
    $.ajax({
        url: 'api/team',
        type: 'PUT',
        data: $('#editTeamForm').serialize(),
        success: function(result) {
            getTeam();
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

$('#addMember').click(function(e){
    e.preventDefault();
    $.post('api/team/member', $('#addMemberForm').serialize(), function(data, msg){
        getTeam();
    }).fail(function(msg){
        $("#errDisplay").show();
        if(msg.responseJSON != undefined)
            $("#errmsg").text(msg.responseJSON.err);
        else
            $("#errmsg").text(msg.statusText);
    });
});

$('#deleteMember').click(function(e){
    e.preventDefault();
    $.ajax({
        url: 'api/team/member',
        type: 'DELETE',
        data: $('#deleteMemberForm').serialize(),
        success: function(result) {
            getTeam();
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

$('#deleteTeam').click(function(e){
    e.preventDefault();
    var choice = confirm("Are you sure you want to delete that team?\nEverything will be lost including your points!");
    if (choice == true) {
        var choice1 = confirm("This is your last chance to click deny!");
        if (choice1 == true) {
            var choice2 = confirm("Don't cry afterwards!!!");
            if (choice2 == true) {
                $.ajax({
                    url: 'api/team',
                    type: 'DELETE',
                    success: function(result) {
                        window.location.pathname = '/team.html';
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

$('#createTeam').click(function(e){
    e.preventDefault();
    $.post('api/team', $('#createTeamForm').serialize(), function(data, msg){
        window.location.pathname = '/team.html';
    }).fail(function(msg){
        $("#errDisplay").show();
        if(msg.responseJSON != undefined)
            $("#errmsg").text(msg.responseJSON.err);
        else
            $("#errmsg").text(msg.statusText);
    });
});

function getTeam(){
    $.getJSON('api/team/', function (team) {
        $("#content").empty();
        var header = ["name", "country", "team_points", "on_site", "solved_challenges", "members"];
        formContent = "<h3>Teaminformation</h3>";
        content = "";
        header.forEach(function(key, index){
            if(key === "name" || key === "country"){
                formContent += '<label for="'+key+'">'+key.toUpperCase()+' </label>';
                formContent += '<input type="text" autocomplete="off" placeholder="'+key+'" name="'+key+'" value="'+team[key]+'" required />';
            }else if(key === "solved_challenges" || key === "members"){
                content += "<p>"+key+':';
                team[key].forEach(function(obj){
                    (key==="members") ? content += ' '+obj.alias : content += ' '+obj.name;
                });
                content += '</p>';
            }else{
                content += '<p>'+key+' : '+team[key]+' </p>';
            }
        });
        $("#content").prepend(content);
        $("#content").prepend(formContent);
        $("#teamExistsDiv").show();
    }).fail(function(msg){
        if(msg.status === 404){
            $("#feed").text(msg.responseJSON.err);
            $("#createTeamFormDiv").show();
        }else{
            $("#errDisplay").show();
            if(msg.responseJSON != undefined)
                $("#errmsg").text(msg.responseJSON.err);
            else
                $("#errmsg").text(msg.statusText);
        }
    });
}

getTeam();