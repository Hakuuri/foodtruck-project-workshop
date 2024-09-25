const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const sql = require('mssql');  


const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

const dbConfig = {
    user: 'sql_username',     
    password: 'sql_password', 
    server: 'server_address', 
    database: 'database_name',
    options: {
      encrypt: true,               
      trustServerCertificate: true 
    }
  };


  // SQL Server
sql.connect(dbConfig).then(() => {
    console.log('Connected to SQL Server');
  }).catch((err) => {
    console.error('Failed to connect to SQL Server', err);
  });

// create/register a user
app.post('/register', async (req, res) => {
    try {
      const { username, email, password, phone, birthDate } = req.body;
      
      // SQL query to insert user data into the database
      const query = `
        INSERT INTO Users (username, email, password, phone, birthDate) 
        VALUES (@username, @email, @password, @phone, @birthDate)
      `;
  
      // Create a new SQL request and execute the query
      const request = new sql.Request();
      request.input('username', sql.VarChar, username);
      request.input('email', sql.VarChar, email);
      request.input('password', sql.VarChar, password);
      request.input('phone', sql.VarChar, phone);
      request.input('birthDate', sql.Date, birthDate);
      
      await request.query(query);
  
      res.send({
        message: `User ${email} successfully registered`
      });
    } catch (error) {
      res.status(500).send({
        message: 'Error during registration',
        error: error.message
      });
    }
  });


// app.post('/register', (req, res) => {
//     res.send({
//         message: `hello ${req.body.email} the user succesfully registered`
//     })
// })

app.listen(process.env.PORT || 8081 )