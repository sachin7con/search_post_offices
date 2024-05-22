// SGN

    const ipElement = document.getElementById("ip");
    const submitElement = document.getElementById("submit");
    const container = document.getElementById("container");
    const searchPage = document.getElementById("searchPage");
    const searchInput = document.getElementById("searchInput");

    // Fetch and display IP
    document.addEventListener('DOMContentLoaded', () => {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                // ipElement.textContent = 'Your Current IP Address is ' + data.ip;
                ipElement.innerHTML = `Your Current IP Address is  <span class="white"> ${data.ip} </span>`;
                submitElement.dataset.ip = JSON.stringify(data);
                // data.ip.style.color="white";
            })
            .catch(error => {
                console.error('Error fetching IP address:', error);
                ipElement.textContent = 'Error fetching IP address';
            });
    });

    // Fetch Post Offices
    function fetchPostOffices(pincode) {
        return fetch(`https://api.postalpincode.in/pincode/${pincode}`)
            .then(response => response.json())
            .then(data => {
                if (data[0].Status === "Success") {
                    return data[0].PostOffice;
                } else {
                    throw new Error('No post offices found');
                }
            })
            .catch(error => {
                console.error('Error fetching post offices:', error);
                return [];
            });
    }

    // On click submit show search page
    submitElement.addEventListener('click', () => {
        const ipData = JSON.parse(submitElement.dataset.ip);

        // Hide initial container and show search page
        container.style.display = 'none';
        searchPage.style.display = 'block';

        // Fetch and display additional information
        fetch(`https://ipapi.co/${ipData.ip}/json/`)
            .then(response => response.json())
            .then(data => {

                document.getElementById("IPADD").innerHTML = `IP Address:   <span class="white">${data.ip}</span>`;
                document.getElementById("Lat").innerHTML = `Lat:   <span class="white">${data.latitude}</span>`;
                document.getElementById("City").innerHTML = `City:  <span class="white"> ${data.city}</span>`;
                document.getElementById("Organisation").innerHTML = `Organisation:  <span class="white">${data.org}</span>`;
                document.getElementById("Long").innerHTML = `Long:  <span class="white">${data.longitude}</span>`;
                document.getElementById("Region").innerHTML = `Region: <span class="white">${data.region}</span>`;
                document.getElementById("Hostname").innerHTML = `Hostname: <span class="white">${data.hostname}</span>`;
                document.getElementById("Timezone").innerHTML = `Timezone: <span class="white">${data.timezone}</span>`;
                document.getElementById("Datentime").textContent = "Datetime: " + new Date().toLocaleString("en-US", { timeZone: data.timezone });
                document.getElementById("Pincode").innerHTML = `Postal Code: <span class="white">${data.postal}</span>`;

                showMap(data.latitude, data.longitude);

                return fetchPostOffices(data.postal);
            })
            .then(postOffices => {
                document.getElementById("Message").innerHTML = `Message: <span class="white">${postOffices.length}</span> pincode(s) found`;
                displayPostOffices(postOffices);
            })
            .catch(error => {
                console.error('Error fetching additional data', error);
                document.getElementById("Message").textContent = 'Error fetching additional data';
            });
    });

    function showMap(lat, lon) {
        const mapFrame = document.createElement('iframe');
        mapFrame.src = `https://maps.google.com/maps?q=${lat},${lon}&hl=es&z=14&output=embed`;
        mapFrame.width = "600";
        mapFrame.height = "450";
        document.getElementById('map').appendChild(mapFrame);
    }

    function displayPostOffices(postOffices) {
        const listOfPODiv = document.getElementById('listOfPO');
        listOfPODiv.innerHTML = postOffices.map(postOffice => `
            <div class="postOffice">
                <p><strong>Name:</strong> ${postOffice.Name}</p>
                <p><strong>Branch Type:</strong> ${postOffice.BranchType}</p>
                <p><strong>Delivery Status:</strong> ${postOffice.DeliveryStatus}</p>
                <p><strong>District:</strong> ${postOffice.District}</p>
                <p><strong>Division:</strong> ${postOffice.Division}</p>
            </div>
        `).join('');
    }

    // Filter post offices
    searchInput.addEventListener('input', (event) => {
        const filter = event.target.value.toLowerCase();
        const postOffices = document.querySelectorAll('.postOffice');
        postOffices.forEach(po => {
            const name = po.querySelector('p:nth-child(1)').textContent.toLowerCase();
            const branchType = po.querySelector('p:nth-child(2)').textContent.toLowerCase();
            if (name.includes(filter) || branchType.includes(filter)) {
                po.style.display = '';
            } else {
                po.style.display = 'none';
            }
    });
  });
