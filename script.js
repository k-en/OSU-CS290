if(document.getElementById('submit')){
  document.getElementById('submit').addEventListener('click',function(event){
    var newItem = document.getElementById("newItem");

    var req = new XMLHttpRequest();
    var paramsURL = "/insert?" + 
      "name="+newItem.elements.name.value+
      "&reps="+newItem.elements.reps.value+
      "&weight="+newItem.elements.weight.value+
      "&date="+newItem.elements.date.value;

    if(newItem.elements.lbs){
      paramsURL+="&lbs=1";
    } else{
      paramsURL+="&lbs=0";
    }

    // open the request
    req.open("GET", paramsURL, true);
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

    req.addEventListener('load', function(){
      if(req.status >= 200 && req.status < 400){
        var response = JSON.parse(req.responseText);
        var id = response.inserted;
        var table = document.getElementById("data");

        var row = table.insertRow(-1);

        var name = document.createElement('td');
        name.textContent = newItem.elements.name.value;
        row.appendChild(name);

        var reps = document.createElement('td');
        reps.textContent = newItem.elements.reps.value;
        row.appendChild(reps);

        var weight = document.createElement('td');
        weight.textContent = newItem.elements.weight.value;
        row.appendChild(weight);
        
        var lbs = document.createElement('td');
        if(newItem.elements.lbs.value){
          lbs.textContent = "lbs"
        }else{
          lbs.textContent = "kg"
        }
        row.appendChild(lbs);

        var date = document.createElement('td');
        date.textContent = newItem.elements.date.value;
        row.appendChild(date);

        var edit = document.createElement('td');
        var editLink = document.createElement('a');
        editLink.setAttribute('href','/edit?id='+id);
        var editButton = document.createElement('button');
        editButton.setAttribute('type','button');
        editButton.setAttribute('value','edit');
        editLink.appendChild(editButton);
        edit.appendChild(editLink);
        row.appendChild(edit);

        var deleteItem = document.createElement('td');
        var deleteButton = document.createElement('button');
        deleteButton.setAttribute('type','button');
        deleteButton.setAttribute('name','delete');
        deleteButton.setAttribute('value','delete');
        deleteButton.setAttribute('onClick', 'deleteRow("data",'+id+')');
        var deleteID = document.createElement('input');
        deleteID.setAttribute('type','hidden');
        deleteID.setAttribute('id', 'delete'+id);
        deleteItem.appendChild(deleteButton);
        deleteItem.appendChild(deleteID);
        row.appendChild(deleteItem);
      }
      else {
        console.log('there was an error');
      }
    });

    // send request
    req.send(paramsURL);
    event.preventDefault();
  });
}

function deleteRow(tableName, id){
  var table = document.getElementById(tableName);

  for(var i = 1; i < table.rows.length; i++){
    var row = table.rows[i];
    var dataCells = row.getElementsByTagName("td");
    var deleteCell = dataCells[dataCells.length -1];
    if(deleteCell.children[1].id === "delete"+id){
      table.deleteRow(i);
    }
  }
  var req = new XMLHttpRequest();

  req.open("GET", "/delete?id="+id, true);

  req.addEventListener("load",function(){
    if(req.status >= 200 && req.status < 400){
      console.log('delete request sent');
    }else{
      console.log('there was an error');
    }
  });

  req.send("/delete?id="+id );
}