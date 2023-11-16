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

// OOP

// class Testimonials {
//     constructor(image, quotes, author, rate) {
//         this.image = image;
//         this.quotes = quotes;
//         this.author = author;
//         this.rate = rate;
//     }

//     html() {
//         return `
//         <div class="container-card">
//         <div class="card">
//         <img src="${this.image}">
//         <h3>${this.quotes}</h3>
//         <div class="content-card">
//             <h2>${this.author}</h2>
//             <div class="card-rate">
//                 <h2>${this.rate}</h2>
//                 <img src="./img/star.png">
//             </div>
//         </div>
//         </div>
//     </div>`
//     }
// }

// const testi1 = new Testimonials('./img/woman5.jpg', `"Layanan pelanggan luar biasa! Respon cepat dan solusi yang memuaskan."`, 'Seraphina Blake', '5');
// const testi2 = new Testimonials('./img/woman2.jpg', `"Produk ini memenuhi harapan saya. Kualitasnya luar biasa, sangat direkomendasikan!"`, 'Aria Steele', '4');
// const testi3 = new Testimonials('./img/woman3.jpg', `"Pengalaman belanja online yang menyenangkan. Mudah, cepat, dan akurat."`, 'Zara Knight','3');
// const testi4 = new Testimonials('./img/woman4.jpg', `"Dukungan pelanggan luar biasa. Prosesnya lancar dan hasilnya memuaskan."`, 'Luna Everhart','4');
// const testi5 = new Testimonials('./img/woman1.jpg', `"Produk revolusioner! Mempermudah pekerjaan dan sangat efisien."`, 'Jocelyn Phoenix', '5');

// const testi = [testi1, testi2, testi3, testi4, testi5];

// let testiHtml = '';
// for(let i = 0; i < testi.length; i++) {
//     testiHtml += testi[i].html();
// }

// document.getElementById('testimonials').innerHTML = testiHtml

// HOF

const testiData = [
    {
        image: './img/woman5.jpg',
        quotes: `"Layanan pelanggan luar biasa! Respon cepat dan solusi yang memuaskan."`,
        author: 'Seraphina Blake',
        rate: 5
    },
    {
        image: './img/woman2.jpg',
        quotes: `"Produk ini memenuhi harapan saya. Kualitasnya luar biasa, sangat direkomendasikan!"`,
        author: 'Aria Steele',
        rate: 4
    },
    {
        image: './img/woman3.jpg',
        quotes: `"Pengalaman belanja online yang menyenangkan. Mudah, cepat, dan akurat."`,
        author: 'Zara Knight',
        rate: 3
    },
    {
        image: './img/woman4.jpg',
        quotes: `"Dukungan pelanggan luar biasa. Prosesnya lancar dan hasilnya memuaskan."`,
        author: 'Luna Everhart',
        rate: 4
    },
    {
        image: './img/woman1.jpg',
        quotes: `"Produk revolusioner! Mempermudah pekerjaan dan sangat efisien."`,
        author: 'Jocelyn Phoenix',
        rate: 5
    }
];

function html(item) {
    return `
    <div class="container-card">
        <div class="card">
        <img src="${item.image}">
        <h3>${item.quotes}</h3>
        <div class="content-card">
            <h2>${item.author}</h2>
            <div class="card-rate">
                <h2>${item.rate}</h2>
                <img src="./img/star.png">
            </div>
        </div>
        </div>
    </div>`
}

function allTestimonials() {
    let testiHtml = '';
    testiData.forEach((item) => {
    testiHtml += html(item)
    });

    document.getElementById('testimonials').innerHTML = testiHtml;
}
allTestimonials();

function filterTestimonials(rate) {
    let testiHtml = '';
    const testimonialFiltered = testiData.filter((item) => {
        return item.rate === rate
    });

    if(testimonialFiltered.length === 0) {
        testiHtml = `<h3> Data not found </h3>`
    } else {
        testimonialFiltered.forEach((item) => {
            testiHtml += html(item) });
    }
    
    document.getElementById('testimonials').innerHTML = testiHtml;
}
