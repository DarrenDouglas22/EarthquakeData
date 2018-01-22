/*
Darren Douglas
Earthquake Data parsing
*/

//grab all data from endpoint
var xhr = new XMLHttpRequest();
xhr.open('GET', "https://api.myjson.com/bins/1f32jb", true);
xhr.send();

xhr.addEventListener("readystatechange", processRequest, false);
xhr.onreadystatechange = processRequest;

//convert json data to desired format
function processRequest(e) {
if (xhr.readyState == 4 && xhr.status == 200) {
 	var response, biggestQuakes, neededInfo, tempArray, formattedDateTime, myDate, myTime, html;
 	response = JSON.parse(xhr.responseText);

 	//if magnitude is unequal, sort earthquakes by descending magnitude; otherwise, sort by ascending time
	response.sort(function(a,b) {
		 if (b.mag != a.mag) {
		 	return parseFloat(b.mag) - parseFloat(a.mag);
		 }
		 else {
		 	return new Date(a.time) - new Date(b.time);
		 }
		 
	})

	//only keep top 15 earthquakes
	biggestQuakes = response.slice(0,16);

	//for each quake, keep id, time, place, magnitude, lat, and long
	neededInfo = [];
	for (i = 0; i < biggestQuakes.length; i++) {
		tempArray = [];
		tempArray.push(biggestQuakes[i].id);

		//convert date and time from ISO format
		formattedDateTime = biggestQuakes[i].time.split("T");

		myDate = new Date(formattedDateTime[0]).toLocaleString('en-US', {year: 'numeric', month: 'long', day: 'numeric'});

		myTime = new Date(biggestQuakes[i].time).toLocaleTimeString('en-US', {hour12: false, hour: 'numeric', minute:'2-digit'});

		tempArray.push(myDate + " @ " + myTime);
		tempArray.push(biggestQuakes[i].place);
		tempArray.push(biggestQuakes[i].mag);
		tempArray.push(biggestQuakes[i].latitude);
		tempArray.push(biggestQuakes[i].longitude);
		neededInfo.push(tempArray);
	}

html = "<table class='table table-striped table-bordered'>";
html+="<tr>";
	html+="<th>ID" + "</th>";
	html+="<th>Time" + "</th>";
	html+="<th>Place" + "</th>";
	html+="<th>Magnitude" + "</th>";
	html+="<th>More " + "</th>";
	html+="</tr>";

for (i = 0; i < neededInfo.length; i++) {

    html+="<tr>";
    html+="<td>"+neededInfo[i][0]+"</td>";
    html+="<td>"+neededInfo[i][1]+"</td>";
    html+="<td>"+neededInfo[i][2]+"</td>";
    html+="<td>"+neededInfo[i][3]+"</td>";
    html+="<td><button id='myButton' onclick='displayDetails("+i+")'>"+"details</button><div style=display=none; id='detailsContainer"+ i+ "'>\n Latitude: "+neededInfo[i][4]+"\n Longitude: "+neededInfo[i][5]+"</div></td>";
    }

    html+="</tr>";

}

html+="</table>";

document.getElementById("dataTable").innerHTML = html;

}

function myFilter() {
  // Declare variables 
  var input, filter, table, tr, td, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("dataTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, and hide those that don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[2];
    if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
  }
}

//display Latitude and Longitude of selected earthquake
function displayDetails(i) {
var moreDetails = document.getElementById('detailsContainer'+i);
moreDetails.style.display = ((moreDetails.style.display!='block') ? 'block' : 'none');
}