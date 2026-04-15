# Screenshots - Quiz 02 (p229021 - Uzair Ahmad)

Yeh file tamam pages aur features ke screenshots par mushtamil hai. Har screenshot ke sath uska Roman Urdu mein wazahat di gayi hai.

---

## 1. Registration Page (Khaali Form)

Jab user pehli dafa website kholay to yeh registration form dikhta hai. Yahan user apna naam, email aur password darj kar sakta hai.

![Registration Page](screenshots/01-registration-page.png)

---

## 2. Password Validation - Kamzor Password

Jab user kamzor password likhay to real-time mein requirements laal rang mein dikhti hain. Yahan "abc" likha gaya hai jo tamam zarooraton ko poora nahi karta.

![Password Validation - Kamzor](screenshots/02-password-validation-weak.png)

---

## 3. Password Validation - Mazboot Password

Jab password tamam zarooraton ko poora kare to requirements sabz (green) ho jati hain. Yahan "Test@1234" likha gaya hai jo tamam 5 zarooraton ko poora karta hai.

![Password Validation - Mazboot](screenshots/03-password-validation-strong.png)

---

## 4. Form Validation Error

Agar user bina sahih maloomat ke form submit kare to client-side validation ghalti dikhata hai. Yahan password ki zarooraat poori nahi hui.

![Form Validation Error](screenshots/04-form-validation-error.png)

---

## 5. Kamyab Registration

Jab user sahih maloomat ke sath register kare to yeh kamyabi ka paigham dikhta hai. User ka naam aur email dikhai deta hai aur "Ab Login Karein" ka button milta hai.

![Registration Success](screenshots/05-registration-success.png)

---

## 6. Duplicate Email Error

Agar koi usi email se dubara register karne ki koshish kare to yeh ghalti ka paigham dikhta hai. Ek email se sirf ek baar registration ho sakti hai.

![Duplicate Email Error](screenshots/06-duplicate-email-error.png)

---

## 7. Login Page

Yeh login page hai jahan pehle se registered user apna email aur password darj karke login kar sakta hai. Neeche "Register Karein" ka link bhi hai.

![Login Page](screenshots/07-login-page.png)

---

## 8. Login Nakaam (Ghalat Password)

Agar user ghalat email ya password darj kare to "Login Nakaam" ka paigham dikhta hai. User ko dobara koshish karne ya register karne ka option milta hai.

![Login Failed](screenshots/08-login-failed.png)

---

## 9. Landing Page - Hero Section

Kamyab login ke baad user is landing page par pahunchta hai. Hero section mein Uzair Ahmad ki tasveer (uzair.png) aur project ka taaruf dikhta hai. Navbar mein user ka naam aur logout button hai.

![Landing Page - Hero Section](screenshots/09-landing-hero-section.png)

---

## 10. Landing Page - Full Page

Yeh landing page ka mukammal nazara hai jismein hero section aur assignment details dono shamil hain.

![Landing Page - Full](screenshots/10-landing-full-page.png)

---

## 11. Assignment Details Section

Yeh section assignment ki tafseelat dikhata hai - 6 cards mein: assignment ka maqsad, password ki zarooraat, technologies, hifazati khasusiyaat, student ki maloomat, aur project chalane ka tareeqa.

![Assignment Details](screenshots/11-assignment-details.png)

---

## 12. Logout - Login Page Redirect

Jab user logout button dabaye to session khatam ho jata hai aur user wapis login page par aa jata hai. Bina login ke landing page nahi khul sakta.

![Logout Redirect](screenshots/12-logout-redirect.png)

---

## Mukammal Flow (Complete Flow)

```
Register (/) --> Registration Kamyab --> Login (/login) --> Landing Page (/landing) --> Logout --> Login Page
```

| Qadam | Safha | Kya Hota Hai |
|---|---|---|
| 1 | `/` | User apna naam, email, password darj kare |
| 2 | `/register` | Data tasdeeq ho kar database mein mehfooz ho |
| 3 | `/login` | User email aur password se login kare |
| 4 | `/landing` | Hero section aur assignment details dikhein |
| 5 | `/logout` | Session khatam, wapis login page |
