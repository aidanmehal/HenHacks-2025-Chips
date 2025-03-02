/* Burger and Sidebar functionalities for header*/
function showSidebar() {
    const sidebar = document.querySelector('.phone_menu');
    sidebar.style.display = 'flex';
}
function closeSidebar() {
    const sidebar = document.querySelector('.phone_menu');
    sidebar.style.display = 'none';
}



document.getElementById('rollButton').addEventListener('click', function() {
    const scroll = document.querySelector('.scroll');
    scroll.classList.add('rolled'); // Add 'rolled' class to start the animation
});