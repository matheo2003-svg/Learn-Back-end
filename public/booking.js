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
      
        const bookingData = {
          ticketId: Math.floor(Math.random() * 100000),
          time: time,
          direction: direction,
          username: document.querySelector('.username').textContent,
          email: document.querySelector('.email').textContent
        };
      
        // Get current bookings from localStorage (if any)
        const existing = JSON.parse(localStorage.getItem('userBookings') || '[]');
      
        // Add this new booking
        existing.push(bookingData);
      
        // Store updated bookings array
        localStorage.setItem('userBookings', JSON.stringify(existing));
      
        // If this is the second booking (return ticket), redirect to tickets.html
        if (existing.length === 2) {
          window.location.href = 'tickets.html';
        }
      
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
  

