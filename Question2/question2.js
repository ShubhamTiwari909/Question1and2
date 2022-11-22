const tableDataBody = document.getElementById("table-data-body");
const searchInput = document.getElementById("search-input");


// function to fetch api data
const getAPI = async (url) => {
    let ip
    await fetch(url)
        .then(result => result.json())
        .then(data => {
            ip = data;
        });
    return ip;
};


async function main(inputSstring) {
    // Using the getAPI to get the cafes data and then stored in a variable called cafes
    getAPI("https://raw.githubusercontent.com/debojyoti/places-fake-rest-api/master/cafes.json")
        .then(data => {
            let cafes = data.cafes

            let cafesId = []

            // getting the cafes id and names which has the input string in its substrings
            for (let i = 0; i < cafes.length; i++) {
                if (cafes[i].name.toLowerCase().includes(inputSstring.toLowerCase())) {
                    cafesId.push(cafes[i])
                }
            }

            // call getAPI function to get the places data and stored it in places variable
            getAPI("https://raw.githubusercontent.com/debojyoti/places-fake-rest-api/master/places.json")
                .then(data => {
                    let places = data.places
                    let result = []

                    // filtering the data where if the id in the cafe function is equal to id's in the places function
                    // then return the result , here Object.assign will combine the object data of cafed and and places
                    // and will return the array of objects which will be having all the properties of cafes and places
                    for (let j = 0; j < places.length; j++) {
                        for (let k = 0; k < cafesId.length; k++) {
                            if (places[j].id === cafesId[k].location_id) {
                                result.push(Object.assign(cafesId[k], places[j]))
                            }
                        }
                    }

                    // here we are mapping the filtered data using map function and then injecting it in the table body
                    let filtered = result.map((item,index) => {
                        return (`
                            <tr>
                                <td class="column1">${index+1}</td>
                                <td class="column2">${item.name}</td>
                                <td class="column3">${item.locality}</td>
                                <td class="column4">${item.postal_code}</td>
                                <td class="column5">${item.lat}</td>
                                <td class="column6">${item.long}</td>
                            </tr>
                     `)
                    })

                    tableDataBody.innerHTML = filtered
                });

        });

}


// calling the main function with empty strings so, it will map all the data at the loading time 
main("")


// debounce method to call the search function if the difference between the two keystrokes is bigger than 500 milliseconds
// This will reduce the number of function calls
const debounce = (callback,delay) => {
    let timer;
    return () => {
        clearTimeout(timer)
        setTimeout(() => {
            callback()
        }, delay);
    }
}


// This event will be called on every keystroke
searchInput.addEventListener("keydown", debounce(() =>{ 
    main(searchInput.value);
},500))