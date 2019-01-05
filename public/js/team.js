$('#editTeam').click(function(e){
    e.preventDefault();
    $.ajax({
        url: 'api/team',
        type: 'PUT',
        data: $('#editTeamForm').serialize(),
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
    /*
    $.put('api/team', $('#createTeamForm').serialize(), function(data, msg){
        window.location.pathname = '/team.html';
    }).fail(function(msg){
        $("#errDisplay").show();
        if(msg.responseJSON != undefined)
            $("#errmsg").text(msg.responseJSON.err);
        else
            $("#errmsg").text(msg.statusText);
    });*/
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
        delete team.__v;
        delete team._id;
        for (var key in team){
            if(key === "on_site" || key === "team_points"){
                $("#info").prepend('<p>'+key+' : '+team[key]+' </p>');
            }else if(key === "solved_challenges" || key === "members"){
                content = "<p>"+key+':';
                team[key].forEach(function(obj){
                    content += ' -'+obj.alias+':'+obj.name;
                });
                $("#info").prepend(content +'</p>');
            }else{
                $("#editTeamForm").prepend('<input type="text" autocomplete="off" name="'+key+'" value="'+team[key]+'" required />');
            }
        };
        $("#editTeamFormDiv").show();
    }).fail(function(msg){
        $("#errDisplay").show();
        if(msg.code === 404){
            $("#feed").text(msg.responseJSON.err);
            $("#createTeamFormDiv").show();
        }
        if(msg.responseJSON != undefined)
            $("#errmsg").text(msg.responseJSON.err);
        else
            $("#errmsg").text(msg.statusText);
    });
}

getTeam();