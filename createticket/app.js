// Import modules
const express = require('express')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json());

const port = process.env.PORT || 2000;;

// Get method
app.get('/', (req, res) => res.send('Hello World! for GET'))

// Post method
app.post('/', function(req, res) {
  console.log('Start [POST] method to / ');

  console.log(req.body)
  console.log(`Request from user: ${req.body.conversation.memory['user']}`)

// Response Body
  res.json({
    replies: [
    {
      type: 'text',
      content: `Hello ${req.body.conversation.memory['user']}`
    }
  ],
    conversation: {
      memory: {
        'result': 'OK',
      }
    }
  });
});

// Listen 
app.listen(port, () => console.log(`Example app listening on port ${port}!`))