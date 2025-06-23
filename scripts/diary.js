const API_BASE_URL = "https://tunga-diary-api.onrender.com/api/fullstack";

let docElements;

document.addEventListener('DOMContentLoaded', () => {

    // getAllElements of intrest
    docElements = {
        addButton: document.getElementById('addButton'),
        inputFormWrapper: document.querySelector('.inputFormWrapper'),
        inputForm: document.querySelector('#inputForm'),
        entriesContainer: document.querySelector('.entriesContainer'),
        inputFormSubmit: document.getElementById('inputFormSubmit'),
        inputFormCancel: document.getElementById('inputFormCancel'),
        emptyMessage: document.querySelector('.emptyMessage'),
    }
    loadAllEntries();

    // search items
    // signOut Button
    // emptyMessage
    // entriesContainer 
    docElements.addButton.addEventListener('click', () => {
        docElements.inputFormWrapper.style.display = 'flex';
    });

    docElements.inputForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // TODO: clear my inputs
        // show loading container
        // submit
        // create new entry card
        //
        docElements.inputFormWrapper.style.display = 'none';
        let title = document.querySelector('#title').value;
        let content = document.querySelector('#entryContent').value;
        const entryData = { title, content };

        // show loading box

        try {
            console.log('sending data...');
            const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('jwt='));
            const jwt = token ? token.split('=')[1] : null;

            const response = await axios.post(`${API_BASE_URL}/diary/create`, entryData,
                {
                    headers: { Authorization: `Bearer ${jwt}` }
                }
            );
            console.log('response:', response.status);

            let entryID = response.data.data.id;
            const now = new Date();
            const dateTimeString = now.toLocaleString();

            createEntryCard(title, content, dateTimeString, entryID);
        }

        catch (error) {
            console.log('error:', error);
        }
    });

});

function createEntryCard(title, content, dateTimeString, entryID) {
    // Create card container
    const card = document.createElement('div');
    card.className = 'entryCard';
    card.id = entryID;

    // Title
    const titleElem = document.createElement('h3');
    titleElem.textContent = title;
    card.appendChild(titleElem);

    // Time created
    const timeElem = document.createElement('span');
    timeElem.className = 'entryTime';
    timeElem.textContent = dateTimeString;
    card.appendChild(timeElem);

    // Content
    const contentElem = document.createElement('p');
    contentElem.textContent = content;
    card.appendChild(contentElem);

    //buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'cardButtonContainer';
    // edit button
    const editButton = document.createElement('button');
    editButton.className = 'editEntry';
    editButton.textContent = 'edit';
    buttonContainer.appendChild(editButton);
    // delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'deleteEntry';
    deleteButton.textContent = 'delete';
    buttonContainer.appendChild(deleteButton);

    //add the buttons to the card
    card.appendChild(buttonContainer);

    // Append card to entries container
    docElements.entriesContainer.appendChild(card);



    //add event listeners and 
    editButton.addEventListener('click', () => {
        console.log("edit");
    });
    deleteButton.addEventListener('click', () => {
        console.log("delete");
        deleteEntry(card.id);
    });

}


async function signOut(event) {
    event.preventDefault();

    //check if user is signed in

    try {
        if (document.cookie.split(';').some(cookie => cookie.trim().startsWith('jwt='))) {
            const response = await axios.post(`${API_BASE_URL}/auth/logout`);
        }
    }
    catch (error) {
        if (error.reponse && error.response.status === 404) {
            // you have to be signed in to logout
        }
        else {
            // 500 server side error
        }
    }
}

async function loadAllEntries() {

    console.log('loading resources...');

    try {
        const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('jwt='));
        const jwt = token ? token.split('=')[1] : null;

        const response = await axios.get(`${API_BASE_URL}/diary/entries`,
            {
                headers: { Authorization: `Bearer ${jwt}` }
            }
        );
        console.log('response: ', response);


        let entriesArray = response.data.data;

        if (entriesArray.length > 0) {
            docElements.emptyMessage.style.display = 'none';
            for (let entry of entriesArray) {
                createEntryCard(entry.title, entry.content, entry.updatedAt, entry.id);
            }
        }
    }
    catch (error) {
        // console.log('error: ', error.reponse.status);
    }
}

async function deleteEntry(id){

    // let goAhead = prompt("are you sure?");

    // if(!goAhead){
    //     return;
    // }

   try{
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('jwt='));
        const jwt = token ? token.split('=')[1] : null;

        const response = await axios.delete(`${API_BASE_URL}/diary/delete/${id}`,
            {
                headers: { Authorization: `Bearer ${jwt}` }
            }
        );

        if(response.status === 200){
            const card = document.getElementById(id);
            if(card) card.remove();
        }
        // remove card from dom

   }
   catch(error){
    console.log(error);
   }
}