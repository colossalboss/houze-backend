const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost:27017/angulardb')
.then(() => console.log('Mongoose up'))

const User = require('./models/users')

const app = express();
app.use(bodyParser.json());

app.post('/api/login', async (req, res) => {

  const {email, password} = req.body;
  console.log(email, password);

  console.log(User)
  const resp = await User.findOne({email, password});
  console.log(resp);


  if (!resp) {
    console.log('incorrect details');
    //user login failed
  } else {
    console.log('logging you in');
    //User login success, create a session
  }
  res.send('k');
})

app.get('/api/register', (req, res) => {
  console.log('requested');
  res.send('Hi')
});

app.post('/api/register', async (req, res) => {
  console.log(req.body);
  const {name, email, password} = req.body;

  const user = new User({
    name,
    email,
    password
  });

  const resp = await user.save();
  console.log(resp);
  res.send(resp)

  //store in db
  // Usermodel.save({})
});

app.listen(1234, () => console.log('Server listening at port 1234'));
