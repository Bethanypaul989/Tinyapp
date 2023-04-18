const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const PORT = 8080; // default port 8080
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

//  generating random string
const generateRandomString = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let counter = 0;
  while (counter < 6) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
}

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// route for urls
app.get('/urls', (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  
  };
  res.render("urls_index", templateVars);
});

// 3rd route for url & new
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  }
  res.render("urls_new", templateVars);
});

// second route for url/id
app.get('/urls/:id', (req, res) => {
  const templateVars = {
   username: req.cookies["username"],
    id: req.params.id, 
   longURL : urlDatabase[req.params.id]
  };
  res.render("urls_show", templateVars);
});

app.post('/urls/:id',(req, res) => {
   urlDatabase[req.params.id] = req.body.url;

  res.redirect('/urls');
})

// post for URL submission
app.post("/urls", (req, res) => {
  const uniqueID = generateRandomString();
 urlDatabase[uniqueID] = req.body.longURL;

res.redirect(`/urls/${uniqueID}`);
});

// redirect location of short url submission
app.get('/u/:id', (req, res) => {
const longURL = urlDatabase[req.params.id];

res.redirect(longURL);
});
app.post('/urls/:id/delete',(req, res) => {
  delete urlDatabase[req.params.id];

  res.redirect('/urls');
});

// login
app.post('/login', (req, res)  => {
const username = req.body.username; 

res.cookie("username", username)
res.redirect('/urls')
})

app.post('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect('/urls')

})
// passwords check validity
 /* if (password === req.body.password){
    res.cookie('username', username); // storing username after passwords validity
    res.send('YAY! You have successfully logged in.:) '); // response after
  }
  else{
    res.send('Incorrect.. Failed!!!');  // if password checks fail
  }
*/

app.listen(PORT, () => {
  console.log(`tinyapp listening on port ${PORT}!`);
});