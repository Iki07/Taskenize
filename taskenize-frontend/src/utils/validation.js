// Funkcija za sanitizaciju imena i prezimena
export function sanitizeName(name) {
    return name.replace(/[^a-zA-Z-' ]/g, '');
}

// Funkcija za sanitizaciju email adrese
export function sanitizeEmail(email) {
    return email.replace(/[^\w.@-]/g, '');
}

// Funkcija za validaciju email adrese
export function validateEmail(email) {
    const emailCheck = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailCheck.test(String(email).toLowerCase());
}

// Funkcija za validaciju lozinke
export function validatePassword(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:"<>?])[A-Za-z\d!@#$%^&*()_+{}:"<>?]{8,}$/;
    return passwordPattern.test(password);
}