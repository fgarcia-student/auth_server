const Conversation = require('../models/conversation');
const User = require('../models/user');
const Promise = require('bluebird');

/*

  Gets friendsList and conversations data for app
  Route: /userData
  Method: GET
  Response Format:
  {
    friends: [Array of friend ids, found in req.user]
    conversations: [Array of conversations, found in conversation collection]
  }

*/
module.exports.getAppData = function(req,res) {
  const user = req.user || null;
  if(!user) return res.status(422).json({error: 'No user available'});

  const friends = req.user.friends;
  getUserConversations(friends,user.id)
  .then((conversations) => {
    resolveAndMapFriendNames(friends)
    .then((mappedFriends) => {
      res.status(200).json({
        conversations: flattenAndUniqueConversations(conversations),
        friendsNames: Object.assign({},...mappedFriends) //'flatten' objects into one
      });
    });
  })
  .catch((error) => {
    res.status(422).send(error);
  })
}


/*HELPERS*/
/*
These functions are not exposed,
and are used to assist exposed functions in handling requests
*/

//getAppData Helper
function getUserConversations(friends,userId) {
  return Promise.resolve(friends).map((friendId) => {
    return queryForConversations(friendId,userId);
  })
}

//getAppData Helper
function queryForConversations(friendId,userId) {
  return new Promise((resolve,reject) => {
    Conversation.find({'participants':{$all: [friendId,userId]}}, function(err,conversation) {
      if(err) reject(new Error(err));
      if(!conversation) reject(new Error('No conversations found'));
      resolve(conversation);
    })
  });
}

//getAppData Helper
function resolveAndMapFriendNames(friends) {
  return Promise.resolve(friends).map((friendId) => {
    return queryForFriendNames(friendId);
  })
}

//getAppData Helper
function queryForFriendNames(friendId) {
  return new Promise((resolve, reject) => {
    User.findOne({_id:friendId}, function(err,friend) {
      if(err) reject(new Error(err));
      if(!friend) reject(new Error('No friend found by given ID'))
      const friendMap = {};
      friendMap[friendId] = friend.name;
      resolve(friendMap);
    })
  });
}

//getAppData Helper
function flattenAndUniqueConversations(conversations) {
  let memo = {};
  let flat = conversations.reduce((a,b) => a.concat(b));
  let uniqueAndFlat = flat.filter((a) => {
    let flag = false;
    if(!memo.hasOwnProperty(a._id)){ //if memo contains key of object
      memo[a._id] = 1; //add to memo
      flag = true; //pass filter
    }
    return flag;
  });
  return uniqueAndFlat;
}
