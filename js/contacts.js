"use strict";

const modalBackground = document.getElementById('modal-background');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal');
const addContact = document.getElementById('add-contact');
const cancelContact = document.getElementById('cancel');


modalBackground.addEventListener('click', hideModal);
closeModalBtn.addEventListener('click', hideModal);
addContact.addEventListener('click', showModal);
cancelContact.addEventListener('click', hideModal);


/**
 * Shows the modal for the add contact/edit contact form.
 */
function showModal() {
    modalBackground.classList.remove('d-none');
    modalBackground.classList.add('modal-background-blur');
    modalContent.classList.remove('d-none');
    modalContent.classList.add('modal-slide-in');
}


/**
 * Hides the modal for the add contact/edit contact form.
 */
function hideModal() {
    modalBackground.classList.add('d-none');
    modalContent.classList.add('d-none');
    modalContent.classList.remove('modal-slide-in');
}