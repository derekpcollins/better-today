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
			"Accomplish at least one thing on your to do list today?"
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
			}
			
			// Attach click handler to each item
			listItemElement.addEventListener('click', event => handleItemClick(event));
		});
	});
};


// Check the date and clear localStorage if date doesn't match today
var isToday = () => {
	var today = new Date();
	today.setHours(0, 0, 0, 0);
	var storedDate = new Date(localStorage.getItem('date')); 
	storedDate.setHours(0, 0, 0, 0);
	
	var result = false;
	
	if(storedDate === today) {
		result = true;
	}
	
	return result;
}

var setDate = () => {
	if(isToday()) {
		// Clear localStorage
		localStorage.clear();
	}
	
	// Set the date
	var today = new Date();
	today.setHours(0, 0, 0, 0);
	
	localStorage.setItem('date', today);
}


// Check if it's a new day
setDate();

// Call the buildLists method to populate the page
var listsElement = document.getElementById('lists');
buildLists(lists, listsElement);


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

// Method to reset lists after reload (if date is different than stored date)