// =========================
// UI SLIDER
// =========================
const options = document.querySelectorAll(".option");
const slide = document.querySelector(".slide");

if (options.length > 0 && slide) {
    options.forEach((ele, index) => {
        ele.addEventListener("mouseenter", () => {
            slide.style.left = `${(100 / options.length) * index}%`;
        });
    });
}

// =========================
// ROOM AVAILABILITY DATA
// =========================
const rooms = {
    Standard: { name: "Standard Apartment", available: true },
    Deluxe: { name: "Deluxe Apartment", available: false },
    Executive: { name: "Executive Apartment", available: true },
    Premium: { name: "Premium Apartment", available: true }
};

// Elements (Declared ONCE)
const roomSelect = document.querySelector("#room-select");
const roomStatus = document.querySelector("#room-status");
const statusText = document.querySelector("#status-text");
const bookingButton = document.querySelector("#booking-btn");
const bookingForm = document.querySelector("#booking-form");
const roomButtons = document.querySelectorAll(".room-btn");

// Handle Room Dropdown Changes
if (roomSelect) {
    roomSelect.addEventListener("change", () => {
        const selectedRoom = roomSelect.value;
        
        if (roomStatus) roomStatus.classList.remove("available", "unavailable");

        if (!selectedRoom) {
            if (statusText) statusText.textContent = "Select a room to check availability.";
            if (bookingButton) bookingButton.disabled = true;
            return;
        }

        const room = rooms[selectedRoom];

        if (room && room.available) {
            if (roomStatus) roomStatus.classList.add("available");
            if (statusText) statusText.textContent = `${room.name} is currently available.`;
            if (bookingButton) bookingButton.disabled = false;
        } else if (room) {
            if (roomStatus) roomStatus.classList.add("unavailable");
            if (statusText) statusText.textContent = `${room.name} is currently unavailable.`;
            if (bookingButton) bookingButton.disabled = true;
        }
    });
}

// =========================
// CARD BUTTON CLICKS
// =========================

roomButtons.forEach(button => {
    const selectedRoom = button.dataset.room;
    const room = rooms[selectedRoom];

    // Disable button if room is unavailable
    if (room && !room.available) {
        button.classList.add("unavailable");
        button.textContent = "Currently Unavailable";
        button.removeAttribute("href");
        return;
    }

    // Handle available room buttons
    button.addEventListener("click", function () {
        const selectedRoom = this.dataset.room;

        if (roomSelect) {
            roomSelect.value = selectedRoom;

            // Update booking form availability
            roomSelect.dispatchEvent(new Event("change"));
        }
    });
});







function updateCardAvailability() {
    Object.keys(rooms).forEach(roomKey => {
        const availabilityElement =
            document.getElementById(`availability-${roomKey}`);

        if (!availabilityElement) return;

        const room = rooms[roomKey];

        if (room.available) {
            availabilityElement.textContent = "Available";
            availabilityElement.classList.remove("unavailable");
        } else {
            availabilityElement.textContent = "Currently Unavailable";
            availabilityElement.classList.add("unavailable");
        }
    });
}




// Initialise card status on page load
updateCardAvailability();

// =========================
// WHATSAPP BOOKING SUBMIT
// =========================
if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const selectedRoom = roomSelect ? roomSelect.value : "";

        if (!selectedRoom || !rooms[selectedRoom] || !rooms[selectedRoom].available) {
            alert("Please select an available room.");
            return;
        }

        const hotelWhatsApp = "2347068629376";
        const roomName = rooms[selectedRoom].name;
        
        const checkIn = document.querySelector("#check-in")?.value || "";
        const checkOut = document.querySelector("#check-out")?.value || "";
        const guestName = document.querySelector("#guest-name")?.value || "";
        const guestPhone = document.querySelector("#guest-phone")?.value || "";
        const guestMessage = document.querySelector("#guest-message")?.value || "";

        const message = `Hello London Royal Hotel,\n\n` +
            `I would like to request a booking.\n\n` +
            `Room: ${roomName}\n` +
            `Check-in: ${checkIn}\n` +
            `Check-out: ${checkOut}\n\n` +
            `Guest Name: ${guestName}\n` +
            `Phone Number: ${guestPhone}\n\n` +
            `Additional Message:\n${guestMessage || "None"}\n\n` +
            `Please let me know if this booking is available. Thank you.`;

        const whatsappURL = `https://wa.me/${hotelWhatsApp}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, "_blank");
    });
}