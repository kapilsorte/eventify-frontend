// Update all register buttons to use the new registration function
document.addEventListener('DOMContentLoaded', () => {
    const registerButtons = document.querySelectorAll('.register-btn');
    registerButtons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes('alert')) {
            btn.onclick = () => EventifyManager.execute('registerForEvent', btn.closest('.event-card'));
        }
    });
});