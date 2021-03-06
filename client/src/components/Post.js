import React, { Component } from 'react';
import UserPic from './UserPic';
import PostHeader from './PostHeader';
import jquery from 'jquery';
let functionsModule = require('./Functions');
let Functions = new functionsModule();

class Post extends Component{
  constructor(props){
    super(props);
    this.state={
      user:{}
    }
  }
  componentWillMount(){
    let uid = (this.props.uid) ? this.props.uid : '';
    console.log('post uid: ',uid);
    Functions.getUser(uid).then((val)=>{
      this.setState({
        user:val[0]
      });
    });
  }
  displayUser(e){
    let target = e.target;
    console.log('displaying! ',e.target);
    let message = (<div id="user-hover-tab">hello!!!!!</div>);
    setTimeout(
      function(){
        target.after(message);
      },1000);
  }
  hideUser(e){
    let target = e.target
    console.log('hiding! ',e.target);
    jquery(e.target).siblings('div').remove();
  }
  render(){
    let user = (this.state.user) ? this.state.user : '';
    // let user = this.state.user;
    console.log('user in post render: ',user);
    let teamcolor = user.affiliation + " user-stripe";
    let userpic = (
        <div>
          <div className={teamcolor}></div>
          <img id={user.userid} className='post-header-pic' src={user.photo} alt='pic' />
        </div>
      );
    let post = (this.props.post) ? this.props.post : '';
    // console.log('Post post: ',post);
    let text = post.text;
    let date = post.date;
    let id = post._id;
    return(
      <div id={id} className="panel panel-default">
        <PostHeader pic={userpic} id={user.userid} user={user} date={date}/>

        <div className="post-text">{text}</div>
        <div className="like-bar">
          <a href="#">
            <span className="fa fa-thumbs-up"></span>
            <span>Like</span>
          </a>
          <a href="#">
            <span className="fa fa-comment"></span>
            <span>Comment</span>
          </a>
          <a href="#">
            <span className="fa fa-share"></span>
            <span>Share</span>
          </a>
        </div>
      </div>
    );
  }
}

export default Post;
