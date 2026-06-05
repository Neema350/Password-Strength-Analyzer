
// DOM Elements
const passwordInput = document.getElementById('password-input');
const togglePasswordBtn = document.getElementById('toggle-password-btn');
const passwordLengthDisplay = document.getElementById('password-length');
const progressFill = document.getElementById('progress-fill');
const strengthText = document.getElementById('strength-text');
const strengthDescription = document.getElementById('strength-description');
const suggestionsSection = document.getElementById('suggestions-section');
const suggestionsList = document.getElementById('suggestions-list');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const tooltip = document.getElementById('tooltip');

// Requirement items
const requirements = {
    length: document.getElementById('req-length'),
    uppercase: document.getElementById('req-uppercase'),
    lowercase: document.getElementById('req-lowercase'),
    number: document.getElementById('req-number'),
    special: document.getElementById('req-special')
};

// Strength levels configuration
const strengthLevels = {
    weak: {
        label: 'Weak',
        min: 0,
        max: 33,
        color: 'weak',
        description: 'Your password is too weak. Add more characters and variety.'
    },
    medium: {
        label: 'Medium',
        min: 34,
        max: 66,
        color: 'medium',
        description: 'Your password is moderately strong. Consider adding more special characters.'
    },
    strong: {
        label: 'Strong',
        min: 67,
        max: 100,
        color: 'strong',
        description: 'Excellent! Your password is strong and secure.'
    }
};

// Password generation configuration
const specialCharacters = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';

// State
let passwordChecks = {
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumbers: false,
    hasSpecialChar: false
};

// Event Listeners
passwordInput.addEventListener('input', handlePasswordInput);
togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
generateBtn.addEventListener('click', generateStrongPassword);
copyBtn.addEventListener('click', copyPasswordToClipboard);
clearBtn.addEventListener('click', clearPassword);

// Initialize
updatePasswordAnalysis();

/**
 * Handle password input and trigger analysis
 */
function handlePasswordInput() {
    updatePasswordAnalysis();
}

/**
 * Analyze password and update all UI elements
 */
function updatePasswordAnalysis() {
    const password = passwordInput.value;
    
    // Update password length display
    updatePasswordLength(password.length);
    
    // Check password requirements
    checkPasswordRequirements(password);
    
    // Calculate password strength
    const strengthScore = calculateStrengthScore();
    
    // Update strength indicator
    updateStrengthIndicator(strengthScore);
    
    // Update requirement UI
    updateRequirementsUI();
    
    // Generate suggestions
    generateSuggestions(password);
    
    // Update button states
    updateButtonStates(password);
}

/**
 * Update password length display
 */
function updatePasswordLength(length) {
    passwordLengthDisplay.textContent = length;
}

/**
 * Check all password requirements
 */
function checkPasswordRequirements(password) {
    passwordChecks.hasMinLength = password.length >= 8;
    passwordChecks.hasUppercase = /[A-Z]/.test(password);
    passwordChecks.hasLowercase = /[a-z]/.test(password);
    passwordChecks.hasNumbers = /[0-9]/.test(password);
    passwordChecks.hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);
}

/**
 * Calculate password strength score (0-100)
 */
function calculateStrengthScore() {
    let score = 0;
    const password = passwordInput.value;
    
    // Length scoring (0-30 points)
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    
    // Character variety scoring (0-60 points)
    if (passwordChecks.hasUppercase) score += 15;
    if (passwordChecks.hasLowercase) score += 15;
    if (passwordChecks.hasNumbers) score += 15;
    if (passwordChecks.hasSpecialChar) score += 15;
    
    // Bonus for length + variety (0-10 points)
    if (password.length >= 12 && Object.values(passwordChecks).filter(Boolean).length === 5) {
        score += 10;
    }
    
    return Math.min(score, 100);
}

/**
 * Update strength indicator UI
 */
function updateStrengthIndicator(score) {
    let level;
    
    if (score < strengthLevels.weak.max) {
        level = 'weak';
    } else if (score < strengthLevels.medium.max) {
        level = 'medium';
    } else {
        level = 'strong';
    }
    
    const config = strengthLevels[level];
    
    // Update progress bar
    progressFill.className = `progress-fill ${level}`;
    progressFill.style.width = `${Math.min(score, 100)}%`;
    
    // Update strength text
    strengthText.textContent = config.label;
    strengthText.className = `strength-text ${level}`;
    
    // Update description
    strengthDescription.textContent = config.description;
}

/**
 * Update requirements UI based on checks
 */
