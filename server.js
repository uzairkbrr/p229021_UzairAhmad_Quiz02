// Yeh file Node.js server hai jo registration, login aur landing page sambhalta hai

const express = require('express');         // Express framework server banane ke liye
const session = require('express-session'); // Session management ke liye (login yaad rakhne ke liye)
const initSqlJs = require('sql.js');        // SQLite database ke liye (pure JavaScript)
const path = require('path');               // File paths ke liye
const fs = require('fs');                   // File system - database file likhne ke liye
const crypto = require('crypto');           // Password hash karne ke liye

const app = express();
const PORT = 3000; // Server is port par chalega

// Database file ka raasta
const DB_PATH = path.join(__dirname, 'quiz02.db');

// Database ka variable - baad mein initialize hoga
let db;

// =============================================
// DATABASE KI TAYYARI (Initialization)
// =============================================

async function initDatabase() {
    // SQL.js engine shuru karo
    const SQL = await initSqlJs();

    // Agar database file pehle se maujood hai to usse kholo, warna nayi banao
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
        console.log("Maujoodah database file khol li gayi.");
    } else {
        db = new SQL.Database();
        console.log("Nayi database file banayi gayi.");
    }

    // Users table banao agar pehle se maujood nahi hai
    // Is table mein id, username, email, password aur registration ki tareekh hai
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Database file mein tabdeeliyan mehfooz karo
    saveDatabase();

    console.log("Database aur table ki tayyari mukammal ho gayi!");
}

// Yeh function database ko file mein mehfooz karta hai
function saveDatabase() {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
}

// =============================================
// MIDDLEWARE KI SETTINGS
// =============================================

// Form se aane wala data parse karne ke liye (URL-encoded)
app.use(express.urlencoded({ extended: true }));

// JSON data parse karne ke liye
app.use(express.json());

// Session middleware - user ka login yaad rakhne ke liye
// Jab user login kare to session ban jata hai, logout par khatam ho jata hai
app.use(session({
    secret: 'quiz02-uzair-ahmad-p229021-secret-key', // Session ko encrypt karne ki chaabi
    resave: false,                                     // Har request par session dubara save nahi hoga
    saveUninitialized: false,                          // Khaali session save nahi hogi
    cookie: { maxAge: 30 * 60 * 1000 }                // Session 30 minute tak qaim rahegi
}));

// Static files (HTML, CSS, JS, images) serve karne ke liye
app.use(express.static(path.join(__dirname)));

// =============================================
// ROUTES (Raaste)
// =============================================

// Pehla route - Registration page dikhao
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Login page dikhao
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Landing page dikhao - sirf logged-in users ke liye
app.get('/landing', (req, res) => {
    // Jaanch karo ke user login hai ya nahi
    if (!req.session.user) {
        // Agar login nahi hai to login page par bhejo
        return res.redirect('/login');
    }
    res.sendFile(path.join(__dirname, 'landing.html'));
});

// =============================================
// REGISTRATION ROUTE - Naya user register karo
// =============================================

