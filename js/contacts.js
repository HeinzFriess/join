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

let contacts = [];
let lastnameCharacters = new Set(['A', 'B', 'D']);


async function init() {
    addAllEventListeners();
    contacts = await loadContacts();
    renderContacts();
}


function addAllEventListeners() {
    modalBackground.addEventListener('click', hideModal);
    closeModalBtn.addEventListener('click', hideModal);
    addContactBtn.addEventListener('click', () => showModal('add'));
    editContactBtn.addEventListener('click', () => showModal('edit'));
    cancelContact.addEventListener('click', hideModal);
}


async function loadContacts() {
    return await fetch('/contacts.json').then(resp => resp.json());
}

function renderContacts() {
    contactsContainer.innerHTML = '';

    contacts.forEach((contact, index) => {
        contactsContainer.innerHTML += contactCardTemp(contact, index);
    })
}

function renderSeperators() {
    contactsContainer.innerHTML = '';

    lastnameCharacters.forEach(character => {
        contactsContainer.innerHTML += contactSeparatorTemp(character);
    })
}

function showDetailedContact(index) {
    const nameEl = document.getElementById('contact-detail-name');
    const mailEl = document.getElementById('contact-detail-mail');
    const phoneEl = document.getElementById('contact-detail-phone');
    const contactColor = document.getElementById('contact-color');
    let contact = contacts[index];

    nameEl.innerHTML = `${contact.firstname} ${contact.lastname}`;
    mailEl.innerHTML = contact.email;
    mailEl.href = `mailto:${contact.email}`;
    phoneEl.innerHTML = contact.phone;
    phoneEl.href = `tel:${contact.phone}`;
    contactColor.style = `background: hsl(${contact.color}, 100%, 40%)`;
}

function addContact(contact) {
    contacts.push(contact);
    renderContacts();
}


/**
 * Shows the modal for the add contact/edit contact form.
 * @param {String} type 
 */
function showModal(type) {
    modalBackground.classList.remove('d-none');
    modalBackground.classList.add('modal-background-blur');
    modalContent.classList.remove('d-none');
    modalContent.classList.add('modal-slide-in');
    modalLabel.innerHTML = type === 'add' ? 'Add Contact' : 'Edit Contact'
    createEditContact.innerHTML = type == 'add' ? 'Create Contact' : 'Save'
}


/**
 * Hides the modal for the add contact/edit contact form.
 */
function hideModal() {
    modalBackground.classList.add('d-none');
    modalContent.classList.add('d-none');
    modalContent.classList.remove('modal-slide-in');
}


// -------------------
// Templates
// -------------------

function contactCardTemp(contact, index) {
    return `
        <div class="contact" onclick="showDetailedContact(${index})">
            <div style="background: hsl(${contact.color}, 100%, 40%);">
                <span>FL</span>
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