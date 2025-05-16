// Simulated booking data you would actually fetch from your database or JWT
/*const bookings = [
    {
      ticketId: 'G12345',
      time: '06:00',
      direction: 'Madeira ➔ Campus',
      username: 'Matheo',
      email: 'matheo@example.com'
    },
    {
      ticketId: 'R12345',
      time: '17:00',
      direction: 'Campus ➔ Madeira',
      username: 'Matheo',
      email: 'matheo@example.com'
    }
  ];*/

  document.addEventListener("DOMContentLoaded", () => {
    const storedBookings = localStorage.getItem('userBookings');
  
    if (storedBookings) {
      const bookings = JSON.parse(storedBookings);
  
      // Assuming 2 bookings: [going, return]
      if (bookings[0]) renderTicket('ticketGoing', bookings[0], 'blue');
      if (bookings[1]) renderTicket('ticketReturn', bookings[1], 'green');
  
      // Optional: clear storage after rendering
      localStorage.removeItem('userBookings');
    } else {
      console.warn("No booking data found.");
    }
  });
  


  function downloadTicket() {
    const ticketGoing = document.getElementById('ticketGoing');
    const ticketReturn = document.getElementById('ticketReturn');
  
    const wrapper = document.createElement('div');
    wrapper.appendChild(ticketGoing.cloneNode(true));
    wrapper.appendChild(document.createElement('br'));
    wrapper.appendChild(ticketReturn.cloneNode(true));
  
    const opt = {
      margin:       0.5,
      filename:     'My_Tickets.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
  
    html2pdf().set(opt).from(wrapper).save();
  }
  











  
  // Function to render a ticket
  function renderTicket(containerId, ticketData, color) {
    const ticket = document.getElementById(containerId);
    ticket.classList.remove('hidden');
    ticket.innerHTML = `
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-extrabold text-${color}-700 tracking-wide">Glide Connex</h2>
        <span class="text-xs text-gray-500">Booking Ticket</span>
      </div>
  
      <div class="border-t border-dashed border-gray-300 my-4"></div>
  
      <div class="text-sm space-y-3">
        <div class="flex justify-between">
          <span class="font-semibold text-gray-700">Ticket ID</span>
          <span class="font-mono text-gray-900">${ticketData.ticketId}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold text-gray-700">Departure Time</span>
          <span class="font-mono text-gray-900">${ticketData.time}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold text-gray-700">Direction</span>
          <span class="font-mono text-gray-900">${ticketData.direction}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold text-gray-700">Name</span>
          <span class="font-mono text-gray-900">${ticketData.username}</span>
        </div>
        <div class="flex justify-between">
          <span class="font-semibold text-gray-700">Email</span>
          <span class="font-mono text-gray-900">${ticketData.email}</span>
        </div>
      </div>
    `;
  }
  
  // Render the two tickets
  renderTicket('ticketGoing', bookings[0], 'blue');
  renderTicket('ticketReturn', bookings[1], 'green');
  
  