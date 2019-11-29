const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const assert = require('assert')


mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost:27017/angulardb')
.then(() => console.log('Mongoose up'))

const User = require('./models/users')
const House = require('./models/houses')

const app = express();

app.use(bodyParser.json());
app.use(session({
  secret: 'hfjlsfhfdsbhfdsbhdsbdshjbfsdjbhjd',
  saveUninitialized: false,
  resave: false
}))

app.get('/api/houses', (req, res) => {
  const houses = [];

  mongoose.connect('mongodb://localhost:27017/angulardb', (err, db) => {
    assert.equal(null, err);
    const cursor = db.collection('houses').find();
    cursor.forEach((doc, err) => {
      assert.equal(null, err);
      houses.push(doc);
    }, () => {
      db.close();res.json(houses);
    });
  });
});

app.post('/api/houses', async (req, res) => {
  // const {name, type, location, school, phone, src, transaction, price, description} = req.body
  const house = new House(req.body)

  // const house = new House({
  //   name,
  //   type,
  //   location,
  //   school,
  //   phone,
  //   src,
  //   transaction,
  //   price,
  //   description,
  //   location
  // })

  const savedHouse = await house.save();
  res.json(savedHouse);
});

app.get('/api/isLoggedin', (req, res) => {
  console.log('isloggedin requested');

  res.json({
    status: !(!req.session['email'])
  });
  console.log(req.session['email'])
});

app.get('/api/logout', (req, res) => {
  console.log('logout requested');

  req.session.destroy();
  res.json({
    success: true
  });
});

app.post('/api/login', async (req, res) => {

  const {email, password} = req.body;

  const resp = await User.findOne({email, password});


  if (!resp) {
    // user login failed
    res.json({
      success: false,
      message: 'Incorrect Details'
    });
  } else {
    //User login success, create a session
    // res.json({
    //   success: true,
    //   message: 'Logged In'
    // });
    req.session['email'] = email;
    req.session.save();
    res.json({
      success: req.session['email']
    });
  }
  console.log('login requested')

  // res.send('k');
})

app.post('/api/register', async (req, res) => {
  // console.log(req.body);
  const {name, email, password} = req.body;

  const existingUser = await User.findOne({ email });
  // console.log(existingUser)

  if (existingUser) {
    res.json({
      success: false,
      message: 'Email already in use'
    })
    return;
  }

  const user = new User({
    name,
    email,
    password
  });

  const resp = await user.save();
  // console.log(resp);
  res.json({
    sucess: true,
    message: 'Welcome'
  });
  console.log('register requested');

  //store in db
  // Usermodel.save({})
});

app.get('/api/data', async (req, res) => {
  req.session['name'] = 'Godstar';
  // req.session.save()
  const user = await User.findOne({email: req.session['email']})


  if (!user) {
    res.json({
      status: false,
      message: 'User was deleted'
    })
    return;
  }

  res.json({
    status: true,
    message: 'works',
    name: req.session['name'],
    email: req.session['email']
  });
  console.log('data requested');

})

app.listen(1234, () => console.log('Server listening at port 1234'));
