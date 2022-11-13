"use strict";

const contactsContainer = document.getElementById('contacts-container');
const modalBackground = document.getElementById('modal-background');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const addContactBtn = document.getElementById('add-contact');
const editContactBtn = document.getElementById('edit-contact');
const modalLabel = document.getElementById('modal-label');
const cancelContact = document.getElementById('modal-cancel');
const createEditContact = document.getElementById('modal-confirm');

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
    addContactBtn.addEventListener('click', () => showModal('add', null));
    cancelContact.addEventListener('click', hideModal);
}


function renderContactList() {
    getAllLastnameCharacters()

    contactsContainer.innerHTML = '';
    lastnameCharacters.forEach(char => {
        contactsContainer.innerHTML += contactSeparatorTemp(char);
        contacts.forEach((contact, index) => {
            if(contact.lastname.startsWith(char)) {
                contactsContainer.innerHTML += contactCardTemp(contact, index);
            }
        })
    });
}


function getAllLastnameCharacters() {
    const allCharacters = [];

    contacts.forEach(contact => {
        const firstCharacter = contact.lastname.charAt(0).toUpperCase();
        allCharacters.push(firstCharacter);
        lastnameCharacters = new Set(allCharacters.sort());
    })
}


function showDetailedContact(index) {
    const nameEl = document.getElementById('contact-detail-name');
    const mailEl = document.getElementById('contact-detail-mail');
    const phoneEl = document.getElementById('contact-detail-phone');
    const contactColor = document.getElementById('contact-color');
    const contact = contacts[index];

    nameEl.innerHTML = `${contact.firstname} ${contact.lastname}`;
    mailEl.innerHTML = contact.email ?? '';
    mailEl.href = `mailto:${contact.email}`;
    phoneEl.innerHTML = contact.phone ?? '';
    phoneEl.href = `tel:${contact.phone}`;
    contactColor.style = `background: hsl(${contact.color}, 100%, 40%)`;
    editContactBtn.onclick = () => showModal('edit', index);
}

function addContact() {
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');

    const [lastname, firstname] = contactName.value.split(',');

    contacts.push({
        "id": contacts.length + 1,
        "firstname": firstname.trim(),
        "lastname": lastname.trim(),
        "email": contactEmail.value,
        "password": '',
        "phone": contactPhone.value,
        "color": Math.floor(Math.random() * 355)
    });

    contacts = contacts.sort((contactA, contactB) => contactA.lastname.localeCompare(contactB.lastname))

    contactName.value = '';
    contactEmail.value = '';
    contactPhone.value = '';

    renderContactList();
    storeContacts();
    hideModal();
}

function editContact(index) {
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactPhone = document.getElementById('contact-phone');
    const contact = contacts[index];

    const [lastname, firstname] = contactName.value.split(',');

    contacts[index] = {
        "id": contact.id,
        "firstname": firstname.trim(),
        "lastname": lastname.trim(),
        "email": contactEmail.value,
        "password": contact.password ?? '',
        "phone": contactPhone.value,
        "color": contact.color
    }

    renderContactList();
    showDetailedContact(index);
    storeContacts();
    hideModal();
}


/**
 * Shows the modal for the add contact/edit contact form.
 * @param {String} type 
 */
function showModal(type, index) {
    modalBackground.classList.remove('d-none');
    modalBackground.classList.add('modal-background-blur');
    modalContent.classList.remove('d-none');
    modalContent.classList.add('modal-slide-in');
    document.getElementById('contact-name').value = `${contacts[index].lastname}, ${contacts[index].firstname}`;
    document.getElementById('contact-email').value = contacts[index].email;
    document.getElementById('contact-phone').value = contacts[index].phone;
    modalLabel.innerHTML = type === 'add' ? 'Add Contact' : 'Edit Contact'
    createEditContact.innerHTML = type == 'add' ? 'Create Contact' : 'Save'
    createEditContact.onclick = type == 'add' ? addContact : () => editContact(index);
}


/**
 * Hides the modal for the add contact/edit contact form.
 */
function hideModal() {
    modalBackground.classList.add('d-none');
    modalContent.classList.add('d-none');
    modalContent.classList.remove('modal-slide-in');
    // Clear input values
    document.getElementById('contact-name').value = '';
    document.getElementById('contact-email').value = '';
    document.getElementById('contact-phone').value = '';
}


// -------------------
// Templates
// -------------------

function contactCardTemp(contact, index) {
    return `
        <div class="contact" onclick="showDetailedContact(${index})">
            <div style="background: hsl(${contact.color}, 100%, 40%);">
                <span>${contact.firstname.charAt(0)}${contact.lastname.charAt(0)}</span>
            </div>
            <div>
                <span>${contact.lastname}, ${contact.firstname}</span>
                <span>${contact.email}</span>
            </div>
        </div>`;
}


function contactSeparatorTemp(letter) {
    return `
        <div class="contact-seperator">
            <span>${letter}</span>
        </div>`;
}


init();