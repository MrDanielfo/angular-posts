// const http = require('http');
const app = require('./backend/app');
const PORT = process.env.PORT || 3000;
app.set('port', PORT);

// const server = http.createServer(app);
// server.listen(PORT).then(() => console.log(`🚀  Server ready at ${PORT}`));

app.listen(PORT, () => console.log(`Escuchando el puerto: ${PORT}`));


