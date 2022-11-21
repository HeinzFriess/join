"use strict";

const contactsContainer = document.getElementById('contacts-container');
const contactDetails = document.getElementById('contact-details');
const modalBackground = document.getElementById('modal-background');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const addContactBtn = document.getElementById('add-contact');
const editContactBtn = document.getElementById('edit-contact');
const deleteContactBtn = document.getElementById('delete-contact');
const hideContactBtn = document.getElementById('hide-contact');
const modalLabel = document.getElementById('modal-label');
const cancelContact = document.getElementById('modal-cancel');
const createUpdateContact = document.getElementById('modal-confirm');

let lastnameCharacters = [];


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    await downloadFromServer();
    await loadContacts();
    await loadTasks();
    renderContactList();
    addAllEventListeners();
}


/**
 * Adds event listeners to all the listed elments.
 */
function addAllEventListeners() {
    modalBackground.addEventListener('click', hideModal);
    closeModalBtn.addEventListener('click', hideModal);
    addContactBtn.addEventListener('click', () => showModal('add', ''));
    cancelContact.addEventListener('click', hideModal);
    hideContactBtn.addEventListener('click', hideContact);
}


/**
 * Renders the complete contact list including contact seperators.
 */
function renderContactList() {
    getAllLastnameCharacters();

    contactsContainer.innerHTML = '';
    lastnameCharacters.forEach(char => {
        contactsContainer.innerHTML += contactSeparatorTemp(char);
        contacts.forEach((contact) => {
            if(contact.lastname.toUpperCase().startsWith(char)) {
                contactsContainer.innerHTML += contactCardTemp(contact.id);
            }
        });
    });
}


/**
 * Gets the first character of the lastname for each contact in the contacts array.
 */
function getAllLastnameCharacters() {
    const allCharacters = [];

    if(contacts.length > 0) {
        contacts.forEach(contact => {
            const firstCharacter = contact.lastname.charAt(0).toUpperCase();
            allCharacters.push(firstCharacter);
            lastnameCharacters = new Set(allCharacters.sort());
        });
    } else {
        lastnameCharacters = new Set();
    }
}


/**
 * Adds a contact to the contact list with the given data from the modal. 
 */
function addContact(event) {
    event.preventDefault();
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');

    if(contactName.checkValidity() && contactEmail.checkValidity()) {
        const [firstname, ...lastname] = contactName.value.trim().split(' ');
    
        newContact(firstname, lastname, contactEmail, contactPhone)
        sortContacts();
        renderContactList();
        storeContacts();
        hideModal();
    } else {
        reportEmptyInputs(contactName, contactEmail);
    }
}


/**
 * Creates a new contact.
 * @param {String} firstname Contact firstname
 * @param {String} lastname Contact lastnam
 * @param {String} contactEmail Contact email
 * @param {String} contactPhone contact phone
 */
function newContact(firstname, lastname, contactEmail, contactPhone) {
    contacts.push({
        "id": Date.now().toString(36),
        "firstname": firstname.trim(),
        "lastname": lastname.join(' ').trim(),
        "email": contactEmail.value,
        "password": '',
        "phone": contactPhone.value,
        "color": Math.floor(Math.random() * 355)
    });
}


/**
 * Report validity if inputs are empty.
 * @param {Object} contactName HTML name input
 * @param {Object} contactEmail HTML email input
 */
 function reportEmptyInputs(contactName, contactEmail) {
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
    const contactPhone = document.getElementById('contact-phone');
    const contact = contacts.find(contact => contact.id === id);
    const [firstname, ...lastname] = contactName.value.split(' ');

    contact.firstname = firstname.trim();
    contact.lastname = lastname.join(' ').trim();
    contact.email = contactEmail.value;
    contact.phone = contactPhone.value;

    renderContactList();
    showDetailedContact(id);
    storeContacts();
    hideModal();
}


/**
 * Deletes the contact from the contact list. 
 * @param {String} id Unique id of the contact
 */
function deleteContact(id) {
    const contact = contacts.find(contact => contact.id === id);
    const index = contacts.indexOf(contact);
    contacts.splice(index, 1);

    contactDetails.classList.add('d-none');

    renderContactList();
    storeContacts();
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
    const contact = contacts.find(contact => contact.id === id);

    contactDetails.classList.remove('d-none');
    nameEl.innerHTML = `${contact.firstname} ${contact.lastname}`;
    mailEl.innerHTML = contact.email ?? '';
    mailEl.href = `mailto:${contact.email}`;
    phoneEl.innerHTML = contact.phone ?? '';
    phoneEl.href = `tel:${contact.phone}`;
    contactColor.style = `background: hsl(${contact.color}, 100%, 40%)`;
    contactColor.children[0].innerHTML = `${contact.firstname.charAt(0)}${contact.lastname.charAt(0)}`;
    editContactBtn.onclick = () => showModal('edit', id);
    deleteContactBtn.onclick = () => deleteContact(id);
}


/**
 * Sorts the contact list by lastname.
 */
function sortContacts() {
    contacts = contacts.sort((contactA, contactB) => contactA.lastname.localeCompare(contactB.lastname));
}


/**
 * Shows the modal for the add contact/edit contact form.
 * @param {String} type Specifies the type of operation (add/edit)
 * @param {String} id Unique id of the contact
 */
function showModal(type, id) {
    modalBackground.classList.remove('d-none');
    modalBackground.classList.add('modal-background-blur');
    modalContent.classList.remove('d-none');
    modalContent.classList.add('modal-slide-in');

    modalLabel.innerHTML = type === 'add' ? 'Add Contact' : 'Edit Contact';
    createUpdateContact.innerHTML = type == 'add' ? 'Create Contact' : 'Save';
    createUpdateContact.onclick = type == 'add' ? addContact : () => updateContact(id);

    if(type === 'edit') prefillInputFields(id);
}


/**
 * Hides the modal for the add contact/edit contact form.
 */
function hideModal() {
    modalBackground.classList.add('d-none');
    modalContent.classList.add('d-none');
    modalContent.classList.remove('modal-slide-in');
    
    clearInputFields();
}


function hideContact() {
    contactDetails.classList.add('d-none');
}


/**
 * Clears the input fields of the modal.
 */
function clearInputFields() {
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-phone').value = '';
}


/**
 * Prefills the input fields of the modal if the contact gets edited.
 * @param {String} id Unique id of the contact
 */
function prefillInputFields(id) {
    const contact = contacts.find(contact => contact.id === id);

    document.getElementById('contact-name').value = `${contact.firstname} ${contact.lastname}`;
    document.getElementById('contact-email').value = contact.email;
    document.getElementById('contact-phone').value = contact.phone;
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
    const contact = contacts.find(contact => contact.id === id);
    return `
        <div class="contact" onclick="showDetailedContact('${id}')">
            <div style="background: hsl(${contact.color}, 100%, 40%);">
                <span>${contact.firstname.charAt(0)}${contact.lastname.charAt(0)}</span>
            </div>
            <div>
                <span>${contact.lastname}, ${contact.firstname}</span>
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