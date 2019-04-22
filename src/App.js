import React, { Component } from 'react';
import './App.css';
import { Router , Link } from "@reach/router";

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
class Contacts extends Component {
  constructor(props) {
    super(props);  
    this.state = {
      userId : props.userId,
      token : props.token,
      contacts : []
    }   
    this.loadAll = () => {      
        unirest.get(
          API_URL + 'contacts/'+this.state.userId
        )        
        .headers({                      
          'api-key' : API_KEY,
          'userid' : this.state.userId,
          'token' : this.state.token
        })       
        .end( (response) => {                        
          var responseData = JSON.parse(response.body);               
          if(responseData.error === true) {
            alert(responseData.message);
          } else {  
            this.setState({
              contacts : responseData.data.contacts
            })
          }
        })
    }
  }
  render() {
    this.loadAll();    
    var contactItems = this.state.contacts.map( (contact) => 
      <tr>
        <td>{contact.surname}</td>
        <td>{contact.name}</td>
        <td>{contact.phone}</td>
      </tr>
    );
    
    return(
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <table className = "table">
          <thead>
            <tr>
              <th>Surname</th>
              <th>Name</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>            
            {contactItems}
            </tbody>
          </table>
        </div>
        <div className="col-md-2"></div>
      </div> 
    );
  }  
}

class Panel extends Component {
  constructor(props) {
    super(props);  
    this.state = {
      userId : props.userId,
      token : props.token
    }

    this.logout = () => {
        unirest.get(
          API_URL + 'logout/'
        )
        .headers({            
          'content-type': 'multipart/form-data; boundary=---CBAPP---',
          'api-key' : API_KEY,
          'userId' : this.state.userId,
          'token' : this.state.token
        })       
        .end( (response) => {            
          var responseData = JSON.parse(response.body);
          if(responseData.error === true) {
            alert(responseData.message);
          } else {                         
            props.removeLoginData();           
          }
        })
    }
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <label className="navbar-brand">CB</label>
          <button className="navbar-toggler" type="button" data-toggle="collapse" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{cursor:'pointer'}} >
                  Contacts
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" style={{cursor:'pointer'}}  >View contacts</a>
                  <a className="dropdown-item" style={{cursor:'pointer'}}  >New contact</a>                  
                </div>
              </li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{cursor:'pointer'}} >
                  Users
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a className="dropdown-item" style={{cursor:'pointer'}}  >View users</a>
                  <a className="dropdown-item" style={{cursor:'pointer'}}  >New user</a>                  
                </div>
              </li>              
              <li className="nav-item">
                <a className="nav-link" style={{cursor:'pointer'}} onClick={this.logout}>Logout</a>
              </li>
            </ul>
            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </nav>
        <div>          
          <Contacts userId={this.state.userId} token={this.state.token}/>         
        </div>
      </div>
    )
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

        localStorage.setItem('userId' , userId);
        localStorage.setItem('userName' , userName);
        localStorage.setItem('accessToken' , token);
      }
    }

    this.removeLoginData = () => {
      this.setState({
        userId : null,
        userName : null,
        accessToken : null,        
      });
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('accessToken');
    }

    this.logout = () => {        
        this.setState({
          userId : null,
          userName : null,
          accessToken : null,        
        });

        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('accessToken');
    }

    this.loadLocalStorage = () => {
        this.setState({
          userId: localStorage.getItem('userId'),
          userName : localStorage.getItem('userName'),
          accessToken : localStorage.getItem('accessToken')
        });
    }
  }

  componentWillMount(nextProps, nextState) {
    this.loadLocalStorage();
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
            <Panel userId={this.state.userId} token={this.state.accessToken} removeLoginData={this.removeLoginData} logout={this.logout}/>
        </div>
      )
    }
  }
}

export default App;
