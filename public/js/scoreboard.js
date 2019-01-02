function getTeams() {
	$.ajax({
		url: '/teams',
		method: 'GET',
        /*data: {
          "sample": "test"
        },
		beforeSend: function (jqxhr, settings) {
			jqxhr._data = settings.url.split("?").pop();
		},*/
		success: function (data, textStatus) {
			console.log(data);
			console.log(textStatus);
			console.log(jqXHR);
		}
	})
}