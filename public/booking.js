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

        generateTicket({
          bookingId: Math.floor(Math.random() * 100000), // Example, ideally from backend
          time: time,
          direction: direction,
          username: document.querySelector('.username').textContent,
          email: document.querySelector('.email').textContent
      });



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
  



  function generateTicket(bookingData) {
    document.getElementById('ticketId').textContent = bookingData.bookingId;
    document.getElementById('ticketTime').textContent = bookingData.time;
    document.getElementById('ticketDirection').textContent = bookingData.direction;
    document.getElementById('ticketUser').textContent = bookingData.username;
    document.getElementById('ticketEmail').textContent = bookingData.email;

    // Show the ticket after filling it
    document.getElementById('ticket').style.display = 'block';
}

function printTicket() {
    const ticketContent = document.getElementById('ticket').outerHTML;
    const newWindow = window.open('', '', 'width=600,height=600');
    newWindow.document.write(ticketContent);
    newWindow.document.close();
    newWindow.print();
}
