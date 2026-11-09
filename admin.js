
const SUPABASE_URL = "https://vsoucqvkezduupccmxpn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_koBMLJ-BCzM__-9-unGLEQ_3EugE30b";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("login-btn");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginBtn.disabled = true;
    loginBtn.textContent = "Signing in...";
    loginMessage.textContent = "";

    try {
        // Sign in with Supabase Authentication
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw error;
        }

        // Check whether this account is an authorised administrator
        const { data: isAdmin, error: adminError } =
            await supabaseClient.rpc("is_admin");

        if (adminError) {
            throw adminError;
        }

        if (isAdmin !== true) {
            await supabaseClient.auth.signOut();
            throw new Error("This account is not authorised to access management.");
        }

        loginMessage.style.color = "green";
        loginMessage.textContent = "Login successful!";

        window.location.href = "dashboard.html";

    } catch (error) {
        loginMessage.style.color = "#8B1E2B";
        loginMessage.textContent = error.message;
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Sign In";
    }
});
