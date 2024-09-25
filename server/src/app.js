const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const sql = require('mssql');  
const fs = require('fs');
const path = require('path');


const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());


// SQL 

// const dbConfig = {
//     user: 'sql_username',     
//     password: 'sql_password', 
//     server: 'server_address', 
//     database: 'database_name',
//     options: {
//       encrypt: true,               
//       trustServerCertificate: true 
//     }
//   };


//   // SQL Server
// sql.connect(dbConfig).then(() => {
//     console.log('Connected to SQL Server');
//   }).catch((err) => {
//     console.error('Failed to connect to SQL Server', err);
//   });

// create/register a user
app.post('/register', async (req, res) => {
    try {
      const { username, email, password, phone, birthDate } = req.body;
      
      // SQL query to insert user data into the database
    //   const query = `
    //     INSERT INTO Users (username, email, password, phone, birthDate) 
    //     VALUES (@username, @email, @password, @phone, @birthDate)
    //   `;
  
      // Create a new SQL request and execute the query
      const request = new sql.Request();
      request.input('username', sql.VarChar, username);
      request.input('email', sql.VarChar, email);
      request.input('password', sql.VarChar, password);
      request.input('phone', sql.VarChar, phone);
      request.input('birthDate', sql.Date, birthDate);
      return res.send();   
    //   await request.query(query);
  
    //   res.send({
    //     message: `User ${email} successfully registered`
    //   });
    } catch (error) {
      res.status(500).send({
        message: 'Error during registration',
        error: error.message
      });
    }
  });



  //json 

  const dataFilePath = path.join(__dirname, '../BDD.json');

// Helper function to read data from the JSON file
const readDataFromFile = () => {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    // If file does not exist or cannot be read, return an empty array
    console.error('Error reading JSON file:', err);
    return [];
  }
};

// Helper function to write data to the JSON file
const writeDataToFile = (data) => {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Data successfully written to the file');
  } catch (err) {
    console.error('Error writing to JSON file:', err);
  }
};


// Endpoint to register a new user
app.post('/register', (req, res) => {
  const { username, email, password, phone, birthDate } = req.body;

  if (!username || !email || !password || !phone || !birthDate) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // Read the existing data from the JSON file
  const users = readDataFromFile();

  // Check if the email is already registered
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered.' });
  }

  // Add the new user to the users array
  const newUser = { username, email, password, phone, birthDate };
  users.push(newUser);

  // Write the updated users array back to the JSON file
  writeDataToFile(users);

  // Send a success response
  res.json({ message: 'User successfully registered', user: newUser });
});



// Example Route: Fetch Data from JSON file
app.get('/data', (req, res) => {
  const data = readDataFromFile();
  res.json(data); // Send the JSON data to the client
});




app.listen(process.env.PORT || 8081 )