const express = require('express')
const path = require('path')
const app = express()
const port = 5000
const handlebars = require('handlebars');
const handlebarsEqual = require('handlebars-helper-equal');
const config = require('./src/config/config.json')
const { Sequelize, QueryTypes} = require('sequelize')
const sequelize =  new Sequelize(config.development)

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, 'src/views'))

app.use("/assets", express.static('src/assets'))
app.use(express.urlencoded({ extended: false }))

handlebars.registerHelper('eq', handlebarsEqual);

app.get('/', home)
app.get('/contact', contact)
app.post('/delete-card/:id', deleteCard)

app.get('/add-project', addProjectView)
app.post('/add-project', addProject)

app.get('/update-project/:id', updateProjectView)
app.post('/update-project', updateProject)

app.get('/detail/:id', detail)
app.get('/testimonials', testimonials)

const data = []

async function home(req, res) {
    const query = 'SELECT * FROM projects'
    const projects = await sequelize.query(query, { type: QueryTypes.SELECT })

    const projectsWithInfo = projects.map(project => {
        const days = dayDifference(new Date(project.start_date), new Date(project.end_date));
        const { duration, unit } = chooseDuration(days);

        const icons = {
            nodeJs: project.technologies.includes('nodeJs') ? "/assets/img/nodejs.png" : '',
            nextJs: project.technologies.includes('nextJs') ? "/assets/img/nextjs.png" : '',
            reactJs: project.technologies.includes('reactJs') ? "/assets/img/react.png"  : '',
            typeScript: project.technologies.includes('typeScript') ? "/assets/img/typescirpt.png" : ''
        };
        return {
            ...project,
            technologies: project.technologies.join(', '),
            duration,
            unit,
            icons
        };
    });

    console.log('projectsWithInfo:', projectsWithInfo); // Tambahkan baris ini

    res.render('index', { data: projectsWithInfo });
}

function contact(req, res) {
    res.render('contact')
}

function addProjectView(req, res) {
    res.render('add-project')
}

async function addProject(req, res) {
    const { name, start, end, description, id } = req.body
    const checkboxes = ['nodeJs', 'nextJs', 'reactJs', 'typeScript'].filter(checkbox => req.body[checkbox])

    const image = 'react.png'
    
    // Hitung selisih dalam hari
    const days = dayDifference(new Date(start), new Date(end))

    // Menentukan unit durasi berdasarkan selisih waktu
    const { duration, unit } = chooseDuration(days)

    // Ambil icon yang dipilih
    const icons = {
        nodeJs: checkboxes.includes('nodeJs') ? "/assets/img/nodejs.png" : '',
        nextJs: checkboxes.includes('nextJs') ? "/assets/img/nextjs.png" : '',
        reactJs: checkboxes.includes('reactJs') ? "/assets/img/react.png"  : '',
        typeScript: checkboxes.includes('typeScript') ? "/assets/img/typescirpt.png" : ''
    }

    const query = `INSERT INTO projects(name, start_date, end_date, description, technologies, image) VALUES('${name}', '${start}', '${end}', '${description}', ARRAY['${checkboxes.join("','")}'], '${image}')`
    const obj = await sequelize.query(query, { type: QueryTypes.INSERT})


    console.log('data berhasil diinsert', obj)
    res.redirect('/')
}
async function updateProjectView(req, res) {
    const {id} = req.params

    const query = `SELECT * FROM projects WHERE id=${id}`
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT })

    res.render('update-project', { data: obj[0] })
}

async function updateProject(req, res) {
    const { name, start, end, description, id } = req.body
    const checkboxes = ['nodeJs', 'nextJs', 'reactJs', 'typeScript'].filter(checkbox => req.body[checkbox])


    // Hitung selisih dalam hari
    const days = dayDifference(new Date(start), new Date(end))

    // Menentukan unit durasi berdasarkan selisih waktu
    const { duration, unit } = chooseDuration(days)

    // Ambil icon yang dipilih
    const icons = {
        nodeJs: checkboxes.includes('nodeJs') ? "/assets/img/nodejs.png" : '',
        nextJs: checkboxes.includes('nextJs') ? "/assets/img/nextjs.png" : '',
        reactJs: checkboxes.includes('reactJs') ? "/assets/img/react.png"  : '',
        typeScript: checkboxes.includes('typeScript') ? "/assets/img/typescirpt.png" : ''
    }
    const query = `UPDATE projects SET name='${name}', ${start ? `start_date='${start}',` : ''} ${end ? `end_date='${end}',` : ''} description='${description}', technologies=ARRAY['${checkboxes.join("','")}'] WHERE id=${id}`
    const obj = await sequelize.query(query, { type: QueryTypes.UPDATE })

    console.log('berhasil diupdate', obj)

    res.redirect('/')
}

async function deleteCard(req, res) {
    const {id} = req.params
 
    const query = `DELETE FROM projects WHERE id=${id}`
    const obj = await sequelize.query(query, { type: QueryTypes.DELETE })

    res.redirect('/')
}

async function detail(req, res) {
    const { id } = req.params

    const query = `SELECT * FROM projects WHERE id=${id}`
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT })

    // Format tanggal ke YYYY-MM-DD
    const formattedStartDate = obj[0].start_date.toISOString().split('T')[0]
    const formattedEndDate = obj[0].end_date.toISOString().split('T')[0]

    const days = dayDifference(new Date(obj[0].start_date), new Date(obj[0].end_date))
    const { duration, unit } = chooseDuration(days)

    const icons = {
        nodeJs: obj[0].technologies.includes('nodeJs') ? "/assets/img/nodejs.png" : '',
        nextJs: obj[0].technologies.includes('nextJs') ? "/assets/img/nextjs.png" : '',
        reactJs: obj[0].technologies.includes('reactJs') ? "/assets/img/react.png"  : '',
        typeScript: obj[0].technologies.includes('typeScript') ? "/assets/img/typescirpt.png" : ''
    }

    console.log('detail project:', obj[0]);
    res.render('detail', {
        data: {
            ...obj[0],
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            duration,
            unit,
            icons
        }
    })
}

function testimonials(req, res) {
    res.render('testimonials')
}

function dayDifference (start, end) {
    const timeDiff = end.getTime() - start.getTime()
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24))
}

function chooseDuration(days) {
    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    const remainingDays = days % 30

    if(years > 0) {
        return { duration: years, unit: 'tahun'}
    } else if (months > 0) {
        return { duration: months, unit: 'bulan'}
    } else {
        return { duration: remainingDays, unit: 'hari'}
    }
}

app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`)
})