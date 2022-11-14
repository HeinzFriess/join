"use strict";

const contactsContainer = document.getElementById('contacts-container');
const contactDetails = document.getElementById('contact-details');
const modalBackground = document.getElementById('modal-background');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const addContactBtn = document.getElementById('add-contact');
const editContactBtn = document.getElementById('edit-contact');
const modalLabel = document.getElementById('modal-label');
const cancelContact = document.getElementById('modal-cancel');
const createupdateContact = document.getElementById('modal-confirm');

let lastnameCharacters = [];


async function init() {
    await downloadFromServer();
    await loadContacts();
    renderContactList();
    addAllEventListeners();
}


function addAllEventListeners() {
    modalBackground.addEventListener('click', hideModal);
    closeModalBtn.addEventListener('click', hideModal);
    addContactBtn.addEventListener('click', () => showModal('add', ''));
    cancelContact.addEventListener('click', hideModal);
}


/**
 * Renders the complete contact list including contact seperators.
 */
function renderContactList() {
    getAllLastnameCharacters()

    contactsContainer.innerHTML = '';
    lastnameCharacters.forEach(char => {
        contactsContainer.innerHTML += contactSeparatorTemp(char);
        contacts.forEach((contact) => {
            if(contact.lastname.toUpperCase().startsWith(char)) {
                contactsContainer.innerHTML += contactCardTemp(contact.id);
            }
        })
    });
}


/**
 * Gets the first character of the lastname for each contact in the contacts array.
 */
function getAllLastnameCharacters() {
    const allCharacters = [];

    contacts.forEach(contact => {
        const firstCharacter = contact.lastname.charAt(0).toUpperCase();
        allCharacters.push(firstCharacter);
        lastnameCharacters = new Set(allCharacters.sort());
    })
}


/**
 * Adds a contact to the contact list with the given data from the modal. 
 */
function addContact() {
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');

    const [lastname, firstname] = contactName.value.split(',');

    contacts.push({
        "id": Date.now().toString(),
        "firstname": firstname.trim(),
        "lastname": lastname.trim(),
        "email": contactEmail.value,
        "password": '',
        "phone": contactPhone.value,
        "color": Math.floor(Math.random() * 355)
    });

    sortContacts();
    renderContactList();
    storeContacts();
    hideModal();
}


/**
 * Updates a contact from the contact list with the given data from the modal. 
 * @param {String} id Unique id of the contact
 */
function updateContact(id) {
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');

    const [lastname, firstname] = contactName.value.split(',');

    contacts.find(contact => {
        contact.firstname = firstname.trim();
        contact.lastname = lastname.trim();
        contact.email = contactEmail.value;
        contact.phone = contactPhone.value;
    });

    renderContactList();
    showDetailedContact(id);
    storeContacts();
    hideModal();
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
    editContactBtn.onclick = () => showModal('edit', id);
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
    createupdateContact.innerHTML = type == 'add' ? 'Create Contact' : 'Save';
    createupdateContact.onclick = type == 'add' ? addContact : () => updateContact(id);

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

    document.getElementById('contact-name').value = `${contact.lastname}, ${contact.firstname}`;
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
        <div class="contact" onclick="showDetailedContact(${id})">
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