document.querySelectorAll('.alert-button').forEach(button => {
    button.addEventListener('click', function() {
        // Simple alert or replace with your own function
        alert('You clicked on: ' + this.innerText);
    });
});