function updateRequirementsUI() {
    updateRequirementItem('length', passwordChecks.hasMinLength);
    updateRequirementItem('uppercase', passwordChecks.hasUppercase);
    updateRequirementItem('lowercase', passwordChecks.hasLowercase);
    updateRequirementItem('number', passwordChecks.hasNumbers);
    updateRequirementItem('special', passwordChecks.hasSpecialChar);
}

/**
 * Update individual requirement item
 */
function updateRequirementItem(type, isMet) {
    const element = requirements[type];
    if (isMet) {
        element.classList.add('met');
    } else {
        element.classList.remove('met');
    }
}

/**
 * Generate improvement suggestions
 */
function generateSuggestions(password) {
    const suggestions = [];
    
    if (!password) {
        suggestionsSection.style.display = 'none';
        return;
    }
    
    if (!passwordChecks.hasMinLength) {
        suggestions.push('Add at least 8 characters to your password.');
    }
    
    if (!passwordChecks.hasUppercase) {
        suggestions.push('Include uppercase letters (A-Z) for better security.');
    }
    
    if (!passwordChecks.hasLowercase) {
        suggestions.push('Include lowercase letters (a-z) in your password.');
    }
    
    if (!passwordChecks.hasNumbers) {
        suggestions.push('Add numbers (0-9) to increase password strength.');
    }
    
    if (!passwordChecks.hasSpecialChar) {
        suggestions.push('Add special characters (!@#$%^&*) for maximum security.');
    }
    
    if (password.length > 20) {
        // This is actually good, so we can remove if all others are met
        if (Object.values(passwordChecks).every(Boolean)) {
            suggestions.pop(); // Remove last suggestion if all are met
        }
    }
    
    // Display suggestions or hide section
    if (suggestions.length > 0) {
        suggestionsSection.style.display = 'block';
        suggestionsList.innerHTML = suggestions
            .map(suggestion => `<li>${suggestion}</li>`)
            .join('');
    } else {
        suggestionsSection.style.display = 'none';
    }
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    togglePasswordBtn.classList.toggle('active', !isPassword);
}

/**
 * Generate a strong password
 */
function generateStrongPassword() {
    const length = 16;
    const allCharacters = uppercaseLetters + lowercaseLetters + numbers + specialCharacters;
    
    let password = '';
    
    // Ensure at least one of each character type
    password += getRandomCharacter(uppercaseLetters);
    password += getRandomCharacter(lowercaseLetters);
    password += getRandomCharacter(numbers);
    password += getRandomCharacter(specialCharacters);
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += getRandomCharacter(allCharacters);
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    // Set password input
    passwordInput.value = password;
    
    // Reset password visibility to hidden
    if (passwordInput.type === 'text') {
        togglePasswordVisibility();
    }
    
    // Trigger analysis
    updatePasswordAnalysis();
    
    // Focus on input
    passwordInput.focus();
}

/**
 * Get random character from string
 */
function getRandomCharacter(characters) {
    return characters.charAt(Math.floor(Math.random() * characters.length));
}

/**
 * Copy password to clipboard
 */
function copyPasswordToClipboard() {
    const password = passwordInput.value;
    
    if (!password) {
        return;
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(password)
        .then(() => {
            // Show tooltip
            showTooltip();
        })
        .catch(err => {
            console.error('Failed to copy password:', err);
            // Fallback method
            fallbackCopyToClipboard(password);
        });
}

/**
 * Fallback copy to clipboard method
 */
function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showTooltip();
}

/**
 * Show tooltip notification
 */
function showTooltip() {
    tooltip.classList.add('show');
    setTimeout(() => {
        tooltip.classList.remove('show');
    }, 2000);
}

/**
 * Clear password input
 */
function clearPassword() {
    passwordInput.value = '';
    
    // Reset password visibility
    if (passwordInput.type === 'text') {
        togglePasswordVisibility();
    }
    
    // Update analysis
    updatePasswordAnalysis();
    
    // Focus on input
    passwordInput.focus();
}

/**
 * Update button states
 */
function updateButtonStates(password) {
    // Enable/disable copy button based on password presence
    copyBtn.disabled = !password;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (event) => {
    // Alt + G: Generate password
    if (event.altKey && event.key.toLowerCase() === 'g') {
        event.preventDefault();
        generateStrongPassword();
    }
    
    // Alt + C: Copy password
    if (event.altKey && event.key.toLowerCase() === 'c') {
        event.preventDefault();
        if (!copyBtn.disabled) {
            copyPasswordToClipboard();
        }
    }
    
    // Escape: Clear password
    if (event.key === 'Escape') {
        clearPassword();
    }
});
