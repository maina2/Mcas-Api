import sql from 'mssql';
import config from '../db/config.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!' });
    }
};

export const signup = async (req, res) => {
    const {username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
      const pool = await sql.connect(config.sql);
      const result = await pool
        .request()
        .input('username', sql.VarChar, username)
        .query(
          'SELECT * FROM users WHERE username = @username'
        );
  
      const user = result.recordset[0];
      if (user) {
        res.status(409).json({ message: 'User already exists' });
      } else {
        await pool
          .request()
          .input('username', sql.VarChar, username)
          .input('hashedPassword', sql.VarChar, hashedPassword)
          .query(
            'INSERT INTO users (  username,  password) VALUES ( @username,  @hashedPassword)'
          );
  
        res.status(200).send({ message: 'User created successfully' });
      }
    } catch (error) {
      console.error('Error creating user:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while creating the user' });
    } finally {
      sql.close();
    }
  };




  // export const login = async (req, res) => {
  //   try {
  //     // Use username and password from the request body
  //     const { username, password } = req.body;
  //     console.log(username, password);
  
  //     let pool = await sql.connect(config.sql);
  //     // Use username as the input parameter and query condition
  //     const result = await pool.request()
  //       .input('username', sql.VarChar, username)
  //       .query('SELECT * FROM Users WHERE username = @username');
  
  //     const user = result.recordset[0];
  //     console.log(user);
  
  //     if (!user) {
  //       return res.status(401).json({ error: 'Invalid credentials' });
  //     } else {
  //       const passwordMatch = await bcrypt.compare(password, user.password);
  //       console.log(passwordMatch);
  //       if (!passwordMatch) {
  //         return res.status(401).json({ error: 'Authentication failed, wrong password' });
  //       }
  //     }
  
  //     console.log(config.jwt_secret);
  
  //     // Remove or rename the duplicate username property
  //     const token = jwt.sign(
  //       { id: user.id, username: user.username },
  //       config.jwt_secret,
  //       { expiresIn: '1hr' }
  //     );
  
  //     const { id, username } = user;
  //     // Remove the email property from the response data
  //     res.json({ id, username, token });
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //     res.status(500).json(error.message);
  //   } finally {
  //     sql.close();
  //   }
  // };