/* DATABASE QUERY FUNCTIONS */

var domain = 'http://transparencydata.com/api/1.0/';

function entity_query(name) {
  return domain + 'entities.json?search=' + name +'&type=organization&apikey=7059228ecc7540b983aaa75883835c08';
}

function party_breakdown_query(id) {
  // for organizations:
  return domain + 'aggregates/org/' + id + '/recipients/party_breakdown.json?apikey=7059228ecc7540b983aaa75883835c08';
  // for individuals:
  /* 'http://transparencydata.com/api/1.0/aggregates/indiv/' + company_id + '/recipients/party_breakdown.json?apikey=7059228ecc7540b983aaa75883835c08'; */
}

function pac_recipients_query(id) {
  return domain + 'aggregates/org/1b8fea7e453d4e75841eac48ff9df550/recipient_pacs.json?&apikey=7059228ecc7540b983aaa75883835c08';
}