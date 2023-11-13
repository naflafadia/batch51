// Toggle class active untuk hamburger menu
const listNav = document.getElementById('listNav');

document.getElementById('hamburger').onclick = () => {
    listNav.classList.toggle('active');
};

// Ketika klik di luar element maka hilangkan class active
const hamburger = document.getElementById('hamburger');

document.addEventListener('click', function (e) {
    if(!hamburger.contains(e.target) && !listNav.contains(e.target)) {
        listNav.classList.remove('active');
    }
});
