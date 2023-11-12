let dataBlog = [];
let dataIcons = [];
console.log('test', dataBlog);

function submitProject() {
    let inputProject = document.getElementById('inputProject').value;
    let startDate = new Date(document.getElementById('startDate').value);
    let endDate = new Date(document.getElementById('endDate').value);
    let desc = document.getElementById('desc').value;

    // icon checkbox
    const nodejs = `./img/nodejs.png`;
    const reactjs = `./img/react.png`;
    const nextjs = `./img/nextjs.png`;
    const typescirpt = `./img/typescirpt.png`;

    // deklarasi variabel icons
    let icon1 = document.getElementById('nodeJs');
    let icon2 = document.getElementById('reactJs');
    let icon3 = document.getElementById('nextJs');
    let icon4 = document.getElementById('typeScript');

    // Check Icon
    const iconsForCurrentCard = [];
    icon1.checked === true && iconsForCurrentCard.push(nodejs);
    icon2.checked === true && iconsForCurrentCard.push(reactjs);
    icon3.checked === true && iconsForCurrentCard.push(nextjs);
    icon4.checked === true && iconsForCurrentCard.push(typescirpt);

    console.log('data', iconsForCurrentCard);

    // Memeriksa apakah nilai input kosong
    if(!inputProject || !startDate || !endDate || !desc) {
        alert('Mohon diisi!');
        return;
    }

    // Hitung selisih dalam hari
    const days = dayDifference(startDate, endDate);

    // Menentukan unit durasi berdasarkan selisih waktu
    const {duration, unit} = chooseDuration(days);

    let inputImage = document.getElementById('inputImage').files;

    console.log(`${inputProject} ${startDate} ${endDate} ${inputImage}`);

    inputImage = URL.createObjectURL(inputImage[0]);
    console.log(`${inputImage}`);

    const blog = {
        project: inputProject,
        startDate: startDate,
        endDate: endDate,
        desc: desc,
        image: inputImage,
        duration: duration,
        unit: unit
    };

    dataBlog.push(blog);
    dataIcons.push(iconsForCurrentCard); // simpan icons untuk iconsForCurrentCard
    console.log(dataBlog);
    console.log(dataIcons);
    renderBlog();
}

function renderBlog() {
    document.getElementById('contents').innerHTML = '';

    for (let i = 0; i < dataBlog.length; i++) {
        console.log('data gambar', dataBlog[i]);

        // Menggunakan map untuk membuat array elemen HTML untuk icon current card
        const iconsHTML = dataIcons[i].map(icon => `<img src="${icon}" style="width: 20px;">`).join('');

        document.getElementById('contents').innerHTML += `<div class="container-card">
        <img src="${dataBlog[i].image}" class="img-card">
        <div class="text-card">
            <a href="detail.html">${dataBlog[i].project}</a>
            <h4>durasi : ${dataBlog[i].duration} ${dataBlog[i].unit}</h4>
            <p>${dataBlog[i].desc}</p>
            <div class="checkbox" style="margin-top: 20px;">
                <div id="icon">${iconsHTML}</div>
            </div>
        </div>
        <div class="btn-group">
            <button class="btn-card">edit</button>
            <button class="btn-card">delete</button>
        </div>
    </div>`;
    }
}

function dayDifference (start, end) {
    const timeDiff = end.getTime() - start.getTime();
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24));
}

function chooseDuration(days) {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const remainingDays = days % 30;

    if(years > 0) {
        return { duration: years, unit: 'tahun' };
    } else if (months > 0) {
        return { duration: months, unit: 'bulan' };
    } else  {
        return { duration: remainingDays, unit: 'hari' };
    }
}