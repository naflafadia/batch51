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

// Penggabungan promise dan juga ajax

const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://api.npoint.io/ae4124631124ce6353a2', true)
    xhr.onload = () => {
        if(xhr.status === 200) {
            // console.log('berhasil', xhr.response)
            resolve(JSON.parse(xhr.response))
        } else {
            // console.log('gagal', xhr.response)
        }
    }

    xhr.onerror = () => {
        // console.log('Network error! Please check your internet connection')
    }
    xhr.send()
})

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

async function allTestimonials() {
    try {
        let testiHtml = '';
        const testiData = await promise 
        testiData.forEach((item) => {
        testiHtml += html(item)
        });

        document.getElementById('testimonials').innerHTML = testiHtml;
    } catch (error) {
        console.error(error);
    }

}

allTestimonials();

async function filterTestimonials(rate) {
    try {
        let testiHtml = '';
        const testiData = await promise
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
    } catch (error) {
        console.error(error);
    }

}
