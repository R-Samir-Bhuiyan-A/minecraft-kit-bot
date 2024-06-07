document.addEventListener('DOMContentLoaded', function() {
  const saveButton = document.getElementById('saveButton');
  const jsonDataTextarea = document.getElementById('jsonData');

  saveButton.addEventListener('click', function() {
    const newData = jsonDataTextarea.value;
    fetch('/update-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ jsonData: newData })
    })
    .then(response => {
      if (response.ok) {
        alert('JSON data saved successfully.');
      } else {
        alert('Failed to save JSON data.');
      }
    })
    .catch(error => {
      console.error('Error saving JSON data:', error);
      alert('An error occurred while saving JSON data.');
    });
  });
});
