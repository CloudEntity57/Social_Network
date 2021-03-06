import jquery from 'jquery';
const authid = process.env.REACT_APP_AUTH0_CLIENT_ID;
const authdomain = process.env.REACT_APP_AUTH0_DOMAIN;
const auth = new AuthService(authid, authdomain);
import AuthService from '../utils/AuthService';
import { hashHistory } from 'react-router';
let targetURL = "http://localhost:3001/user/";

function myFunctions(){
  this.getCurrentUser = ()=>{
    let profile = auth.getProfile();
    return profile;
  }
  this.getCurrentUserId = ()=>{
    let profile = auth.getProfile();
    let userid = profile.clientID;
    return userid;
  }
  //this function currently does not work because it sets a state:
  this.filterUser = ()=>{
    console.log('app js auth: ',auth);
    const profile = auth.getProfile();
    setTimeout(()=>{
      console.log('app js profile: ',profile);
      this.setState({
        profile:profile,
        test:'hello there'
      });
    },500);
    jquery.ajax({
      url:targetURL+profile.clientID,
      type:'GET',
      success:(val)=>{
        console.log('user in database: ',val);
        if(val.length===0){
          console.log('val empty! Not on file.');
          let post = jquery.ajax({
            url:targetURL,
            data:{
              first_name:profile.given_name,
              last_name:profile.family_name,
              photo:profile.picture,
              userid:profile.clientID
            },
            type:'POST'
          });
          hashHistory.push('/account');
        }
      }
    });
  }
  this.getUser = (clientID)=>{
    return jquery.ajax({
      url:targetURL+clientID,
      type:'GET',
      success:(val)=>{
        console.log('getUser says: user in database: ',val);
        return val;
      }
    });
  }

  this.sendAllyRequest = (friendId,callback) => {
    let userId = this.getCurrentUserId();
    targetURL = "http://localhost:3001/ally/request/"+friendId;
    jquery.ajax({
      url:targetURL,
      type:'POST',
      data:{
        ally_request:friendId,
        user:userId
      },
      success:(val)=>{
        console.log('success!');
        this.logAllyRequest(friendId,userId);
        callback();
      }
    });
  }
  this.logAllyRequest = (friendId,userId)=>{
    targetURL = "http://localhost:3001/ally/logrequest/"+friendId;
    console.log('we have: ',userId);
    jquery.ajax({
      url:targetURL,
      type:'POST',
      data:{
        user:userId
      },
      success:(val)=>{
        console.log('log success!');
      }
    });
  }
  this.createDate = ()=>{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    }

    if(mm<10) {
        mm='0'+mm
    }

    today = mm+'/'+dd+'/'+yyyy;
    // console.log('date: ',today);
    return today;
  }
  //this function doesn't work - 'this' keyword undefined
  this.allyCheck = (allyid,userid,callback)=>{
    this.getUser(userid,targetURL).then((val)=>{
      let friends = val[0].allies;
      let isFriend = false;
      console.log('current friends: ',friends);
      for(let i=0; i<friends.length; i++){
        if(friends[i]==allyid){
          isFriend = true;
          callback(isFriend);
        }
      }

    });

  }
}
module.exports = myFunctions;
