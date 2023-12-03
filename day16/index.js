// App Initialization
const express = require('express')
const path = require('path')
const app = express()
const port = 5000
const handlebars = require('handlebars');
const handlebarsEqual = require('handlebars-helper-equal');
const config = require('./src/config/config.json')
const { Sequelize, QueryTypes} = require('sequelize')
const sequelize =  new Sequelize(config.development)
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const blogModel = require('./src/models').blog
const upload = require('./src/middlewares/uploadFile')
const functions = require('./src/utilities/functions')
const { formatDate, getDefaultImage, getSelectedIcons, dayDifference, chooseDuration } = require('./src/utilities/functions')

// Set view engine and views directory
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, 'src/views'))

// Static file and body parser middleware
app.use("/assets", express.static('src/assets'))
app.use("/uploads", express.static('src/uploads'))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: 'verysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}))

// Handlebars helper registration
handlebars.registerHelper('eq', handlebarsEqual)

// Routes
app.get('/', home)
app.get('/contact', checkAuth, contact)
app.post('/delete-card/:id', checkAuth, deleteCard)

app.get('/add-project', checkAuth, addProjectView)
app.post('/add-project', checkAuth, upload.single("image"), addProject)

app.get('/update-project/:id', checkAuth, updateProjectView)
app.post('/update-project', checkAuth, upload.single("image"), updateProject)

app.get('/detail/:id', checkAuth, detail)
app.get('/testimonials', checkAuth, testimonials)

app.get('/register', registerView)
app.post('/register', register)

app.get('/login', loginView)
app.post('/login', login)


// Function to render home page
async function home(req, res) {
    const query = `SELECT projects.id, projects.name, projects.start_date,
    projects.end_date, projects.description, projects.technologies,
    projects.image, users.name AS author, projects."createdAt", projects."updatedAt" FROM projects LEFT JOIN users ON projects.author_id = users.id`

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
        }
    })

    const isLogin = req.session.isLogin
    const user = req.session.user

    res.render('index', { data: projectsWithInfo, user: req.session.user, isLogin: isLogin, user: user })
}

// Function to render contact page
function contact(req, res) {
    const isLogin = req.session.isLogin
    const user = req.session.user
    
    res.render('contact', {isLogin: isLogin, user: user})
}

// Function to render add project view
function addProjectView(req, res) {
    const isLogin = req.session.isLogin
    const user = req.session.user

    res.render('add-project', {isLogin: isLogin, user: user})
}

// Function to handle project addition
async function addProject(req, res) {
    const { name, start, end, description } = req.body
    const checkboxes = ['nodeJs', 'nextJs', 'reactJs', 'typeScript'].filter(checkbox => req.body[checkbox])

    const image = req.file.filename
    const author_id = req.session.user.id
    
         // Calculate the difference in days
        const days = dayDifference(new Date(start), new Date(end))

         // Determine the duration unit based on the time difference
        const { duration, unit } = chooseDuration(days)

        // Get the selected icons
        const icons = getSelectedIcons(checkboxes)

        const query = `INSERT INTO projects(name, start_date, end_date, description, technologies, image,author_id) VALUES('${name}', '${start}', '${end}', '${description}', ARRAY['${checkboxes.join("','")}'], '${image}', '${author_id}')`
        const obj = await sequelize.query(query, { type: QueryTypes.INSERT})

        res.redirect('/')
}

// Function to render update project view
async function updateProjectView(req, res) {
    const {id} = req.params

    const query = `SELECT * FROM projects WHERE id=${id}`
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT })

    const isLogin = req.session.isLogin
    const user = req.session.user

    res.render('update-project', { data: obj[0], isLogin: isLogin, user: user })
}

