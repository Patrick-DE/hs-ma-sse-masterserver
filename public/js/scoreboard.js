function getTeams() {
	$.getJSON('api/team/all', function (data) {
		$("#scoreboard").empty();
		var header = ["name", "country", "on_site", "team_points", "solved_challenges"];
		for (var k in data){
			delete data[k].__v;
			delete data[k]._id;
			if(data[k].on_site == true) data[k].on_site = "X";
		}
		var table = $('<table style="margin: 0 auto;" border=1>')[0];
		var tblHeader = "<tr>";
		for (var k in header) tblHeader += "<th>" + header[k].toUpperCase().replace('_', ' ') + "</th>";
		tblHeader += "</tr>";
		$(tblHeader).appendTo(table);
		data.forEach(function(obj, index){
			var TableRow = "<tr>";
			header.forEach(function(elem, index1){
				if(elem === "solved_challenges"){
					var challengeList = "";
					obj[elem].forEach(function(challenge){
						challengeList += challenge.name + ",";
					})
					TableRow += "<td>" + challengeList.substr(0,challengeList.length-1) + "</td>";
				}else{
					TableRow += "<td>" + obj[elem] + "</td>";
				}
			});
			TableRow += "</tr>";
			$(table).append(TableRow);
		});
		$(table).prependTo("#scoreboard");
	}).fail(function (msg) {
		$("#errDisplay").show();
		if (msg.responseJSON != undefined)
			$("#errmsg").text(msg.responseJSON.err);
		else
			$("#errmsg").text(msg.statusText);
	});
}

function getChallenges(){
	$.getJSON('api/challenge', function (data) {
		$("#challenges").empty();
		var header = ["activated", "name", "description", "points", "solved_by"];
		var chal = '<div class="container">';
		chal += '<div class="row">';
		data.forEach(function(elem, index){
			header.forEach(function(key, index){
				if (key === "activated")
					(elem[key] === true) ? chal += '<h3 style="color: green;">Active</h3><div class="col">' : chal += '<h3 style="color: red;">Not active</h3><div class="col-6 chal-de">';
				else if(key === "solved_by"){
					chal += '<p>'+key+': ';
					elem[key].forEach(function(team, index){
						chal += team.name+",";
					})
					chal = chal.substr(0,chal.length-1) + '</p>';
				}else
					chal += '<p>'+key+': '+elem[key]+'</p>';
			});
			chal += '</div>';
		});
		chal += '</div>';
		chal += '</div>';
		$("#challenges").append(chal);
		$("#submitFlagForm").show();
	}).fail(function (msg) {
		$("#errDisplay").show();
		if (msg.responseJSON != undefined)
			$("#errmsg").text(msg.responseJSON.err);
		else
			$("#errmsg").text(msg.statusText);
	});
}

$("#submitFlag").click(function(e){
	e.preventDefault();
    $.post('api/team/submit', $('#submitFlagForm').serialize(), function(data, msg){
		getTeams();
		getChallenges();
    }).fail(function(msg){
        $("#errDisplay").show();
        if(msg.responseJSON != undefined)
            $("#errmsg").text(msg.responseJSON.err);
        else
            $("#errmsg").text(msg.statusText);
    });
});

getTeams();
getChallenges();