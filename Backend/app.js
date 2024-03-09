const express = require('express')
const mongoose = require('mongoose')
const userauthRoutes = require('./routes/userauthRoutes')
const creatorauthRoutes = require('./routes/creatorauthRoutes')
const cookieParser = require('cookie-parser')


const app = express();


app.use(express.json())
app.use(cookieParser())

app.set('view engine', 'ejs')

const port = 5001;

mongoose.connect('mongodb+srv://Thala:thala@cluster0.jxyqri1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
  const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying another port...`);
      server.close(() => {
        console.log(`Starting server on port ${port}`);
        server.listen(port);
      });
    } else {
      console.error(err);
    }
  });
})
.catch((err) => console.log(err))

const creatorViewsRoutes = require('./routes/creatorViewsRoutes');



app.use(creatorViewsRoutes);

app.use(userauthRoutes);
app.use(creatorauthRoutes);