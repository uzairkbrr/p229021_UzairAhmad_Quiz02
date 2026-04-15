# User Registration & Login System - Quiz 02

## Project ka Taaruf

Yeh ek web application hai jo user ka naam, email aur password le kar SQLite database mein mehfooz karti hai. Registration ke baad user login karke landing page dekh sakta hai. Yeh project Quiz 02 ke liye banaya gaya hai.

**Naam:** Uzair Ahmad  
**Roll Number:** p229021

---

## DEMO:

[![Project ka Demo Video](https://cdn.loom.com/sessions/thumbnails/cd2f8426a3e8494ab3fac5399db65f21-with-play.gif)](https://www.loom.com/share/cd2f8426a3e8494ab3fac5399db65f21)

> Tamam screenshots dekhne ke liye [screenshots.md](screenshots.md) kholein.

---

## Files ki Tafseelat

| File ka Naam | Maqsad |
|---|---|
| `index.html` | Registration form - user ka naam, email aur password leta hai |
| `login.html` | Login form - registered user email aur password se login karta hai |
| `landing.html` | Landing page - hero section (uzair.png) aur assignment ki tafseelat |
| `server.js` | Node.js server - registration, login, session aur database sambhalta hai |
| `package.json` | Project ki zarooriyaat aur dependencies |
| `screenshots.md` | Tamam pages ke screenshots aur wazahat |
| `README.md` | Yeh file - project ki maloomat |

---

## Password ki Sharaayet

Password mein yeh sab hona lazmi hai:

- Kam az kam **8 characters** hon
- Kam az kam **1 bara harf** (A-Z) ho
- Kam az kam **1 chhota harf** (a-z) ho
- Kam az kam **1 number** (0-9) ho
- Kam az kam **1 khaas nishan** (!@#$%^&*) ho

---

## Istemal ka Tareeqa

### Zarooriyaat
- **Node.js** install hona chahiye (https://nodejs.org se download karein)
- Web browser (Chrome, Firefox waghaira)

### Qadam ba Qadam Hidayaat

1. **Terminal / Command Prompt kholein**
   - Project folder mein jayein:
   ```
   cd p229021_UzairAhmad_Quiz02
   ```

2. **Zaroori packages install karein**
   ```
   npm install
   ```

3. **Server shuru karein**
   ```
   npm start
   ```
   - Server shuru hone par yeh paigham aayega: `Server chal raha hai: http://localhost:3000`
   - Database khud ba khud ban jayega - koi alag se banane ki zaroorat nahi

4. **Register karein**
   - Browser mein kholein: `http://localhost:3000`
   - Apna naam, email aur password darj karein
   - "Register Karein" button dabayein

5. **Login karein**
   - Registration ke baad "Ab Login Karein" par click karein
   - Ya seedha `http://localhost:3000/login` kholein
   - Email aur password darj karke login karein

6. **Landing Page dekhein**
   - Kamyab login ke baad landing page khulega
   - Hero section mein author ki tasveer aur assignment details dikhein ge
   - Logout karne ke liye upar "Logout" button dabayein

---

## Mukammal Flow

```
Register (/) --> Kamyab --> Login (/login) --> Landing Page (/landing) --> Logout --> Login
```

| Qadam | Safha | Kya Hota Hai |
|---|---|---|
| 1 | `/` | Naya user register hota hai |
| 2 | `/login` | Registered user login karta hai |
| 3 | `/landing` | Hero section aur assignment details dikhti hain |
| 4 | `/logout` | Session khatam, wapis login page |

---

## Database ki Tafseelat

- **Database:** SQLite (file: `quiz02.db`)
- **Table ka naam:** `users`

### Table ke Columns

| Column | Type | Tafseelat |
|---|---|---|
| `id` | INTEGER (AUTOINCREMENT) | Khudkaar number (primary key) |
| `username` | TEXT | User ka naam |
| `email` | TEXT (UNIQUE) | Email (munfarid hona zaroori hai) |
| `password` | TEXT | Password (hash shuda - mehfooz) |
| `created_at` | DATETIME | Registration ki tareekh aur waqt |

---

## Hifazati Khasusiyaat (Security Features)

- Password `PBKDF2 + SHA-512` se hash ho kar mehfooz hota hai
- SQL Injection se bachao ke liye Prepared Statements istemal hote hain
- Client-side aur Server-side dono taraf se tasdeeq hoti hai
- Session-based authentication - bina login ke landing page nahi khulta
- Ek email se sirf ek baar registration ho sakti hai
- Session 30 minute baad khud ba khud khatam ho jati hai

---

## Technologies

- **HTML5** - Forms aur pages ke liye
- **CSS3** - Khubsurat design ke liye
- **JavaScript** - Client-side validation ke liye
- **Node.js + Express** - Server-side processing ke liye
- **SQLite** (sql.js) - Database ke liye
- **express-session** - Login session management ke liye
