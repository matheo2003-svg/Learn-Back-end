async function bookRide(button, id, time, direction) {
    try {
      // Disable button and show loading text
      button.disabled = true;
      const originalText = button.textContent;
      button.textContent = 'Booking...';
  
      const response = await fetch('/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ userId: id, time, direction })
      });
  
      const data = await response.json();
      
      if (response.ok) {
        alert(data.message || 'Booking successful!');
      } else {
        alert(data.message || 'Booking failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error booking ride.');
    } finally {
      // Re-enable button and restore original text
      button.disabled = false;
      button.textContent = 'Book';
    }
  }
  