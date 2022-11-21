const app = require('../app');
const mongoose = require('mongoose');

const DB = process.env.DATABASE;
mongoose.connect(DB, {
    UseNewUrlParser: true
}).then( ()=> {
    console.log('DB is Connected Successfully....');
})

app.listen(process.env.PORT, () => {
    console.log(`App is running on PORT ${process.env.PORT}....`);
})