const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'suryaa',
    database: 'loginpage',
});

db.connect((err) => {
    if (err) {
        console.error('Database connection error: ' + err.stack);
        return;
    }

    console.log('Connected to the database');
});

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.use(express.static('public'));

app.post('/register', (req, res) => {
    const { name, email , password ,code} = req.body;
    const query = 'INSERT INTO login (name, email , password ,code ) VALUES (?, ?, ?, ?)';

    db.query(query, [name, email, password, code], (err, result) => {
        if (err) {
            console.error('Database insertion error: ' + err.stack);
            res.send('Registration Failed');
        } else {
            res.write('<h1 >Register Successful</h1>');
            
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    const query = 'SELECT * FROM login WHERE email = ? AND password = ?';

    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Database query error: ' + err.stack);
            return;
        }
        console.log(result);
        if(result.length >0){
            res.write('<h1 >Login Successful</h1>');
            // res.send("Login Successful");
        } else {
            res.send("Login failed");
        }
        
    });
});

app.post('/check', (req, res) => {
    const { email, code } = req.body;
    console.log(req.body);
    const query = 'SELECT * FROM login WHERE email = ? AND code = ?';

    db.query(query, [email, code], (err, result) => {
        if (err) {
            console.error('Database query error: ' + err.stack);
            return;
        }
        
        if(result.length >0){
            res.send(` <link rel="stylesheet" href="/css/styles.css"> <h1>Password Reset</h1>
            <form action="/reset" method="post">
              Confirm your Email: <input type="email" name="email" required><br> <br>
              <input type="submit" value="Reset Password">
            </form>`)
        } else {
            res.send("Login failed");
        }
        
    });
});

app.get('/check', (req, res) => {
    res.sendFile(__dirname + '/public/check.html');
  });
  
  app.post('/reset', (req, res) => {
    const { email } = req.body;
    
    // Check if the email exists in the database
    const query = 'SELECT * FROM login WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Database error: ' + err);
        res.send('Error');
      } else if (results.length === 0) {
        res.send('Email not found in the database');
      } else {
        // Display a new password input form
        res.send(`<link rel="stylesheet" href="/css/styles.css">
          <h2>Enter a new password:</h2>
          <form action="/update" method="post">
            New Password: <input type="password" name="newPassword" required><br>
            <input type="hidden" name="email" value="${email}">
            <input type="submit" value="Update Password">
          </form>
        `);
      }
    });
  });
  
  app.post('/update', (req, res) => {
    const { email, newPassword } = req.body;
  
    // Update the password in the database
    const query = 'UPDATE login SET password = ? WHERE email = ?';
    db.query(query, [newPassword, email], (err, results) => {
      if (err) {
        console.error('Database error: ' + err);
        res.send('Error');
      } else {
        res.write('<h1>Password updated successfully</h1>');
      }
    });
  });
  

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
