let account_type_value;
let data4;
let entity_id;
let reason_change_value;
let agent_name_value;
let reason_change_value2;
let account_type_value2;
let doc_file_value;
let account_file_id;
let doc_file2 = "";
let submit_button2 = ""

ZOHO.embeddedApp.on("PageLoad", entity => {
    // This is the information about the current record, if applicable.
    console.log(entity)
    entity_id = entity.EntityId[0];
    console.log("Entity ID: " + entity_id)
	console.log(entity_id);
	//Custom Bussiness logic goes here
})
/*
 * initializing the widget.
 */
ZOHO.embeddedApp.init();

document.getElementById("trans_auth").style.display = "none";
document.getElementById("agent_name").style.display = "none";
document.getElementById("submit_button").style.display = "none";
function account_type_change()
{
    let comp_data = "";
    let auth_data = "";
    
    auth_data +=`<select id="trans_auth" name="trans_auth" onchange="reason_change()">
    <option value="" disabled selected>Reason</option>  
    <option value="Non Action License">Non Action License</option>
    <option value="Client's Request">Client's Request</option>
    </select>`
    comp_data = `<input type="text" id="agent_name" name="agent_name" placeholder="Competitor/Agent Name" onchange="agent_onchange()">`
    doc_file2 = `<label class="noc_label" for="myFile">Upload TLZ NOC document</label>
    <input class="noc_document" onchange="fileInput_onchange()" onclick="fileInput_onclick()" type="file" id="myFile" name="noc_document" placeholder="TLZ NOC document" required>`
    
    account_type_value = document.getElementById("account_type").value || '';
    submit_button2 = `<input type="submit" value="Submit" id="submit_button" onclick="update_account()">`
    
    console.log(account_type_value)
   
    if(account_type_value === "Transferred to Authority")
    {
        document.getElementById("trans_auth2").innerHTML = auth_data
        document.getElementById("trans_id").innerHTML = ""
        document.getElementById("trans_id2").innerHTML = ""
        document.getElementById("submit_button").innerHTML = ""
    }
    if(account_type_value === "Transferred to Competitor")
    {
        document.getElementById("trans_auth2").innerHTML = ""
        document.getElementById("trans_id").innerHTML = comp_data
        // document.getElementById("trans_id2").innerHTML = doc_file2
        // document.getElementById("submit_button").innerHTML = submit_button2
        document.getElementById("submit_button").innerHTML = ""
    }
}

function reason_change()
{
    let doc_file = "";
    let submit_button = "";
    let trans_auth2 = "";
    doc_file = `<label class="noc_label" for="myFile">Upload TLZ NOC document</label>
    <input class="noc_document" onchange="fileInput_onchange()" onclick="fileInput_onclick()" type="file" id="myFile" name="noc_document" placeholder="TLZ NOC document" required>`
    trans_auth2 = `<select id="trans_auth" name="trans_auth" onchange="reason_change()">
    <option value="" disabled selected>Reason</option>  
    <option value="Non Action License">Non Action License</option>
    <option value="Client's Request" selected>Client's Request</option>
    </select>`
    submit_button = `<input type="submit" value="Submit" id="submit_button" onclick="update_account()">`
    reason_change_value = document.getElementById("trans_auth").value || '';
    console.log(reason_change_value)
    if(reason_change_value === "Client's Request")
    {
    
        document.getElementById("trans_auth2").innerHTML = trans_auth2
        document.getElementById("trans_id").innerHTML = doc_file
        document.getElementById("submit_button").innerHTML = ""
    }
    if(reason_change_value === "Non Action License")
    {
        document.getElementById("trans_id").innerHTML = "";
        document.getElementById("submit_button").innerHTML = submit_button
    }
}

function agent_onchange()
{
    document.getElementById("trans_id2").innerHTML = doc_file2
}

function fileInput_onclick(){
    this.value = null;
    console.log("Onclick")
    console.log(this.value)
};


function fileInput_onchange ()
{
  //Update Attachment
  submit_button2 = `<input type="submit" value="Submit" id="submit_button" onclick="update_account()">`
  var file = document.getElementById("myFile").files[0];
  console.log("File")
  console.log(file)
  var config = {
  "CONTENT_TYPE": "multipart",
  "PARTS": [{
      "headers": {
          "Content-Disposition": "file;"
      },
      "content": "__FILE__"
  }],
  "FILE": {
      "fileParam": "content",
      "file": file
  }
  }

  ZOHO.CRM.API.uploadFile(config)
  .then(function(data) {
  const account_data = data.data
  console.log("TLZ NOC Doc:")
  account_data.map( (data)=> {
      // console.log(data.details.id)
      account_file_id = data.details.id;
      console.log(account_file_id)

      });
  })
  setTimeout(() => {
    document.getElementById("submit_button").innerHTML = submit_button2 
  }, 7500);    
}

function update_account()
{
    let close_button = `<input style="background-color:red;" type="submit" value="Close" id="submit_button" onclick="onclose_button()">`
    account_type_value2 = document.getElementById("account_type").value;
    if(account_type_value2 === "Transferred to Authority")
    {
        reason_change_value2 = document.getElementById("trans_auth").value;
        agent_name_value  = "";
        console.log("Transferred!!!")
    }
    if(account_type_value2 === "Transferred to Competitor")
    {
        agent_name_value = document.getElementById("agent_name").value;
        reason_change_value2 = "";
        console.log("Competitor!!!")
    }
    console.log(entity_id)
    console.log(account_type_value2)
    console.log(reason_change_value2)
    console.log(agent_name_value)
    console.log(account_file_id)
    var config={
        Entity:"Accounts",
        APIData:{
              "id": entity_id,
              "Transfer_Type": account_type_value2,
              "Transferred_to_Authority_Reason": reason_change_value2,
              "Competitor_Agent_Name": agent_name_value,
              "File_ID": account_file_id
        },
        Trigger:["workflow"]
      }
      ZOHO.CRM.API.updateRecord(config)
      .then(function(data){
        console.log(data)
        alert("You have successfully transferred the account!")
    });
    document.getElementById("submit_button").innerHTML = close_button 
}

function onclose_button()
{
    ZOHO.CRM.UI.Popup.close()
   .then(function(data){
      console.log("Close")
      console.log(data)
   })
}