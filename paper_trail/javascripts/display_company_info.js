function display_company_info() {


  var name = document.inputs.input_table_id.value;
  var company_id; var company_name;

  $.ajax({
    url: entity_query(name), dataType: 'jsonp', success: function(json) {
      if (json == []) {
        document.getElementById("company_info").innerHTML = "<h2>Can't find that company</h2>";
      } else if (name.length > 0)  {
        // $( ".canvas" ).remove(); // removes any remaining canvases before adding new ones
        company_id = json[0].id;
        company_name = json[0].name;
      }
      company_header(company_name);
      party_breakdown_graph(company_id, company_name);
    }

  });
}

function company_header(company_name) {
  var div = document.getElementById("company_hdr");
  div.innerHTML = "<b>" + company_name + "</b>";
}

function party_breakdown_graph(company_id,company_name) {
    $.ajax({
      url: party_breakdown_query(company_id), dataType: 'jsonp', success: function(json) {
        if (company_name.length > 0)  {
          var party_breakdown_div = document.getElementById("party_breakdown");
          clear_and_make_visible("party_breakdown");

          if (isEmpty(json))  party_breakdown_div.innerHTML += "Sorry! We can't find data about how much " + company_name + " gave to each political party."
          else                add_doughnut(party_breakdown_format_for_doughtnut(json), "party_breakdown", "Party breakdown");
        }
    }
  });
}

{ /* Helper fns specific to party_breakdonwn_graph() */

  function add_doughnut(formatted_data, div_id, title) {
    var div = document.getElementById(div_id);
    // add canvas for doughnut ...     and    ... add legend
    div.innerHTML += canvas("canvas", 210, 210) + legend(formatted_data, title);
    // add doughnut
    var doughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(formatted_data);
  }
  
  function party_breakdown_format_for_doughtnut(api_data) {
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

  function color_block(color_hex) {
    return '<div class="color_block" style="width: 15px; height:15px; background-color:' + color_hex + '"></div>';
  }

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

{ /* Helper functions that set and/or check for visibility & emptiness */
  function clear_and_make_visible(div_id) {
    var div = document.getElementById(div_id);
    div.innerHTML = "";
    div.style.display = 'inline-block';
  }

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
}

{ /* Misc helper functions */

  // Returns a random integer between min and max
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}