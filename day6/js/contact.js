function submitData () {
    const name = document.getElementById('inputName').value
    const email = document.getElementById('inputEmail').value
    const phone = document.getElementById('inputPhone').value
    const subject = document.getElementById('inputSubject').value
    const message = document.getElementById('inputMessage').value

    // keadaan jika salah satu input kosong
    if(!name) {
        alert('harap diisi');
    } else if (!email) {
        alert('harap diisi');
    } else if (!phone) {
        alert('harap diisi');
    } else if (!subject) {
        alert('harap diisi');
    } else if (!message) {
        alert('harap diisi');
    } else {
        console.log(`Name : ${name}\nEmail:${email}\nPhone:${phone}\nSubject:${subject}\n${message}`)

        const emailReceiver = 'lala123@gmail.com'

        let a = document.createElement('a')
        a.href = `mailto:${emailReceiver}?subject=${subject}&body=${message}`;
        a.click();
    }
}

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
