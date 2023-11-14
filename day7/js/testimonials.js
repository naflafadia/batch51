// Hamburger Menu

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

// Testimonials

class Testimonials {
    constructor(image, quotes, author, company, rate) {
        this.image = image;
        this.quotes = quotes;
        this.author = author;
        this.company = company;
        this.rate = rate;
    }

    html() {
        return `
        <div class="container-card">
        <div class="card">
        <img src="${this.image}">
        <h3>${this.quotes}</h3>
        <div class="content-card">
            <h2>${this.author}</h2>
            <h4>${this.company}</h4>
            <div class="card-rate">
                <h2>${this.rate}</h2>
                <img src="./day7/img/star.png">
            </div>
        </div>
        </div>
    </div>`
    }
}

const testi1 = new Testimonials('./day7/img/woman5.jpg', `"Layanan pelanggan luar biasa! Respon cepat dan solusi yang memuaskan."`, 'Seraphina Blake', 'QuantumForge Solutions', '5');
const testi2 = new Testimonials('./day7/img/woman2.jpg', `"Produk ini memenuhi harapan saya. Kualitasnya luar biasa, sangat direkomendasikan!"`, 'Aria Steele', 'Stellar Innovations Co.', '4');
const testi3 = new Testimonials('./day7/img/woman3.jpg', `"Pengalaman belanja online yang menyenangkan. Mudah, cepat, dan akurat."`, 'Zara Knight', 'VelocitySynergy Enterprises', '3');
const testi4 = new Testimonials('./day7/img/woman4.jpg', `"Dukungan pelanggan luar biasa. Prosesnya lancar dan hasilnya memuaskan."`, 'Luna Everhart', 'Nexus Dynamics Group', '4');
const testi5 = new Testimonials('./day7/img/woman1.jpg', `"Produk revolusioner! Mempermudah pekerjaan dan sangat efisien."`, 'Jocelyn Phoenix', 'ApexTech Ventures', '5');

const testi = [testi1, testi2, testi3, testi4, testi5];

let testiHtml = '';
for(let i = 0; i < testi.length; i++) {
    testiHtml += testi[i].html();
}

document.getElementById('testimonials').innerHTML = testiHtml