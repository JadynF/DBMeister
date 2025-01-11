const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());


//Takes user's submitted login input, finds username (if exists), compares password
//Successful: Redirect to home page, user is assigned Authorization token
//Failure: Returns message of unsuccessful login
app.post('/login', (req, res) => {
    let inUsername = req.body.username;
    let inPassword = req.body.password;
    
    if(inUsername=="user" && inPassword=="pass"){
      return res.send(JSON.stringify({response: "accepted"}));
    } else {
      return res.send(JSON.stringify({response: "denied"}));
    }
    /*
    // send query to see if user/password combo exists
    let realPassword = "";
    try {
      let queryResponse = await sendQuery('SELECT password, Verified FROM User_information WHERE username=?', [inUsername]);
      realPassword = queryResponse[0][0].password;
      userVerified = queryResponse[0][0].Verified;
  
      let passwordsMatched = await bcrypt.compare(inPassword, realPassword);
      if(!passwordsMatched) {
        return res.send(JSON.stringify({response: "Your password is incorrect."}));
      } else if(userVerified == 0) {
        return res.send(JSON.stringify({response: "Your email has not been verified. Please check your email."}));
      } else {
        let responseToken = '';
        let hasToken = userTokenMap.has(body.username);
        if (hasToken && isAuthorized(userTokenMap.get(body.username)[0])) 
          responseToken = userTokenMap.get(body.username)[0];
        else {
          //assign user a token
          responseToken = jwt.sign({username: body.username}, "3f9c8fdeb68c4c9188f1e4c8a7bdb59e");
          const time = new Date();
          userTokenMap.set(body.username, [responseToken, time]);
        }
        return res.send(JSON.stringify({response: "accepted", token: responseToken}));
      }
    }
    catch (error) {
      console.log(error);
      res.status(500).send(JSON.stringify({response: "Error fetching login information. Make sure your username is correct, or create an account."}));
    }
    */
  });

app.listen(8000, () => {
  console.log(`Server listening on 8000`);
});