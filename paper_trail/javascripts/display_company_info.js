function party_breakdown() {

  // removes any remaining canvases before adding new ones
  $( ".canvas" ).remove();

  var company_name = document.inputs.input_table_id.value;
  var company_id; var name;

  $.ajax({
    url: 'http://transparencydata.com/api/1.0/entities.json?search=' + company_name +'&type=organization&apikey=7059228ecc7540b983aaa75883835c08',

    dataType: 'jsonp', success: function(json) {
      if (json == []) {
        document.getElementById("top-recipients").innerHTML = "<h2>Can't find that company</h2>";
      } else if (company_name.length > 0)  {
        var data = json;
        company_id = data[0].id;
        name = data[0].name;
      }
      party_breakdown_graph(company_id, company_name, name);
    }

  });

}

function party_breakdown_graph(company_id, company_name, name) {
    $.ajax({
      url: 'http://transparencydata.com/api/1.0/aggregates/org/' + company_id + '/recipients/party_breakdown.json?apikey=7059228ecc7540b983aaa75883835c08',
      // FOR INDIVIDUAL:   'http://transparencydata.com/api/1.0/aggregates/indiv/' + company_id + '/recipients/party_breakdown.json?apikey=7059228ecc7540b983aaa75883835c08',
      dataType: 'jsonp', success: function(json) {
        if (company_name.length > 0)  {
          var graphs_div = document.getElementById("party_breakdown");
          clear_and_make_visible("party_breakdown");

          if (isEmpty(json))  graphs_div.innerHTML += "Sorry! We can't find data for that organization."
          else                add_doughnut(format_for_doughtnut(json), "party_breakdown");
        }
    }
  });
}

function clear_and_make_visible(div_id) {
  var div = document.getElementById(div_id);
  div.innerHTML = "";
  div.style.display = 'inline-block';
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function add_doughnut(formatted_data, div_id) {
  var div = document.getElementById(div_id);

  // add legend for doughnut
  div.innerHTML += make_legend(formatted_data, "Party breakdown");

  // add doughnut
  div.innerHTML += "<canvas class=\"canvas\" id=\"canvas\" height=\"210\" width=\"210\"></canvas>";
  var doughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(formatted_data);
}


function make_legend(formatted_data, title) {
  var output = '<div class="legend"><h3>' + title + '</h3>'    +   '<table class="legend_table">';
  for (var i = formatted_data.length - 1; i >= 0; i--) {
    output += '<tr><td>' + color_block(formatted_data[i].color) + '</td><td>' + formatted_data[i].party + '</td></tr>';
  }
  output += '</table><div>';

  return output;
}

function color_block(color_hex) {
  return '<div class="color_block" style="width: 15px; height:15px; background-color:' + color_hex + '"></div>';
}

function format_for_doughtnut(api_data) {
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

// Returns a random integer between min and max
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

function top_10_recipnts() {

  var company_name = document.inputs.input_table_id.value;
  var company_id; var name;

  $.ajax({
    url: 'http://transparencydata.com/api/1.0/entities.json?search=' + company_name +'&type=organization&apikey=7059228ecc7540b983aaa75883835c08',

    dataType: 'jsonp', success: function(json) {
      console.log(json);
        if (json == []) {
          document.getElementById("top-recipients").innerHTML = "<h2>Can't find that company</h2>";
        } else if (company_name.length > 0)  {
          var data = json;
          company_id = data[0].id;
          name = data[0].name;
        }

        print_top_recipnts(company_id, company_name, name);

    }

  });

  sample_graphs();
}

function print_top_recipnts(company_id, company_name, name) {
  $.ajax({
      url: 'http://transparencydata.com/api/1.0/aggregates/org/' + company_id + '/recipients.json?cycle=2012&apikey=7059228ecc7540b983aaa75883835c08',

      dataType: 'jsonp', success: function(json) {
        if (company_name.length > 0)  {
          data = json;
          document.getElementById("top-recipients").innerHTML = "<h2>" + name +"'s Top Recipients</h2>" + print_r(data, 0);
        }
    }
  });
}

function print_r(to_print, level) {
  var output = '';

  if($.isArray(to_print) || typeof(to_print) == 'object') {     
    output += "<table>"
    if (level != 0)   output += "<tr><h3>" + to_print.name + "</h3></ tr>";
    for(var i in to_print) {
      if($.isArray(i) || typeof(i) == 'object') {
        print_r(to_print);
      } else if (i != "id"  && i != "employee_amount"  && i != "name") {
        if (level == 0)  output += "<tr><td class='first-head'>" + (parseInt(i) + 1) + "</td><td class='first-data'>" + print_r(to_print[i], level + 1) + "</td></tr>";
        else             output += "<tr><td><b>" + i + "</b></td><td>" + print_r(to_print[i], level + 1) + "</td></tr>";
      }
    }
    output += "</table>";
  } else {
    output += to_print;
  }
  return output;
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

function sample_graphs() {

  toggle_id_visib("graphs");

  var data1 = [ { value: 30,    color:"#F7464A"},
                { value : 50,   color : "#46BFBD"},
                { value : 100,  color : "#FDB45C"},
                { value : 40,   color : "#949FB1"},
                { value : 120,  color : "#4D5360"}  ];   

  var doughnut1 = new Chart(document.getElementById("canvas1").getContext("2d")).Doughnut(data1);

  var data2 = [ { value: 100,    color:"#F7464A"},
                { value : 40,   color : "#46BFBD"},
                { value : 20,  color : "#FDB45C"},
                { value : 120,   color : "#949FB1"},
                { value : 20,  color : "#4D5360"}  ];   

  var doughnut2 = new Chart(document.getElementById("canvas2").getContext("2d")).Doughnut(data2);

  var data3 = [ { value: 30,    color:"#F7464A"},
                { value : 80,   color : "#46BFBD"},
                { value : 120,  color : "#FDB45C"},
                { value : 40,   color : "#949FB1"},
                { value : 70,  color : "#4D5360"}  ];   

  var doughnut3 = new Chart(document.getElementById("canvas3").getContext("2d")).Doughnut(data3);
}