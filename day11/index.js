const express = require('express')
const path = require('path')
const app = express()
const port = 5000

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, 'src/views'))

app.use("/assets", express.static('src/assets'))
app.use(express.urlencoded({ extended: false }))

app.get('/', home)
app.get('/contact', contact)
app.get('/add-project', addProjectView)
app.post('/add-project', addProject)
app.get('/detail', detail)
app.get('/testimonials', testimonials)


function home(req, res) {
    res.render('index');
}

function contact(req, res) {
    res.render('contact')
}

function addProjectView(req, res) {
    res.render('add-project')
}

function addProject(req, res) {
    const name = req.body.name
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const desc = req.body.desc
    const checkbox = req.body.checkbox
    
    console.log('Project Name :', name)
    console.log('Start Date :', startDate)
    console.log('End Date :', endDate)
    console.log('Description :', desc)
    console.log('Technologies :', checkbox)
    res.redirect('/')
}

function detail(req, res) {
    res.render('detail')
}

function testimonials(req, res) {
    res.render('testimonials')
}

app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`)
})