// JS functions for responsive mobile menu

const btn = document.querySelector('.mobile-menu-button');
const sidebar = document.querySelector('.sidebar');

// handling when mobile menu button is clicked
btn.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    sidebar.classList.add('bg-yellow-100');
});