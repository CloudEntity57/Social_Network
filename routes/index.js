var express = require('express');
var router = express.Router();
var Test = require('../models/test');
var User = require('../models/user');
var Post = require('../models/post');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/test', function(req, res, next) {
  Test.find({},'', function(err,testItem){
    if (testItem) {console.log('hey baby an error');}
    console.log('NYAAAAAAHHHHHHH!!!!! ',testItem);
    res.json(testItem);
  });

});

router.get('/user',function(req,res,next){
  // let profile=req;
  User.find({},'', function(err,profile){
    // console.log('profile: ',profile);
    res.json(profile);
  });

  // User.find({req.},''
});
router.get('/user/:userid',function(req,res,next){
  let userid=req.params.userid;
  // console.log('userid: ',userid);
  User.find({userid:userid},'', function(err,profile){
    if(err)console.log('error: ',err);
    console.log('current user profile: ',profile);
    res.json(profile);
  });
  // User.find({req.},''
});
router.post('/user',function(req,res,next){
  let user = req.body;
  let newPost = new User(user);
  newPost.save(function(err,success){
    if(err) console.log('error: ',err);
  });
  console.log('data you sent DB: ',user);
});
router.post('/user/:userid',function(req,res,next){
  let user = req.body;
  console.log('information: ',user);
  User.findOneAndUpdate(
    {
      userid:req.params.userid
    },
    {
      username:user.username,
      affiliation:user.affiliation,
      education:user.education,
      location:user.location,
      work:user.work,
      user_story:user.user_story
    },
    function(err,user){
      if(err){
        console.log('error: ',err);
      }
      console.log('success!',user);
      res.json(user);
    }
  );

});

router.post('/post',function(req,res,next){
  let post = req.body;
  console.log('post: ',post);
  let newPost = new Post(post);
  newPost.save(function(err,success){
    if(err) console.log('error: ',err);
    let posts=Post.find({},'',function(err,posts){
      if(err) console.log('error: ',err);
      res.json(posts);
    });
  });
});

router.get('/posts',function(req,res,next){
  let posts = Post.find({},'',function(err,profile){
    if(err) console.log('error: ',err);
    res.json(profile);
  });
});
router.post('/ally/request/:id',function(req,res,next){
  let target_ally=req.body.ally_request;
  let userId = req.body.user;
  let results;
  console.log('userid: ',userId);
  console.log('target_ally: ',target_ally);
//record my id on the other person's invitations received list:
 User.findOneAndUpdate(
    {"userid":target_ally},{"$push":{ally_invitations_received:userId}},
    { "new": true, "upsert": true },(err,friend)=>{
      if(err) {console.log('error! ',err);}
      console.log('userid requesting: ',userId);
      // friend.ally_invitations_received.push({invitation:userId});
      console.log('ally invitations: ',friend.ally_invitations_received);
    });
//record their id on my own requests sent list:
User.findOneAndUpdate(
   {"userid":userId},{"$push":{ally_requests_sent:target_ally}},
   { "new": true, "upsert": true },(err,friend)=>{
     if(err) {console.log('error! ',err);}
     console.log('ally requests sent: ',friend.ally_requests_sent);
   });
  // res.send('success');
  res.json(results);
});

//=================================Route for accepting an alliance invitation:
router.post('/acceptally',function(req,res,next){
  let newAlly = req.body.allyid;
  let userId = req.body.userid;
  let result;
  console.log('new ally: ',newAlly);
  console.log('current user: ',userId);
//remove your id from your new ally's sent invitations list:
  User.find({"userid":newAlly},'ally_requests_sent',(err,val)=>{
    if(err){
      console.log('error! ',err);
    }
    console.log("new friend's ally requests: ",val[0].ally_requests_sent);
    let requests = val[0].ally_requests_sent;
    //go through ally's requests and remove yours:
    for(var i=0; i<requests.length; i++){
      console.log('requests[i]: ',requests[i]);
      if(requests[i] === userId){
        requests.splice(i,1);
        console.log('after removal: ',requests);
        //update the request list in the database:
        User.findOneAndUpdate({"userid":newAlly},{"ally_requests_sent":requests},function(err,ally){
             if(err) {console.log('error! ',err);}
             console.log('updated ally requests sent: ',ally.ally_requests_sent);
           });
        //add your id to your ally's friends list:
        User.findOneAndUpdate({"userid":newAlly},{"$push":{"allies":userId}},{"new": true, "upsert": true },function(err,ally){
            if(err) {console.log('error! ',err);}
          });
      }
    }
  });
//remove ally's id from your received invitations list:
User.find({"userid":userId},'ally_invitations_received',(err,val)=>{
  if(err){
    console.log('error! ',err);
  }
  console.log("my ally invitations received: ",val[0].ally_invitations_received);
  let invitations = val[0].ally_invitations_received;
  //go through your invitations and remove ally's id:
  for(var i=0; i<invitations.length; i++){
    console.log('invitations[i]: ',invitations[i]);
    if(invitations[i] === newAlly){
      invitations.splice(i,1);
      console.log('after removal: ',invitations);
      result = invitations;
      //update the invitations list in your database:
      User.findOneAndUpdate({"userid":userId},{"ally_invitations_received":invitations},function(err,user){
           if(err) {console.log('error! ',err);}
           console.log('updated ally invitations received: ',user.ally_invitations_received);
         });
      //add ally's id to your friends list:
      User.findOneAndUpdate({"userid":userId},{"$push":{"allies":newAlly}},{"new": true, "upsert": true },function(err,user){
          if(err) {console.log('error! ',err);}
        });
    }
  }
});
  res.json(result);
});

module.exports = router;
