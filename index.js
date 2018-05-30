const express = require('express')
const bodyParser = require('body-parser')
const AD = require('ad')

const app = express()
const PORT = process.env.PORT || 8080


//LDAP
const ad = new AD({
    url: 'ldap://127.0.0.1',
    user: 'Administrateur@domain.org',
    pass: 'G2jambes'

})

//BODY PARSER
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res, next) => {
    res.send('Bienvenue sur mon api')
})

//-----Organization Units-----//

// get all OU
app.get('/organization-units', (req, res, next) => {
    ad.ou().get().then((ous) => {
        res.send(ous)
    })
})

// add OU
app.post('/organization-units', (req, res, next) => {
    ad.ou().add({
        name: req.body.name
    }).then(() => {
        res.send('OU added with success')
    })
})

//remove OU
app.delete('/organization-units/:name', (req, res, next) => {
    ad.ou(req.params.username).remove()
        .then(() => {
            res.send(`OU ${req.params.name} has been removed with success`)
        })
})

//-----Groups-----//

//get all groups
app.get('/groups', (req, res, next) => {
    ad.group().get().then((groups) => {
        res.send(groups)
    })
})

//add a group
app.post('/groups', (req, res, next) => {
    ad.group().add({
        name: req.body.name
    }).then(() => {
        res.send(`Group added with success`)
    })
})

//delete group
app.delete('/group/:name', (req, res, next) => {
    ad.group(req.params.name).remove()
        .then(() => {
            res.send(`Group ${req.params.name} has been removed with success`)
        })
})

//add User to Group
app.put('/group/:name', (req, res, next) => {
    ad.group(req.params.name).addUser(req.body.userName)
        .then(() => {
            res.send(`User ${req.body.userName} has been added to the group ${req.params.name} with success`)
        })
})

//remove User to Group
app.put('/group/:name', (req, res, next) => {
    ad.group(req.params.name).removeUser(req.body.userName)
        .then(() => {
            res.send(`User ${req.body.userName} has been removed from the group ${req.params.name} with success`)
        })
})

//-----Users-----//

//get all Users
app.get('/users', (req, res, next) => {
    ad.user().get().then((users) => {
        res.send(users)
    })
})

//create an User
app.post('/users', (req, res, next) => {
    if (!req.body.userName || !req.body.pass || !req.body.commonName){
        next(new Error('Some field are missing'))
    }
    ad.user().add({
        userName: req.body.userName,
        commonName: req.body.commonName,
        password: req.body.pass
    }).then(() => {
        res.send('User add with success')
    })
})

//add User in Group
app.put('/users/:username', (req, res, next) => {
    ad.user(req.params.username).addToGroup(req.body.name)
        .then(() => {
            res.send(`User ${req.params.username} has been added to the group ${req.body.name} with success`)
        })
})

//remove User in Group
app.put('/users/:username', (req, res, next) => {
    ad.user(req.params.username).removeFromGroup(req.body.name)
        .then(() => {
            res.send(`User ${req.params.username} has been removed from the group ${req.body.name} with success`)
        })
})

//remove User
add.delete('/users/:username', (req, res, next) => {
    ad.user(req.params.username).remove()
        .then(() => {
            res.send(`User ${req.params.username} has been removed with success`)
        })
})


app.use((err, req, res, next) => {
    console.log('ERR: ' + err)
    res.status(500)
    res.send('Server Error')
})

app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT)
})

