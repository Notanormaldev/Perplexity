const axios = require('axios');

async function testRegister() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/register', {
      username: 'testuser123',
      email: 'testuser123@example.com',
      password: 'password123'
    });
    console.log('Success:', res.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegister();
