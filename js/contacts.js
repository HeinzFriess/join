"use strict";

const contactsContainer = document.getElementById('contacts-container');
const contactDetails = document.getElementById('contact-details');
const modalBackground = document.getElementById('modal-background');
const modalAddContact = document.getElementById('modal-add-contact');
const modalAddTask = document.getElementById('modal-add-task');
const closeModalContactsBtn = document.getElementById('close-modal-contacts');
const closeModalTaskBtn = document.getElementById('close-modal-task');
const addContactBtn = document.getElementById('add-contact');
const editContactBtn = document.getElementById('edit-contact');
const deleteContactBtn = document.getElementById('delete-contact');
const addTaskContactBtn = document.getElementById('add-task-contact');
const hideContactBtn = document.getElementById('hide-contact');
const modalLabel = document.getElementById('modal-label');
const cancelContact = document.getElementById('modal-cancel');
const createUpdateContact = document.getElementById('modal-confirm');

let firstnameCharacters = [];


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    //await downloadFromServer();
    await loadDBEntries();
    //await loadTasks();
    renderContactList();
    addAllEventListenersContacts();
}


/**
 * Adds event listeners to all the listed elments.
 */
function addAllEventListenersContacts() {
    modalBackground.addEventListener('click', hideModals);
    closeModalContactsBtn.addEventListener('click', hideModals);
    addContactBtn.addEventListener('click', () => showModalAddContacts('add', ''));
    cancelContact.addEventListener('click', hideModals);
    hideContactBtn.addEventListener('click', hideContact);
    addTaskContactBtn.addEventListener('click', showModalAddTask);
    closeModalTaskBtn.addEventListener('click', hideModals);
}


/**
 * Renders the complete contact list including contact seperators.
 */
function renderContactList() {
    getAllFirstnameCharacters();

    contactsContainer.innerHTML = '';
    firstnameCharacters.forEach(char => {
        contactsContainer.innerHTML += contactSeparatorTemp(char);
        contacts.forEach((contact) => {
            if (contact.first_name.toUpperCase().startsWith(char)) {
                contactsContainer.innerHTML += contactCardTemp(contact.id);
            }
        });
    });
}


/**
 * Gets the first character of the firstname for each contact in the contacts array.
 */
function getAllFirstnameCharacters() {
    const allCharacters = [];

    if (contacts.length > 0) {
        contacts.forEach(contact => {
            try {
                if (contact.first_name) {
                    const lastCharacter = contact.first_name.charAt(0).toUpperCase();
                    allCharacters.push(lastCharacter);
                    firstnameCharacters = new Set(allCharacters.sort());
                }
            } catch (error) {
            }
        });
    } else {
        firstnameCharacters = new Set();
    }
}


/**
 * Adds a contact to the contact list with the given data from the modal. 
 */
async function addContact(event) {
    event.preventDefault();
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactPassword = document.getElementById('contact-password');

    if (contactName.checkValidity() && contactEmail.checkValidity()) {
        const first_name = contactName.value.trim().split(' ')[0];
        const last_name = contactName.value.trim().split(' ')[1];
        const contact = {
            'username': last_name+first_name,
            'first_name' : first_name,
            'last_name' : last_name,
            'email' : contactEmail.value,
            'password' : contactPassword.value
        }
        console.log(contact);
        sortContacts();
        renderContactList();
        await storeNewContact(contact);
        hideModals();
        //showDetailedContact(id);
        notify();
    } else {
        reportEmptyContactInputs(contactName, contactEmail);
    }
}


/**
 * Report validity if inputs are empty.
 * @param {Object} contactName HTML name input
 * @param {Object} contactEmail HTML email input
 */
function reportEmptyContactInputs(contactName, contactEmail) {
    if (!contactEmail.checkValidity()) {
        contactEmail.reportValidity();
    }
    if (!contactName.checkValidity()) {
        contactName.reportValidity();
    }
}


/**
 * Updates the contact from the contact list with the given data from the modal. 
 * @param {String} id Unique id of the contact
 */
function updateContact(id) {
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    //const contactPassword = document.getElementById('contact-password');
    const contact = contacts.find(contact => contact.id == id);
    const [firstname, ...lastname] = contactName.value.split(' ');

    contact.first_name = firstname.trim();
    contact.last_name = lastname.join(' ').trim();
    contact.email = contactEmail.value;
    //contact.phone = contactPhone.value;

    
    //showDetailedContact(id);
    //storeContacts();
    editContacts(contact)
        .then( result => {
            notify('Succesfully edited')
            renderContactList();
        }, 
        err => {
            notify(err);
        });
    hideModals();
    //showDetailedContact(id);
    //notify('Succesfully saved!');
}


/**
 * Deletes the contact from the contact list. 
 * @param {String} id Unique id of the contact
 */
function deleteContact(id) {
    const contact = contacts.find(contact => contact.id == id);
    const index = contacts.indexOf(contact);
    contacts.splice(index, 1);

    contactDetails.classList.add('d-none');

    renderContactList();
    storeContacts();
    notify('Succesfully deleted!');
}


