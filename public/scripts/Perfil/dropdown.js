export function iniciarDropdown() {
    const btn = document.getElementById('BtnDropdown');
    const dropdown = document.querySelector('.dropdown-content');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', () => {
        dropdown.style.display = (dropdown.style.display === "flex") ? "none" : "flex";
    });
}