
function top_10_recipnts() {

  var company_name = document.inputs.input_table_id.value;
  var company_id; var name;

  $.ajax({
    url: entity_query(compnay_name), dataType: 'jsonp', success: function(json) {
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

