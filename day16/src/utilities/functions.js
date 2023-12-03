// Import dependencies and configuration
const { Sequelize, QueryTypes } = require('sequelize')
const config = require('../config/config.json')
const sequelize = new Sequelize(config.development)
const bcrypt = require('bcrypt')

// Function to format date
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Function to retrieve the default image for a project
async function getDefaultImage(id) {
    const query = `SELECT projects.id, projects.title, projects.content, projects.image, 
        users.name AS author, projects."createdAt", projects."updatedAt" FROM projects LEFT JOIN users ON
        projects."authorId" = users.id WHERE projects.id=${id}`;
    const obj = await sequelize.query(query, { type: QueryTypes.SELECT });
    return obj[0].image;
}

// Function to get selected icons based on checkboxes
function getSelectedIcons(checkboxes) {
    return {
        nodeJs: checkboxes.includes('nodeJs') ? "/assets/img/nodejs.png" : '',
        nextJs: checkboxes.includes('nextJs') ? "/assets/img/nextjs.png" : '',
        reactJs: checkboxes.includes('reactJs') ? "/assets/img/react.png"  : '',
        typeScript: checkboxes.includes('typeScript') ? "/assets/img/typescirpt.png" : ''
    };
}

// Function to calculate day difference
function dayDifference(start, end) {
    const timeDiff = end.getTime() - start.getTime()
    return Math.floor(timeDiff / (1000 * 60 * 60 * 24))
}

// Function to choose duration unit
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

module.exports = {
    formatDate,
    getDefaultImage,
    getSelectedIcons,
    dayDifference,
    chooseDuration
}
