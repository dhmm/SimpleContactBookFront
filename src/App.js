import React, { Component } from 'react';
import './App.css';
var unirest = require('unirest');

const API_KEY = 'A0123456789';
const API_PORT = '8000';
const API_URL = 'http://localhost:'+API_PORT+'/';

class Login extends Component {
  
  constructor(props)
  {
    super(props);
    this.state = {
      userName : null,
      password : null
    }

    this.login = () => {  
          unirest.post(
            API_URL + 'login/'
          )
          .headers({            
            'content-type': 'multipart/form-data; boundary=---CBAPP---',
            'api-key' : API_KEY 
          })
          .field('user', this.state.userName)
          .field('password' , this.state.password)          
          .end( (response) => {            
            var responseData = JSON.parse(response.body);
            if(responseData.error === true) {
              alert(responseData.message);
            } else {
              if(responseData.data.token !== undefined) {                  
                  props.setLoginData(responseData.data.userId,this.state.userName,responseData.data.token,true);
              }
            }
          })
    }

    this.setUsername = (evt) => {
      this.setState({
        userName : evt.target.value
      });
    }
    this.setPassword = (evt) => {
      this.setState({
        password : evt.target.value
      });
    }

  }
  

  render() {
    return (      
      <div className="container">
        <div className="row" style={{marginTop: 50}}>
          <div className = "col-md-4"></div>
          <div className = "col-md-4">
            <form>
              <div className="form-group">
                <label htmlFor="userName">Username</label>
                <input type="text" className="form-control" id="userName" value={this.state.userName || ''} onChange={evt => this.setUsername(evt)} placeholder="Enter username"></input>              
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" value={this.state.password || ''} onChange={evt => this.setPassword(evt)} placeholder="Enter password"></input>              
              </div>
              <button type="button" onClick={evt => this.login()} className="btn btn-primary">Login</button>
            </form>
          </div>
          <div className = "col-md-4"></div>
        </div>
      </div>
    );
  }
}
class App extends Component {
  constructor(props)
  {
    super(props);
    this.state = {
      userId : null,
      userName : null,
      accessToken : null,
    }

    this.isLoggedIn = ()=> {
      return this.state.userId != null && this.state.accessToken != null;
    }

    this.setLoginData = (userId,userName,token,loggedIn)=> {
      if(loggedIn) {
        this.setState({
          userId : userId,
          userName : userName,
          accessToken : token,        
        });
      }
    }
  }
  render() {
    if(this.isLoggedIn() === false) {
      return (
        <div className="App">
            <Login setLoginData={this.setLoginData} />
        </div>
      )
    }
    else {
      return (
        <div className="App">
            OK
        </div>
      )
    }
  }
}

export default App;
