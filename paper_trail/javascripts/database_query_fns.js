/* DATABASE QUERY FUNCTIONS */

var domain = 'http://transparencydata.com/api/1.0/';
var API_KEY = 'apikey=7059228ecc7540b983aaa75883835c08';


function entity_query(name) {
  return domain + 'entities.json?search=' + name +'&type=organization&' + API_KEY;
  //  GOOGLE: (sample query)
  // http://transparencydata.com/api/1.0/entities.json?search=Google&type=organization&apikey=7059228ecc7540b983aaa75883835c08
}

function top_issues_query(id) {
 // '/issues.json?apikey=7059228ecc7540b983aaa75883835c08'

  return domain + 'aggregates/org/' + id + '/issues.json?' + API_KEY;
	//  GOOGLE: (sample query)
  // http://transparencydata.com/api/1.0/entities.json?search=Google&type=organization&apikey=7059228ecc7540b983aaa75883835c08
}

function party_breakdown_query(id) {
  // for organizations:
  return domain + 'aggregates/org/' + id + '/recipients/party_breakdown.json?' + API_KEY;
  // for individuals:
  /* 'http://transparencydata.com/api/1.0/aggregates/indiv/' + company_id + '/recipients/party_breakdown.json?apikey=7059228ecc7540b983aaa75883835c08'; */
}

function pac_recipients_query(id) {
  return domain + 'aggregates/org/' + id + '/recipient_pacs.json?&' + API_KEY;
	//  GOOGLE: (sample query)
	//  http://transparencydata.com/api/1.0/aggregates/org/7e716c3ba2244122b96a9dfaf60bfa70/recipient_pacs.json?&apikey=7059228ecc7540b983aaa75883835c08
}