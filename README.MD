# LOGIN APP
 This is a login app from where you can login using your facebook, twitter or create an account locally .

 ## Resources Used 

 ### passportJS

 Passport is authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application. A comprehensive set of strategies support authentication using a username and password, Facebook, Twitter, and  more. Go to [Passport](http://www.passportjs.org/)



 ## Some quick setup 

 1. clone the rpo using git clone git@github.com:anish-yadav/loginApp.git

 2. install node modules using npm i

 3. create a confg.json file right beside the config.js file .. like this 

  ```json 
  
        {
            "test":{
            "PORT": 3000,
            "MONGODB_URI":"mongodb://localhost:27017/loginapp",
            "secret":"Phenomenal",
            "FACEBOOK_CALLBACK_URL":"http://localhost:3000/users/facebook/callback",
            "FACEBOOK_APP_ID":FACEBOOK_APP_ID,
            "FACEBOOK_APP_SECRET":"FACEBOOK_APP_SECRET",
            "TWITTER_CALLBACK_URL":"http://127.0.0.1:3000/users/twitter/callback",
            "TWITTER_CONSUMER_KEY": "TWITTER_CONSUMER_KEY"  ,
            "TWITTER_CONSUMER_SECRET":"TWITTER_CONSUMER_SECRET",
            "GOOGLE_CONSUMER_KEY": "GOOGLE_CONSUMER_KEY" ,
            "GOOGLE_CONSUMER_SECRET":"GOOGLE_CONSUMER_SECRET"
            },
            "development":{
            "PORT": 3000,
            "MONGODB_URI":"mongodb://localhost:27017/loginapp",
            "secret":"Phenomenal",
            "FACEBOOK_CALLBACK_URL":"http://localhost:3000/users/facebook/callback",
            "FACEBOOK_APP_ID":FACEBOOK_APP_ID,
            "FACEBOOK_APP_SECRET":"FACEBOOK_APP_SECRET",
            "TWITTER_CALLBACK_URL":"http://127.0.0.1:3000/users/twitter/callback",
            "TWITTER_CONSUMER_KEY": "TWITTER_CONSUMER_KEY" ,
            "TWITTER_CONSUMER_SECRET":"zTyHW3oy3GR43XKvD6e6BooCTP4zNoW4bHXokVBwmhnVTyHFSn",
            "GOOGLE_CONSUMER_KEY": "GOOGLE_CONSUMER_KEY" ,
            "GOOGLE_CONSUMER_SECRET":"GOOGLE_CONSUMER_SECRET"
            }
        }
 ```


 Then run using npm start .......



