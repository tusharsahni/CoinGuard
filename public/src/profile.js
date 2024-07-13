document.addEventListener('DOMContentLoaded', function () {
    Promise.all([
        fetch('navbar.html').then(response => response.text()),
    ]).then(data => {
        document.getElementById('navbar').innerHTML = data[0];
    });

    // Initialize intlTelInput
    const input = document.querySelector("#phone");
    window.intlTelInput(input, {
        initialCountry: "India",
        separateDialCode: true,
    });
});

function toggleEdit() {
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const cancelButton = document.getElementById('cancel-button');
    const displayFields = document.querySelectorAll('.display-field');
    const editFields = document.querySelectorAll('.edit-field');

    displayFields.forEach(field => field.classList.toggle('hidden'));
    editFields.forEach(field => field.classList.toggle('hidden'));
    editButton.classList.toggle('hidden');
    saveButton.classList.toggle('hidden');
    cancelButton.classList.toggle('hidden');
}

function cancelEdit() {
    toggleEdit();
}