app.post('/register', (req, res) => {

    // Form se data hasil karo
    const { username, email, password } = req.body;

    // =============================================
    // SERVER PAR TASDEEQ (Validation)
    // =============================================
    // Sirf client-side validation kaafi nahi, server par bhi zaroori hai

    const errors = [];

    // User naam khaali to nahi
    if (!username || username.trim() === '') {
        errors.push("User naam zaruri hai");
    }

    // Email sahih hai ya nahi
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
        errors.push("Sahih email darj karein");
    }

    // Password ki lambai kam az kam 8 honi chahiye
    if (!password || password.length < 8) {
        errors.push("Password kam az kam 8 characters ka hona chahiye");
    }

    // Password mein bara harf (uppercase) hona chahiye
    if (password && !/[A-Z]/.test(password)) {
        errors.push("Password mein kam az kam 1 bara harf (A-Z) hona chahiye");
    }

    // Password mein chhota harf (lowercase) hona chahiye
    if (password && !/[a-z]/.test(password)) {
        errors.push("Password mein kam az kam 1 chhota harf (a-z) hona chahiye");
    }

    // Password mein number hona chahiye
    if (password && !/[0-9]/.test(password)) {
        errors.push("Password mein kam az kam 1 number hona chahiye");
    }

    // Password mein khaas nishan (special character) hona chahiye
    if (password && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push("Password mein kam az kam 1 khaas nishan hona chahiye");
    }

    // Agar koi ghalti hai to wapis bhejo aur ghaltian dikhao
    if (errors.length > 0) {
        return res.send(`
            <!DOCTYPE html>
            <html><head><title>Ghaltian</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
                .error-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); text-align: center; max-width: 450px; }
                .error-box h2 { color: #dc3545; }
                .error-box ul { text-align: left; color: #dc3545; }
                .error-box a { display: inline-block; margin-top: 20px; padding: 10px 25px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; }
            </style></head><body>
            <div class="error-box">
                <h2>Ghaltian Payi Gayin!</h2>
                <ul>${errors.map(e => `<li>${e}</li>`).join('')}</ul>
                <a href="/">Wapis Jayein</a>
            </div></body></html>
        `);
    }

    // =============================================
    // PASSWORD KO HASH KARO (Security ke liye)
    // =============================================
    // Password seedha nahi rakhte, hash karke mehfooz karte hain

    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    const storedPassword = salt + ':' + hashedPassword;

    // =============================================
    // DATABASE MEIN DATA DALO
    // =============================================

    try {
        // Pehle jaanch lo ke yeh email pehle se to registered nahi hai
        const existingUser = db.exec("SELECT id FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0 && existingUser[0].values.length > 0) {
            // Agar email pehle se maujood hai to paigham dikhao
            return res.send(`
                <!DOCTYPE html>
                <html><head><title>Email Maujood Hai</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
                    .error-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); text-align: center; }
                    .error-box h2 { color: #dc3545; }
                    .error-box a { display: inline-block; margin-top: 20px; padding: 10px 25px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; }
                </style></head><body>
                <div class="error-box">
                    <h2>Yeh email pehle se registered hai!</h2>
                    <p>Koi aur email istemal karein.</p>
                    <a href="/">Wapis Jayein</a>
                </div></body></html>
            `);
        }

        // Prepared statement se data dalo - SQL injection se bachne ke liye
        db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username.trim(), email.trim(), storedPassword]);

        // Database file mein tabdeeliyan mehfooz karo
        saveDatabase();

        // Kamyabi ka paigham dikhao - login page ka link bhi do
        res.send(`
            <!DOCTYPE html>
            <html><head><title>Registration Kamyab</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
                .success-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); text-align: center; }
                .success-box h2 { color: #28a745; }
                .success-box a { display: inline-block; margin-top: 20px; padding: 10px 25px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; }
            </style></head><body>
            <div class="success-box">
                <h2>Registration Kamyab Ho Gayi!</h2>
                <p>Aap ka account bana diya gaya hai.</p>
                <p><strong>User Naam:</strong> ${username}</p>
                <p><strong>Email:</strong> ${email}</p>
                <a href="/login">Ab Login Karein</a>
            </div></body></html>
        `);

        console.log("Naya user registered: " + username + " (" + email + ")");

    } catch (error) {
        // Agar database mein koi ghalti ho to paigham dikhao
        console.error("Database ghalti:", error.message);
        res.send(`
            <!DOCTYPE html>
            <html><head><title>Ghalti</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
                .error-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); text-align: center; }
                .error-box h2 { color: #dc3545; }
                .error-box a { display: inline-block; margin-top: 20px; padding: 10px 25px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; }
            </style></head><body>
            <div class="error-box">
                <h2>Registration mein ghalti ho gayi!</h2>
                <p>${error.message}</p>
                <a href="/">Wapis Jayein</a>
            </div></body></html>
        `);
    }
});

// =============================================
// LOGIN ROUTE - User ko login karo
// =============================================

