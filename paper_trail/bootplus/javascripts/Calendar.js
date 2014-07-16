function Calendar(div_id) {
	this.infobox = document.getElementById("infobox");
	this.cal_div = document.getElementById(div_id);
	this.div_id = div_id;
};

Calendar.prototype.render = function(date) {
	var start_date = date;
	
	var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
	var weekdays = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];

	{ // set up month numbers
		var curr_month_num = date.getMonth();
		if (curr_month_num == 0) {
			var last_month_num = 11;
			var last_month_year = date.getFullYear() - 1;
		} else {
			var last_month_num = date.getMonth() - 1;
			var last_month_year = date.getFullYear();
		}
		if (curr_month_num == 11) {
			var next_month_num = 0;
			var next_month_year = date.getFullYear() + 1;
		} else	{
			var next_month_num = date.getMonth() + 1;
			var next_month_year = date.getFullYear();
		}
	}

	{ // get num days in last and curr months
		var days_in_last_month = new Date(date.getFullYear(), curr_month_num, 0).getDate();
		var days_in_curr_month = new Date(date.getFullYear(), next_month_num, 0).getDate();
	}

	{ // set up day of the week
		var weekday_num = date.getDay();
		var date_of_month = date.getDate();
		var date_string = weekdays[weekday_num] + ", " + date.getDate() + " " + months[curr_month_num] + " " + date.getFullYear();
	}

	{ // set up first day of the month
		var first_day_of_the_month = date;
		first_day_of_the_month.setDate(1);
	}

	var n_from_last_month = first_day_of_the_month.getDay() + 1;
	var last_month_day_display = days_in_last_month - n_from_last_month + 2;

	{ // set up calendar

		var to_today_id = "to_today_" + this.div_id;
		var to_next_id = "to_next_" + this.div_id;
		var to_last_id = "to_last_" + this.div_id;

		var grid = "<div class=\"to_last_month\" id=\"" + to_last_id +"\">... " + months[last_month_num] + " " + last_month_year + "</div>";
		grid += "<div class=\"to_next_month\" id=\"" + to_next_id +"\">" + months[next_month_num] + " " + next_month_year + "... </div>";
		grid += "<h3>" + date_string + "</h3>" + "<table>" +
			"<tr>  <th>Sun</th> <th>Mon</th> <th>Tues</th> <th>Wed</th> <th>Thu</th> <th>Fri</th> <th>Sat</th> </tr>";
		grid += "<div class=\"to_today\" id=\"" + to_today_id + "\"> Go to today's date</div>";
		var nRows = 1;
		for (var i=0; i<nRows; i++) {
			grid += "<tr>";
			for (var j = 0; j < 7; j++) {
				var curr_col = i*7 + j;

				if (curr_col < n_from_last_month - 1) {
					grid += "<td class=\"not_this_month\">" + last_month_day_display + "</td>";
					last_month_day_display++;

				} else if (curr_col - n_from_last_month + 2 == date_of_month) {
					grid += "<td class=\"this_date\">" + (i*7 + j - n_from_last_month + 2) + "</td>";

				}else if (curr_col + 1 < days_in_curr_month + n_from_last_month) {
					var this_date_id = "this_date_" + this.div_id + "_" + (i*7 + j - n_from_last_month + 2); //---------------------------------
					grid += "<td><div id=\"" + this_date_id + "\">" + (i*7 + j - n_from_last_month + 2) + "</div></td>";

				} else {
					grid += "<td class=\"not_this_month\">" + ((i*7 + j) - (days_in_curr_month + n_from_last_month - 2)) + "</td>";
				}
			}
			if ((i+1)*7 + 1 < days_in_curr_month + n_from_last_month ) nRows++;
			grid += "</tr>";
		}
		grid += "</table>";

		this.cal_div.innerHTML = grid;
	}

	var cal = this;
	console.log(to_next_id);
	console.log(to_last_id);
	console.log(to_today_id);
	document.getElementById(to_next_id).onclick = function() {
		cal.render(new Date(months[next_month_num] +" 1 " + next_month_year));
	}

	document.getElementById(to_last_id).onclick = function() {
		cal.render(new Date(months[last_month_num] +" 1 " + last_month_year));
	}

	document.getElementById(to_today_id).onclick = function() {
		cal.render(new Date());
	}
	
};