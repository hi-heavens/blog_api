const app = require('./src/app');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const connectionToMongoDB = require('./config/database');

connectionToMongoDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on localhost:${PORT}...`);
});
