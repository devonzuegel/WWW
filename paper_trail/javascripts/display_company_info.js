function display_company_info() {

  var name = document.inputs.input_table_id.value;
  var company_id; var company_name;

  $.ajax({
    url: entity_query(name), dataType: 'jsonp', success: function(json) {
      console.log(entity_query(name));
      if (json == []) {
        document.getElementById("company_info").innerHTML = "<h2>Can't find that company</h2>";
      } else if (name.length > 0)  { // this 2nd check may not be necessary?
        make_visible("company_info");
        company_id = json[0].id;
        company_name = json[0].name;
      }
      company_header(company_name, name);
      party_breakdown_graph(company_id, company_name);
      recipient_pacs_card(company_id, company_name);
    }

  });
}

function company_header(company_name, name) {
  var name_div = document.getElementById("company_hdr");
  name_div.innerHTML = "<b style='margin:20px'>" + company_name + "</b>";

  var logo_div = document.getElementById("logo_div");
  logo_div.innerHTML = "<img style='width:100%' src='http://data.scrapelogo.com/" + name + ".com/logo'>";
        //assumes that what the user inputed is the site's domain
}

function party_breakdown_graph(company_id,company_name) {
  $.ajax({
    url: party_breakdown_query(company_id), dataType: 'jsonp', success: function(json) {
      if (company_name.length > 0)  {
        var party_breakdown_div = document.getElementById("party_breakdown");
        clear("party_breakdown");

        if (isEmpty(json))  party_breakdown_div.innerHTML += "Sorry! We can't find data about how much <b>" + company_name + "</b> gave to each political party."
        else                add_doughnut(party_breakdown_format_data(json), "party_breakdown", "Party breakdown");
      }
    }
  });
}

function recipient_pacs_card(company_id, company_name) {
  $.ajax({
    url: pac_recipients_query(company_id), dataType: 'jsonp', success: function(json) {
      if (company_name.length > 0)  {
        var pac_div = document.getElementById("pac_div");
        clear("pac_div");

        if (isEmpty(json))  pac_div.innerHTML = "Sorry! We can't find data about how much <b>" + company_name + "</b> donated to individual PACs."
        else                list_pac_info(pac_div, json);
      }
    }
  }); 
}

function list_pac_info(pac_div, json) {

  var output = '<h3>Pac Contributions</h3><table>';
  for (var i = 0; i < json.length; i++)   {
    output += '<tr><td>' + color_block("#eee", i) + "</td><td>" + json[i].name + "</td></tr>";
  }
  output += '</table>';

  pac_div.innerHTML += output;
}

{ /* Helper fns specific to party_breakdonwn_graph() */

  function add_doughnut(formatted_data, div_id, title) {
    var div = document.getElementById(div_id);
    // add canvas for doughnut ...     and    ... add legend
    div.innerHTML += canvas("canvas", 200, 200) + legend(formatted_data, title);
    // add doughnut
    var doughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(formatted_data);
  }

  function party_breakdown_format_data(api_data) {
    var data = [];
    for (var party in api_data) {
      var hash = {};
      hash["party"] = party;
      hash["color"] = color_for(party);
      hash["value"] = parseInt(api_data[party][1]);
      data.push(hash);
    }
    return data;
  }

  function color_block(color_hex, content) {
    if (content == undefined)   content = "";
    return '<div class="color_block" style="width: 10px; height:10px; background-color:' + color_hex + '">' + content + '</div>';
  }

  // create legend & legend table for a doughnut's formatted_data
  function legend(formatted_data, title) {
    // calcuate total $s spent
    var total = 0;
    for (var i = formatted_data.length - 1; i >= 0; i--)    total += formatted_data[i].value;

    // create legend & legend table
    var output = '<div class="legend"><h3>' + title + '</h3>'    +   '<table class="legend_table">';
    for (var i = formatted_data.length - 1; i >= 0; i--) {
      var color_hex = formatted_data[i].color;
      var party_name = formatted_data[i].party;
      var percentage = Math.floor(10*(100*formatted_data[i].value/(total)))/10;
      output += '<tr><td>' + color_block(color_hex) + '</td><td>' + party_name + ' (' + percentage + '%)</td></tr>';
    }
    output += '</table><div>';

    return output;
  }
}

{ /* Graph-drawing helper functions */

  function color_for(party) {
    // if major party, get its color
    if (party == "Republicans")                      return "#F7464A";
    if (party == "Democrats")                        return "#46BFBD";
    if (party == "Other" || party == "Libertarian")  return "#FDB45C";

    // get random color
    var rand = getRandomInt(1,2);
    switch (rand) {
      case 1:   return "#949FB1";
      case 2:   return "#4D5360";
      default:  return "#FDB45C";
    }
  }

  function canvas(id, h, w) {
    return "<canvas class=\"canvas\" id=\"" + id + "\" height=\"" + h + "\" width=\"" + w + "\"></canvas>";
  }
}

{ /* Misc helper functions */


  function clear_and_make_visible() {

  }

  function clear(div_id) {
    document.getElementById(div_id).innerHTML = "";
  }

  function make_visible(div_id) {
    document.getElementById(div_id).style.display = 'inline-block';
  }

  // function clear_and_make_visible(div_id) {
  //   var div = document.getElementById(div_id);
  //   div.innerHTML = "";
  //   div.style.display = 'inline-block';
  // }

  function isEmpty(obj) {
      return Object.keys(obj).length === 0;
  }

  function toggle_class_visib(cl){
     var elems = document.getElementsByClassName(cl);
     for(var i=0; i < elems.length; ++i){
        var s = elems[i].style;
        s.display = s.display==='none' ? 'block' : 'none';
     };
  }

  function toggle_id_visib(id) {
     var e = document.getElementById(id);
     if(e.style.display == 'block')  e.style.display = 'none';
     else                            e.style.display = 'block';
  }

  // Returns a random integer between min and max
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}