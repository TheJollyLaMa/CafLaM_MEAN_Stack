//server listen
const app = require("./app");

if (process.env.NODE_ENV !== 'test') {
    app.listen(process.env.PORT || '3000', () => {
        console.log(`Server is running on port: ${process.env.PORT || '3000'}`);
    });
}else{
  app.listen(() => {
      console.log(`Test Server is running on default port: ` + server.address().port);
  });
}
