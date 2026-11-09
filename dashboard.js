
const SUPABASE_URL = "";
const SUPABASE_PUBLISHABLE_KEY = "";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const apartmentList = document.getElementById("apartment-list");
const dashboardMessage = document.getElementById("dashboard-message");
const logoutBtn = document.getElementById("logout-btn");

// Check whether the user is logged in and authorised
async function checkAdminAccess() {
    const { data: { session }, error } =
        await supabaseClient.auth.getSession();

    if (error || !session) {
        window.location.href = "admin.html";
        return false;
    }

    const { data: isAdmin, error: adminError } =
        await supabaseClient.rpc("is_admin");

    if (adminError || isAdmin !== true) {
        await supabaseClient.auth.signOut();
        window.location.href = "admin.html";
        return false;
    }

    return true;
}

// Retrieve apartments from Supabase
async function loadApartments() {
    dashboardMessage.textContent = "";
    apartmentList.textContent = "Loading apartment information...";

    const { data, error } = await supabaseClient
        .from("apartments")
        .select("id, name, available")
        .order("id");

    if (error) {
        apartmentList.textContent = "Could not load apartment information.";
        dashboardMessage.textContent = error.message;
        return;
    }

    renderApartments(data);
}

// Display apartments on the dashboard
function renderApartments(apartments) {
    apartmentList.replaceChildren();

    apartments.forEach((apartment) => {
        const card = document.createElement("div");
        card.className = "apartment-card";

        const heading = document.createElement("h3");
        heading.textContent = apartment.name;

        const status = document.createElement("span");
        status.className = apartment.available
            ? "status available"
            : "status unavailable";
        status.textContent = apartment.available
            ? "Available"
            : "Unavailable";

        const button = document.createElement("button");
        button.className = "toggle-btn";
        button.dataset.id = apartment.id;
        button.textContent = apartment.available
            ? "Mark as Unavailable"
            : "Mark as Available";

        card.append(heading, status, button);
        apartmentList.appendChild(card);
    });
}

// Save an availability change to Supabase
apartmentList.addEventListener("click", async (e) => {
    const button = e.target.closest(".toggle-btn");

    if (!button) return;

    const apartmentId = button.dataset.id;
    const newAvailability =
        button.textContent === "Mark as Available";

    button.disabled = true;
    button.textContent = "Saving...";
    dashboardMessage.textContent = "";

    const { error } = await supabaseClient
        .from("apartments")
        .update({
            available: newAvailability,
            updated_at: new Date().toISOString()
        })
        .eq("id", apartmentId);

    if (error) {
        dashboardMessage.style.color = "#8B1E2B";
        dashboardMessage.textContent =
            "Could not update availability: " + error.message;

        button.disabled = false;
        await loadApartments();
        return;
    }

    dashboardMessage.style.color = "green";
    dashboardMessage.textContent = "Apartment availability updated.";

    await loadApartments();
});

// Log out of the management dashboard
logoutBtn.addEventListener("click", async () => {
    logoutBtn.disabled = true;

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        dashboardMessage.style.color = "#8B1E2B";
        dashboardMessage.textContent = error.message;
        logoutBtn.disabled = false;
        return;
    }

    window.location.href = "admin.html";
});

// Start the dashboard
async function initialiseDashboard() {
    const authorised = await checkAdminAccess();

    if (authorised) {
        await loadApartments();
    }
}

initialiseDashboard();
