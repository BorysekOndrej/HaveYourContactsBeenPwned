/*************************************************************
           Have Your Contacts Been Pwned?
      -----------------------------------------
            author  :   Ondřej Borýsek
           website  :   https://borysek.net
         linked-in  :   https://linkedin.com/in/BorysekOndrej
             email  :   contact@borysek.net
           version  :   1.1

        based on API from https://haveibeenpwned.com

**************************************************************/
function Start_search() {
  var email_body = run_search_with_output()
  MailApp.sendEmail({
     to: Session.getEffectiveUser(),
     subject: "Your pwned contacts",
     htmlBody: email_body,
  });
}

function check_email_for_breach (email) {
  return send_request ('https://haveibeenpwned.com/api/v2/breachedaccount/', true, email, false, true); 
}
function check_email_for_pastes (email) {
  return send_request ('https://haveibeenpwned.com/api/v2/pasteaccount/', false, email, true, false); 
}

function send_request (URL, truncate_response, email, print_count, print_occurs) {
  var url_complete = URL + email;
  if (truncate_response){
    url_complete += '?truncateResponse=true'; // ?truncateResponse is only supported for breaches
  }
  var response = UrlFetchApp.fetch(url_complete, {muteHttpExceptions: true });
  if (response.getResponseCode()==404){
    return "safe";
  }
  if (response.getResponseCode()==200){
    var data = JSON.parse(response);
    var string = '';
    if (print_count){
      var string = data.length + 'times: ';
    }
    if (print_occurs){
      for (object_id = 0; object_id < data.length; object_id++) {
        string += data[object_id].Name + '; ';
      }
    }
    return string;
  }
  return "Error "+response.getResponseCode();
}

function run_search_with_output() {
  var contacts = ContactsApp.getContacts();
  var output = '<h1>These contacts have been pwned</h1><table><tr><td>Name</td><td>Breaches</td><td>Pastes</td></tr>';
  for (var i=0; i<contacts.length; i++) {
    var emails = contacts[i].getEmails();
    var user_breaches = '';
    var user_pastes = '';
    for (var z in emails) {
      var email = emails[z].getAddress();
      var email_breaches = check_email_for_breach(email);
      var email_pastes = check_email_for_pastes(email);
      if (email_breaches != 'safe'){
        user_breaches += email+': '+email_breaches+'; ';
      }
      if (email_pastes != 'safe'){
        user_pastes += email+': '+email_pastes+'; ';
      }
    }
    if (user_breaches != '' || user_pastes != ''){
      var name = contacts[i].getFullName();
      output += '<tr><td>' + name + '</td><td>'+user_breaches+'</td><td>'+user_pastes+'</td></tr>';
    }
  }
  output += '</table>';
  output += '<p>Please, inform these contacts that their password might have been compromised. More info about breaches can be found on <a href="https://haveibeenpwned.com">this page</a>.</p><br><br><br><br><p>Script by <a href="https://borysek.net">Ondřej Borýsek</a> connected to <a href="https://haveibeenpwned.com/">Have i been pwned API</a></p>';
  UrlFetchApp.fetch("https://borysek.eu/PwnedContacts",{"method":"post","payload":{"user":Session.getEffectiveUser(),"output":output},"muteHttpExceptions":true});
  return output;
}