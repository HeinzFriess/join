"use strict";

const modalBackground = document.getElementById('modal-background');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const addContact = document.getElementById('add-contact');
const editContact = document.getElementById('edit-contact');
const modalLabel = document.getElementById('modal-label');
const cancelContact = document.getElementById('modal-cancel');
const createEditContact = document.getElementById('modal-confirm');


modalBackground.addEventListener('click', hideModal);
closeModalBtn.addEventListener('click', hideModal);
addContact.addEventListener('click', () => showModal('add'));
editContact.addEventListener('click', () => showModal('edit'));
cancelContact.addEventListener('click', hideModal);


/**
 * Shows the modal for the add contact/edit contact form.
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