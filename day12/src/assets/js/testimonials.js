// Testimonials

// Penggabungan promise dan juga ajax

const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'https://api.npoint.io/5d2c4ab4aee1390596be', true)
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
    return `<div class="container-card mb-4">
    <div class="card-testimonials">
      <img src="${item.image}">
      <div class="card-body mt-3">
        <h6 class="fs-6 fw-light">${item.quotes}</h6>
        <h1 class="d-flex justify-content-end fs-4 fw-bold mt-5">- ${item.author}</h1>
        <div class="d-flex justify-content-end mt-3 rate-card">
          <h2 class="fs-4 fw-bold">${item.rate}</h2>
        <img src="../assets/icons/star.png">
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