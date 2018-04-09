
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    request = require('request'),
    //mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken');
    
var User = require('./app/models/userModel.js'),
    mongoose = require('mongoose'),
    nev = require('email-verification')(mongoose);
//mongoose.connect('mongodb://localhost/YOUR_DB');


var mongoURL =  'mongodb://lab05:lab05password@ds115866.mlab.com:15866/lab05';   
    
//var mongoose   = require('mongoose');
mongoose.connect(mongoURL, { useMongoClient: true });

//using Native Promise (Available in ES6)
mongoose.Promise = global.Promise;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Start server on port 8081
// It is important to start Node on a different port
var port = 8081;

var router = express.Router();

var ImageCollection = require('./app/models/image-collection.js');
var Policy = require('./app/models/policyModel.js');

// sync version of hashing function
var myHasher = function(password, tempUserData, insertTempUser, callback) {
    
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    return insertTempUser(hash, tempUserData, callback);
};

// async version of hashing function
myHasher = function(password, tempUserData, insertTempUser, callback) {
    
    bcrypt.genSalt(8, function(err, salt) {
        if(err)
            console.log(err);
        bcrypt.hash(password, salt, function(err, hash) {
            if(err)
                console.log( err);
            return insertTempUser(hash, tempUserData, callback);
        });
    });
};

var generateToken = function(user_id, user_email){
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);
    
    return jwt.sign({
        _id: user_id,
        email: user_email,
        exp: parseInt(expiry.getTime() / 1000, 10),
      }, "MY_SECRET");
};

var getUser = function(token, callback){
    User.find( {token:token}, function(err, user){
        if(err)
            return err;
        
        callback(user[0]);    
    });
};

nev.configure({
    verificationURL: 'http://localhost:8080/email-verification/${URL}',
    persistentUserModel: User,
    expirationTime: 600, // 10 minutes
    //tempUserCollection: 'myawesomewebsite_tempusers',
    transportOptions: {
        service: 'Gmail',
        auth: {
            user: 'ivan.zvonkov2@gmail.com',
            pass: 'ivanzvonkov2'
        }
    },
    verifyMailOptions: {
        from: 'Do Not Reply <ivan.zvonkov2@gmail.com>',
        subject: 'Please confirm account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    },
    hashingFunction: myHasher,
    passwordFieldName: 'pw',
    
}, function(err, options){
    if (err) {
        console.log(err);
        return;
    }

    console.log('configured: ' + (typeof options === 'object'));
});

nev.generateTempUserModel(User, function(err, tempUserModel) {
    if (err) {
        console.log("here's the error"+err);
        return;
    }

    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});

//middleware thingy
router.use(function(req, res, next) {
    
    console.log(req.originalUrl);
    next();
});

//test get 
router.get('/', function(req, res) {
    res.json({ message: 'Hello World' });
});

//register router post
router.post('/register', function(req, res) {
    var email = req.body.email;

    console.log("in register");
    console.log(req.body.email);
    console.log(req.body.type);
    // register button was clicked
    if (req.body.type === 'register') {
        
        var pw = req.body.pw;
        var newUser = new User({
            email: email,
            pw: pw
        });

        nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
            if (err) {
                return res.status(404).send('ERROR: creating temp user FAILED');
            }

            // user already exists in persistent collection
            if (existingPersistentUser) {
                return res.json({
                    msg: 'You have already signed up and confirmed your account. Did you forget your password?'
                });
            }

            // new user created
            if (newTempUser) {
                var URL = newTempUser[nev.options.URLFieldName];
                
                nev.sendVerificationEmail(email, URL, function(err, info) {
                    if (err) {
                        return res.status(404).send('ERROR: sending verification email FAILED');
                    }
                    res.json({
                        msg: 'An email has been sent to you. Please check it to verify your account.',
                        info: info
                    });
                });

                // user already exists in temporary collection!
            } else {
                res.json({
                    msg: 'You have already signed up. Please check your email to verify your account.'
                });
            }
        });

        // resend verification button was clicked
    } else {
        nev.resendVerificationEmail(email, function(err, userFound) {
            if (err) {
                return res.status(404).send('ERROR: resending verification email FAILED');
            }
            if (userFound) {
                res.json({
                    msg: 'An email has been sent to you, yet again. Please check it to verify your account.'
                });
            } else {
                res.json({
                    msg: 'Your verification code has expired. Please sign up again.'
                });
            }
        });
    }
});