app.post('/login', (req, res) => {

    // Form se email aur password hasil karo
    const { email, password } = req.body;

    // Khaali fields ki jaanch
    if (!email || !password) {
        return res.send(`
            <!DOCTYPE html>
            <html><head><title>Ghalti</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
                .error-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); text-align: center; }
                .error-box h2 { color: #dc3545; }
                .error-box a { display: inline-block; margin-top: 20px; padding: 10px 25px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; }
            </style></head><body>
            <div class="error-box">
                <h2>Email aur password dono zaruri hain!</h2>
                <a href="/login">Wapis Jayein</a>
            </div></body></html>
        `);
    }

    try {
        // Database se user dhundho email ke zariye
        const result = db.exec("SELECT id, username, email, password FROM users WHERE email = ?", [email]);

        // Agar user nahi mila
        if (result.length === 0 || result[0].values.length === 0) {
            return res.send(`
                <!DOCTYPE html>
                <html><head><title>Login Nakaam</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
                    .error-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); text-align: center; }
                    .error-box h2 { color: #dc3545; }
                    .error-box p { color: #666; margin-top: 10px; }
                    .error-box a { display: inline-block; margin-top: 20px; padding: 10px 25px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; margin: 10px 5px 0; }
                </style></head><body>
                <div class="error-box">
                    <h2>Login Nakaam!</h2>
                    <p>Email ya password ghalat hai.</p>
                    <a href="/login">Dobara Koshish Karein</a>
                    <a href="/">Register Karein</a>
                </div></body></html>
            `);
        }

        // User ka data nikalo - [id, username, email, password]
        const user = result[0].values[0];
        const userId = user[0];
        const username = user[1];
        const storedPassword = user[3]; // salt:hash format mein hai

        // Password ki tasdeeq karo - stored hash se milao
        const [salt, hash] = storedPassword.split(':');
        const inputHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');

        // Agar password match nahi karta
        if (inputHash !== hash) {
            return res.send(`
                <!DOCTYPE html>
                <html><head><title>Login Nakaam</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
                    .error-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); text-align: center; }
                    .error-box h2 { color: #dc3545; }
                    .error-box p { color: #666; margin-top: 10px; }
                    .error-box a { display: inline-block; margin-top: 20px; padding: 10px 25px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; margin: 10px 5px 0; }
                </style></head><body>
                <div class="error-box">
                    <h2>Login Nakaam!</h2>
                    <p>Email ya password ghalat hai.</p>
                    <a href="/login">Dobara Koshish Karein</a>
                    <a href="/">Register Karein</a>
                </div></body></html>
            `);
        }

        // Login kamyab! Session mein user ki maloomat rakh do
        req.session.user = {
            id: userId,
            username: username,
            email: email
        };

        console.log("User login kamyab: " + username + " (" + email + ")");

        // Landing page par bhejo - username bhi bhejo taake welcome message dikh sake
        res.redirect('/landing?user=' + encodeURIComponent(username));

    } catch (error) {
        console.error("Login ghalti:", error.message);
        res.send(`
            <!DOCTYPE html>
            <html><head><title>Ghalti</title>
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; justify-content: center; align-items: center; }
                .error-box { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); text-align: center; }
                .error-box h2 { color: #dc3545; }
                .error-box a { display: inline-block; margin-top: 20px; padding: 10px 25px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; }
            </style></head><body>
            <div class="error-box">
                <h2>Login mein ghalti ho gayi!</h2>
                <p>${error.message}</p>
                <a href="/login">Wapis Jayein</a>
            </div></body></html>
        `);
    }
});

// =============================================
// LOGOUT ROUTE - User ko logout karo
// =============================================

app.get('/logout', (req, res) => {
    // Session khatam karo
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout ghalti:", err);
        }
        console.log("User logout ho gaya.");
        // Login page par wapis bhejo
        res.redirect('/login');
    });
});

// =============================================
// SERVER SHURU KARO
// =============================================

// Pehle database tayyar karo, phir server shuru karo
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log("Server chal raha hai: http://localhost:" + PORT);
        console.log("Browser mein kholein: http://localhost:" + PORT);
    });
}).catch((error) => {
    console.error("Database shuru karne mein ghalti:", error);
});