/**
 * Shows the details of the contact 
 * @param {String} id Unique id of the contact
 */
function showDetailedContact(id) {
    const nameEl = document.getElementById('contact-detail-name');
    const mailEl = document.getElementById('contact-detail-mail');
    const phoneEl = document.getElementById('contact-detail-phone');
    const contactColor = document.getElementById('contact-color');
    const contact = contacts.find(contact => contact.id == id);
    let firstName = '';
    let lastName = '';
    let initial1 = '';
    let initial2 = '';
    if (contact.first_name) {
        firstName = contact.first_name
        initial1 = firstName.charAt(0);
    };
    if (contact.last_name) {
        lastName = contact.last_name;
        initial2 = lastName.charAt(0);
    };
    contactDetails.classList.remove('d-none');
    nameEl.innerHTML = `${firstName} ${lastName}`;
    mailEl.innerHTML = contact.email ?? '';
    mailEl.href = `mailto:${contact.email}`;
    phoneEl.innerHTML = contact.phone ?? '';
    phoneEl.href = `tel:${contact.phone}`;
    contactColor.style = `background: hsl(${contact.color}, 100%, 40%)`;
    contactColor.children[0].innerHTML = `${initial1}${initial2}`;
    editContactBtn.onclick = () => showModalAddContacts('edit', id);
    deleteContactBtn.onclick = () => deleteContact(id);
}


/**
 * Sorts the contact list by lastname.
 */
function sortContacts() {
    try {
        contacts = contacts.sort((contactA, contactB) => contactA.last_name.localeCompare(contactB.last_name));
    } catch (error) {
        
    }
    
}


/**
 * Shows the modal for the add contact/edit contact form.
 * @param {String} type Specifies the type of operation (add/edit)
 * @param {String} id Unique id of the contact
 */
function showModalAddContacts(type, id) {
    modalBackground.classList.remove('d-none');
    modalBackground.classList.add('modal-background-blur');
    modalAddContact.classList.remove('d-none');
    modalAddContact.classList.add('modal-slide-in-left');

    modalLabel.innerHTML = type === 'add' ? 'Add Contact' : 'Edit Contact';
    createUpdateContact.innerHTML = type == 'add' ? 'Create Contact' : 'Save';
    createUpdateContact.onclick = type == 'add' ? addContact : () => updateContact(id);

    if (type === 'edit') prefillInputFields(id);
}


/**
 * Hides the modal for the add contact/edit contact form.
 */
function hideModals() {
    modalBackground.classList.add('d-none');
    modalAddContact.classList.add('d-none');
    modalAddContact.classList.remove('modal-slide-in-left');
    modalAddTask.classList.add('d-none');
    modalAddTask.classList.remove('modal-slide-in-right');

    clearInputFields();
}


function showModalAddTask() {
    modalBackground.classList.remove('d-none');
    modalBackground.classList.add('modal-background-blur');
    modalAddTask.classList.remove('d-none');
    modalAddTask.classList.add('modal-slide-in-right');
    //renderAssignees();
    // tbd contacts and category to render from db
}


/**
 * Hides the contact details in mobile view.
 */
function hideContact() {
    contactDetails.classList.add('d-none');
}


/**
 * Clears the input fields of the modal.
 */
function clearInputFields() {
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-password').value = '';
}


/**
 * Prefills the input fields of the modal if the contact gets edited.
 * @param {String} id Unique id of the contact
 */
function prefillInputFields(id) {
    const contact = contacts.find(contact => contact.id == id);

    document.getElementById('contact-name').value = `${contact.first_name} ${contact.last_name}`;
    document.getElementById('contact-email').value = contact.email;
    //document.getElementById('contact-phone').value = contact.phone;
}


// -------------------
// Templates
// -------------------

/**
 * Returns the HTML template for the contact card.
 * @param {String} id Unique id of the contact
 * @returns HTML contact card template
 */
function contactCardTemp(id) {
    const contact = contacts.find(contact => contact.id == id);
    let firstName = '';
    let lastName = '';
    let initial1 = '';
    let initial2 = '';
    if (contact.first_name) {
        firstName = contact.first_name
        initial1 = firstName.charAt(0);
    };
    if (contact.lastname) {
        lastName = contact.last_name;
        //firstName  += ',';
        initial2 = lastName.charAt(0);
    };
    return `
        <div class="contact" onclick="showDetailedContact('${id}')">
            <div style="background: hsl(${contact.color}, 100%, 40%);">
                <span>${initial1}${initial2}</span>
            </div>
            <div>
                <span>${firstName} ${lastName}</span>
                <span>${contact.email}</span>
            </div>
        </div>`;
}


/**
 * Returns the HTML template for the contact separator.
 * @param {String} character Character that will be rendered in the separator
 * @returns HTML separator template
 */
function contactSeparatorTemp(character) {
    return `
        <div class="contact-seperator">
            <span>${character}</span>
        </div>`;
}


init();