//get user email
router.get('/user-email/:token', function(req, res){
    //console.log('email token');
    User.find( {token: req.params.token}, function(err, user){
        //console.log('im in');
        if(err)
            return res.json(err);
        //console.log('in get email: '+ user[0].email);
        res.json({email: user[0].email});   
    });        
});

// user accesses the link that is sent
router.get('/email-verification/:URL', function(req, res) {
    var url = req.params.URL;
    nev.confirmTempUser(url, function(err, user) {
        if (user) {
            nev.sendConfirmationEmail(user.email, function(err, info) {
                if (err) {
                    return res.status(404).send('ERROR: sending confirmation email FAILED');
                }
                res.json({
                    msg: 'CONFIRMED!',
                    info: info
                });
            });
        } else {
            return res.status(404).send('ERROR: confirming temp user FAILED');
        }
    });
});

//reset verification
router.put('/resend-verification', function(req, res){
    var email = req.body.email;
    nev.resendVerificationEmail(email, function(err, result){
        if(err)
            return res.json(err);
        
        res.json(result);    
    });
});

//login and generate token if necessary
router.post('/login', function(req, res){
    
    var userEmail = req.body.email;
    var password = req.body.pw;
    
    User.find( {email: userEmail}, function(err, user){
        //console.log(user);
        if(user.length == 0)
            res.json({email: userEmail, emailExists: false, loggedIn: false});
        
        if(user.length > 0){
            
            bcrypt.compare(password, user[0].pw, function(err, result) {
                //wrong pass word
                if(result == false){
                    res.json({email: userEmail, emailExists: true, loggedIn: false});
                
                //password is right generate token    
                }else{
                    
                    User.findById(user[0]._id, function(err, loggedInUser){
                       //check if user already has token
                       if(loggedInUser.token == undefined){
                            loggedInUser.token = generateToken(loggedInUser._id, loggedInUser.email);
                            loggedInUser.save(function(err){
                                if(err)
                                    return res.json(err);
                                res.json({email: userEmail, emailExists: true, loggedIn: true, token: loggedInUser.token});    
                            });
                       }else{    
                           res.json({email: userEmail, emailExists: true, loggedIn: true, token: loggedInUser.token});
                       }
                       
                    });
                }    
            });
            
            
            
        }    
            
    });   
    
});

//get and post image collection
router.route('/image-collection')

    // create a image collection 
    .post(function(req, res) {
        
        console.log(req.body);
        
        var imageCollection = new ImageCollection();      // create a new instance of the Image Collection model
        imageCollection.title = req.body.title;  // set the image collection name (comes from the request)
        imageCollection.collectionDescription = req.body.collectionDescription;
        imageCollection.privacy = req.body.privacy;
        
        getUser(req.body.token, function(user){
            
            imageCollection.owner = user.email;
            
            imageCollection.save(function(err) {
            if (err)
                return res.send(err);
            
            
            res.json({ message: 'Image Collection created' , body: req.body});
        });
            
        });
        
        // save the bear and check for errors
        /*imageCollection.save(function(err) {
            if (err)
                return res.send(err);

            res.json({ message: 'Image Collection created' , body: req.body, test: 'test' });
        });*/

    })
    
    // get all image collections
    .get(function(req, res) {
        ImageCollection.find( {privacy: "public"}, function(err, imageCollections) {
            if (err)
                return res.send(err);

            res.json(imageCollections);
        });
    });

router.route('/image-collection/:token')
    .get(function(req, res){
       
        getUser(req.params.token, function(user){
            
            ImageCollection.find( { $or: [ { privacy: "public" }, { owner: user.email } ] }, function(err, imageCollections) {
                if (err)
                    return res.send(err);
    
                res.json(imageCollections);
            });
            
        });
        
    });
    