// Function to handle project update
async function updateProject(req, res) {
    try {
        const { name, start, end, description, id } = req.body;
        const checkboxes = ['nodeJs', 'nextJs', 'reactJs', 'typeScript'].filter(checkbox => req.body[checkbox]);

        // Calculate the difference in days
        const days = dayDifference(new Date(start), new Date(end));

        // Determine the duration unit based on the time difference
        const { duration, unit } = chooseDuration(days);

        // Get the selected icons
        const icons = getSelectedIcons(checkboxes)

        let image = "";
        if (req.file) {
            image = req.file.filename;
        }

        if (!image) {
            image = await getDefaultImage(id)
        }

        // Check project ownership before displaying the update form
        const projectOwnershipCheckQuery = `SELECT * FROM projects WHERE id=${id} AND author_id=${req.session.user.id}`;
        const projectOwnershipCheck = await sequelize.query(projectOwnershipCheckQuery, { type: QueryTypes.SELECT });

        if (!projectOwnershipCheck.length) {
            // Project is not owned by the currently logged-in user
            req.flash('danger', 'You do not have permission to edit this project.');
            return res.redirect('/');
        }

        // Render the update form if granted permission
        const isLogin = req.session.isLogin;
        const user = req.session.user;

        const updateQuery = `UPDATE projects SET name='${name}', start_date='${start}', end_date='${end}', description='${description}', technologies=ARRAY['${checkboxes.join("','")}'], image='${image}'  WHERE id=${id}`;
        const updateResult = await sequelize.query(updateQuery, { type: QueryTypes.UPDATE });

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to handle project deletion
async function deleteCard(req, res) {
    const { id } = req.params;

    // Ensure the project is owned by the currently logged-in user
    const projectOwnershipCheckQuery = `SELECT * FROM projects WHERE id=${id} AND author_id=${req.session.user.id}`;
    const projectOwnershipCheck = await sequelize.query(projectOwnershipCheckQuery, { type: QueryTypes.SELECT });

    if (!projectOwnershipCheck.length) {
        // Project is not owned by the currently logged-in user
        req.flash('danger', 'You do not have permission to delete this project.');
        return res.redirect('/');
    }

    // Delete the project if granted permission
    const query = `DELETE FROM projects WHERE id=${id}`;
    const obj = await sequelize.query(query, { type: QueryTypes.DELETE });

    req.flash('success', 'Project deleted successfully.');
    res.redirect('/');
}

// Function to render project detail
async function detail(req, res) {
    const { id } = req.params;

    const query = `SELECT projects.id, projects.name, projects.start_date,
    projects.end_date, projects.description, projects.technologies,
    projects.image, users.name AS author, projects."createdAt", projects."updatedAt" FROM projects LEFT JOIN users ON projects.author_id = users.id WHERE projects.id=${id}`
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT })

    console.log('obj:', obj)

    if (obj[0] && obj[0].start_date && obj[0].end_date) {
        // Convert strings to Date objects
        const startDate = new Date(obj[0].start_date);
        const endDate = new Date(obj[0].end_date);

        // Format the date to YYYY-MM-DD
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        const days = dayDifference(startDate, endDate);
        const { duration, unit } = chooseDuration(days);

        const icons = {
            nodeJs: obj[0].technologies.includes('nodeJs') ? "/assets/img/nodejs.png" : '',
            nextJs: obj[0].technologies.includes('nextJs') ? "/assets/img/nextjs.png" : '',
            reactJs: obj[0].technologies.includes('reactJs') ? "/assets/img/react.png" : '',
            typeScript: obj[0].technologies.includes('typeScript') ? "/assets/img/typescirpt.png" : ''
        }

        const isLogin = req.session.isLogin;
        const user = req.session.user;

        res.render('detail', {
            data: {
                ...obj[0],
                start_date: formattedStartDate,
                end_date: formattedEndDate,
                duration,
                unit,
                icons
            },
            isLogin: isLogin,
            user: user
        });
    } else {
        res.status(500).send('Internal Server Error');
    }
}

// Function to render testimonials page
function testimonials(req, res) {
    const isLogin = req.session.isLogin
    const user = req.session.user

    res.render('testimonials', {isLogin: isLogin, user: user})
}

// Function to handle user registration
async function register(req, res) {
    const {name, email, password} = req.body

    console.log('Name', name)
    console.log('Email', email)
    console.log('Password', password)

    const salt = 10

    bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
            console.error("Password failed to be encrypted! ")
            req.flash('danger', 'Register failed : password failed to be encrypted!')
            return res.redirect('/register')
        }
        console.log('Hash result :', hash)
        const query = `INSERT INTO users(name, email, password) VALUES ('${name}', '${email}', '${hash}')`
        await sequelize.query(query, { type: QueryTypes.INSERT })
        req.flash('success', 'Register success!')

        res.render('index')
    })
}

// Function to render registration page
function registerView(req, res) {
    res.render('register')
}

// Function to handle user login
async function login(req, res) {
    const { email, password } = req.body
    const query = `SELECT * FROM users WHERE email='${email}'`
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT })

    if (!obj.length) {
        console.error('user not registered!')
        req.flash('danger', 'Login failed : email is wrong!')
        return res.redirect('login')
    }

    bcrypt.compare(password, obj[0].password, (err, result) => {
        if (err) {
            req.flash('danger', 'Login failed : Internal Server Error!')
            console.error("Login : Internal Server Error!")
            return res.redirect('/login')
        }

        if (!result) {
            console.error('Password is wrong!')
            req.flash('danger', 'Login failed : password is wrong!')
            return res.redirect('/login')
        }

        console.log('Login success!')
        req.flash('success', 'Login success!')
        req.session.isLogin = true
        req.session.user = {
            id: obj[0].id,
            name: obj[0].name,
            email: obj[0].email
        }

        res.redirect('/')
    })
}

// Function to render login page
function loginView(req, res) {
    res.render('login')
}

// Middleware to check user authentication
function checkAuth(req, res, next) {
    if (req.session.isLogin) {
        // If the user is already logged in, proceed to the next route
        next()
    } else {
        // If the user is not logged in, redirect to the login page
        req.flash('danger', 'You must be logged in to access this page.')
        res.redirect('/login')
    }
}

// When the logout button is clicked
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err)
        }
        res.redirect('/')
    })
})

// Start the server
app.listen(port, () => {
    console.log(`Server berjalan pada port ${port}`)
})