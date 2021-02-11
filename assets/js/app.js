var lists = [
	{
		"title": "Did you...",
		"list": [
			"Brush your teeth today?", 
			"Shower today?",
			"Exercise today?",
			"Eat healthy, whole foods today?",
			"Reflect today?",
			"Write today?",
			"Read today?",
			"Make time for your family today?",
			"Accomplish something from your to do list today?"
		]
	},
	{
		"title": "Is your...",
		"list": [
			"House organized today?"
		]
	},
	{
		"title": "Are you...",
		"list": [
			"On budget today?"
		]
	}
];


// Method to iterate over lists object
var buildLists = (arr, el) => {
	arr.forEach((element, id) => {
		var listContainerElement = document.createElement('div');
		listContainerElement.classList.add('list-container');
		el.append(listContainerElement);
		
		var listTitleElement = document.createElement('h2');
		listTitleElement.innerText = element.title;
		listContainerElement.append(listTitleElement);
		
		var listElement = document.createElement('ul');
		listContainerElement.append(listElement);
		
		var listArr = element.list;
		listArr.forEach((item, index) => {
			var listItemElement = document.createElement('li');
			listItemElement.innerText = listArr[index];
			listItemElement.setAttribute('data-list-id', id);
			listItemElement.setAttribute('data-item-id', index);
			listElement.append(listItemElement);
			
			// Check localStorage to see if it's completed
			var itemStatus = localStorage.getItem('item-' + id + '-' + index);
			if(itemStatus !== null) {
				listItemElement.classList.add('complete');
				listItemElement.setAttribute('data-complete', true);
			}
			
			// Attach click handler to each item
			listItemElement.addEventListener('click', event => handleItemClick(event));
		});
	});
};


// Global var for today's date
var today = new Date();
today.setHours(0, 0, 0, 0);


// Check the date
var checkDate = (today) => {	
	var storedDate = localStorage.getItem('date');
	
	if(storedDate) {
		// If a date is stored, compare to see if it's still today
		// NOTE: Convert dates to strings to run this kind of comparison
		if(storedDate.toString() !== today.toString()) {
			// It doesn't match, so...
			// Clear localStorage
			localStorage.clear();
			
			// Set today's date
			localStorage.setItem('date', today);
		}
	} else {
		// There's no stored date, so set it to today
		localStorage.setItem('date', today);
	}
}


var setUIDate = (today) => {	
	// Set the date in the UI
	var todayElement = document.getElementById('today');
	var year = new Intl.DateTimeFormat('en-US', { year: 'numeric' }).format(today);
	var month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(today);
	var day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(today);
	var weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
	todayElement.innerHTML = (`${weekday}, ${month} ${day}, ${year}`);
}


// Method to handle clicking on an item
var handleItemClick = (event) => {
	var item = event.target,
		data = item.dataset,
		status = data.complete,
		listId = data.listId,
		itemId = data.itemId;
	
	if(status) {
		// It's already complete, so reset status
		item.removeAttribute('data-complete');
		item.classList.remove('complete');
		
		// Remove it in localStorage
		localStorage.removeItem('item-' + listId + '-' + itemId);
	} else {
		// It's not complete, so complete it
		item.setAttribute('data-complete', true);
		item.classList.add('complete');
		
		// Record it in localStorage
		localStorage.setItem('item-' + listId + '-' + itemId, true);
	}
}


// Get weather data
// Create a request variable and assign a new XMLHttpRequest object to it.
var request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=Lakewood,OH,US&appid=01ab9ffe4dd21947796ab0dcc2db597b', true)

request.onload = (data) => {
	var response = JSON.parse(data.target.response);
	var weather = response.weather[0];
	
	setScene(weather);
}

// Send request
request.send();


var setScene = (weather) => {
	console.log('Weather: ', weather);
	var headerElement = document.getElementsByTagName('header')[0];
	var weatherMain = weather.main;
	//var weatherDescription = weather.description;
	headerElement.classList.add(weatherMain.toLowerCase());
}


// Check the stored date
checkDate(today);

// Set the date in the UI
setUIDate(today);

// Call the buildLists method to populate the page
var listsElement = document.getElementById('lists');
buildLists(lists, listsElement);