router.route('/image-collection/:imageCollection_id')

    // get specific image collection
    .get(function(req, res) {
        ImageCollection.findById(req.params.imageCollection_id, function(err, imageCollection) {
            if (err)
                return res.send(err);
            res.json(imageCollection);
        });
    })
    
    //post specific image to specific image collection
    .put(function(req, res) {

        // use our bear model to find the bear we want
        ImageCollection.findById(req.params.imageCollection_id, function(err, imageCollection) {

            if (err)
                return res.send(err);

            imageCollection.title = req.body.title;  // update the image collection name 
            imageCollection.collectionDescription = req.body.collectionDescription;
            imageCollection.privacy = req.body.privacy;

            // save the bear
            imageCollection.save(function(err) {
                if (err)
                    return res.send(err);

                res.json({ message: 'Image collection updated!' });
            });

        });
    })
    
    //delete collection
    .delete(function(req, res) {
        ImageCollection.remove({
            _id: req.params.imageCollection_id
        }, function(err, bear) {
            if (err)
                return res.send(err);

            res.json({ message: 'Image collection successfully deleted' });
        });
    });

//update rating on collection
router.route('/image-collection/rate/:imageCollection_id/:rating/:token')
    .put(function(req, res){
        getUser(req.params.token, function(user){
            ImageCollection.findById(req.params.imageCollection_id, function(err, imageCollection) {
                if(user.email == imageCollection.owner)
                    res.json({message:"Can't rate own collection"});
                else{    
                    imageCollection.rating = req.params.rating;
                    
                    imageCollection.save(function(err) {
                        if (err)
                            return res.send(err);
        
                        res.json({ message: 'Rating updated!' });
                    });
                }
            });
        });
    });

//add or delete image to collection 
router.route('/image-collection/:imageCollection_id/:nasa_id') 
    
    .put(function(req, res) {
        // use our bear model to find the bear we want
        ImageCollection.findById(req.params.imageCollection_id, function(err, imageCollection) {

            if (err)
                return res.send(err);

            var url = 'https://images-api.nasa.gov/asset/'+req.params.nasa_id;
    
            //request and add image to array
            request({
                url: url,
                json: true
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    
                    imageCollection.images.push(body);
                    
                    
                    imageCollection.save(function(err) {
                        if (err)
                            return res.send(err);
        
                        res.json({ message: 'Image added!' });
                    });
                    
                }
            });
    
        });
    })
    
    .delete(function(req, res){
        ImageCollection.findById(req.params.imageCollection_id, function(err, imageCollection) {

            if (err)
                return res.send(err);
                
            var imageToRemove = "";
            
            //nasa id is the json link here
            imageCollection.images.forEach(function(image, i){
                if(image.collection.href == 'https://images-api.nasa.gov/asset/'+req.params.nasa_id)
                    imageToRemove = i;
            });
            
            console.log("removing: "+imageToRemove);
            
            imageCollection.images.splice(imageToRemove,1);
                
            imageCollection.save(function(err) {
                if (err)
                    return res.send(err);

                res.json({ message: 'Image removed!' });
            });
        });
    });
    
//update, post or get policies on website
router.route('/policy/:type')

    .post(function(req, res){
        var policy = new Policy();      // create a new instance of the Image Collection model
        policy.name = req.body.name;  // set the image collection name (comes from the request)
        policy.text = req.body.text;
        
        policy.save(function(err) {
            if (err)
                return res.json(err);
            
            res.json({ message: 'Policy created'});
            
        });
    })    
    
    .put(function(req, res){
        Policy.find( { name: req.params.type }, function(err, policy) {
            if (err)
                return res.send(err);
    
            policy[0].text = req.body.text;
            
            policy[0].save(function(err) {
                if (err)
                    return res.json(err);
                
                res.json({ message: 'Policy updated'});
            
            });
            
            
        });    
    })
    
    .get(function(req, res){
        Policy.find( { name: req.params.type }, function(err, policy) {
            if (err)
                return res.send(err);

            res.json(policy[0]);
        });    
    });
 
    
//nasa search image
router.get('/nasa/search/:searchTerm', function(req, res){
    
    
    var url = 'https://images-api.nasa.gov/search?q='+req.params.searchTerm;
    
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        }
    });
   
});

//get image json
router.get('/nasa/image/:nasa_id', function(req, res){
    
    var url = 'https://images-api.nasa.gov/asset/'+req.params.nasa_id;
    
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            res.json(body);
        }
    });
   
});



app.use('/api', router);


app.listen(port);
console.log('Server is running on port ' + port);