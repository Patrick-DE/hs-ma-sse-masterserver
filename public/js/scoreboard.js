function getTeams() {
	$.getJSON('api/team/all', function (data) {
		var header = ["name", "country", "on_site", "team_points", "solved_challenges"];
		for (var k in data){
			delete data[k].__v;
			delete data[k]._id;
			if(data[k].on_site == true) data[k].on_site = "X";
		}
		var table = $('<table border=1>')[0];
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
		$(table).appendTo("main");
	}).fail(function (msg) {
		$("#errDisplay").show();
		if (msg.responseJSON != undefined)
			$("#errmsg").text(msg.responseJSON.err);
		else
			$("#errmsg").text(msg.statusText);
	});
}

getTeams();