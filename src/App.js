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

    this.refreshContacts = ()=> {
      this.setState({
        contacts : []
      });
      this.loadAll();
    }

    this.editContact = (contactId)=> {
      this.props.activateEditContact(contactId);
    }
    this.loadAll();
  }
  render() {      
    var contactItems = this.state.contacts.map( (contact) => 
      <tr>
        <td>{contact.surname}</td>
        <td>{contact.name}</td>
        <td>{contact.phone}</td>
        <td>
          <EditContactButton userId={this.state.userId} token={this.state.token} contactId={contact.contact_id} editContact={this.editContact}/>
          <DeleteContactButton userId={this.state.userId} token={this.state.token} contactId={contact.contact_id} refreshContacts={this.refreshContacts}/>
        </td>
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
              <th>Actions</th>
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
class AddContact extends Component {
  constructor(props) {
    super(props);  
    this.state = {
      userId : props.userId,
      token : props.token,
            
      surname : null,
      name : null,
      phone : null,
    }  
    
    this.setSurname = (evt) => {
      this.setState ({ surname: evt.target.value });
    }
    this.setName = (evt) => {
      this.setState ({ name: evt.target.value });
    }
    this.setPhone = (evt) => {
      this.setState ({ phone: evt.target.value });
    }

    this.createContact = () => {      
      unirest.post(
        API_URL + 'contacts/'
      )        
      .headers({                      
        'api-key' : API_KEY,
        'userid' : this.state.userId,
        'token' : this.state.token
      })     
      .field('surname', this.state.surname)
      .field('name' , this.state.name)                
      .field('phone' , this.state.phone)            
      .end( (response) => {                        
        var responseData = JSON.parse(response.body);               
        if(responseData.error === true) {
          alert(responseData.message);
        } else {
          this.setState({
            surname: null,
            name:null,
            phone:null
          });          
        }
      })
    }

    this.showContacts = () => {
      this.props.showContacts();
    }
  }
  render() {      
    return(
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-4">
        <form>
          <div className="form-group">
            <label htmlFor="surname">Surname :</label>
            <input type="surname" className="form-control" id="surname" onChange={evt => this.setSurname(evt)}></input>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name :</label>
            <input type="name" className="form-control" id="name"  onChange={evt => this.setName(evt)}></input>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone :</label>
            <input type="phone" className="form-control" id="phone"  onChange={evt => this.setPhone(evt)}></input>
          </div>
          <div className="form-group">
            <button type="button" className="btn btn-primary" onClick={evt=> this.createContact()}>Create</button>
            <button style={{marginLeft: "5px"}} type="button" className="btn btn-warning" onClick={evt=> this.showContacts()}>Go back</button>   
          </div>
        </form> 
        </div>
        <div className="col-md-2"></div>
      </div> 
    );
  } 
}
class DeleteContactButton extends Component {
  
  constructor(props) {
    super(props);  
    this.state = {
      userId : props.userId,
      token : props.token,            
      contactId : props.contactId,      
    }  
  
    this.deleteContact = () => {          
      if(window.confirm('Are you sure ')) {     
        unirest.delete(
          API_URL + 'contacts/'+this.state.contactId
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
            this.props.refreshContacts();
          }
        })
      }
    }
  }
  render() {      
    return(
      <div style={{cursor:'pointer'}} className="btn btn-sm btn-danger" onClick={evt=> this.deleteContact()}>Delete</div>      
    );
  } 
}
class EditContactButton extends Component {
  constructor(props) {
    super(props);  
    this.state = {
      userId : props.userId,
      token : props.token,            
      contactId : props.contactId      
    }        
  }
  render() {      
    return(
      <div style={{cursor:'pointer' , marginRight:'5px'}} className="btn btn-sm btn-primary" onClick={evt=> this.props.editContact(this.state.contactId)}>Edit</div>      
    );
  } 
}
class EditContact extends Component {
  constructor(props) {
    super(props);  
    this.state = {
      userId : props.userId,
      token : props.token,
          
      contactId : this.props.contactId,
      surname : null,
      name : null,
      phone : null,
      saved: null
    }      

    this.loadContact = () => {      
      unirest.get(
        API_URL + 'contacts/'+this.state.userId+'/'+this.state.contactId
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
          var contact = responseData.data[0];
          this.setState({
            surname : contact.surname,
            name : contact.name,
            phone : contact.phone
          })                 
        }
      })
    }
    
    this.setSurname = (evt) => {
      this.setState ({ surname: evt.target.value , saved: null});
    }
    this.setName = (evt) => {
      this.setState ({ name: evt.target.value , saved: null});
    }
    this.setPhone = (evt) => {
      this.setState ({ phone: evt.target.value , saved: null});
    }

    this.updateContact = () => {      
      unirest.put(
        API_URL + 'contacts/'+this.state.contactId
      )        
      .headers({                      
        'api-key' : API_KEY,
        'userid' : this.state.userId,
        'token' : this.state.token
      })     
      .field('surname', this.state.surname)
      .field('name' , this.state.name)                
      .field('phone' , this.state.phone)            
      .end( (response) => {                        
        var responseData = JSON.parse(response.body);               
        if(responseData.error === true) {
          alert(responseData.message);
        } else {
          this.setState({
            saved: 'Succesfully saved'
          });                    
        }
      })
    }

    this.showContacts = () => {
      this.props.showContacts();
    }
    this.loadContact();    
  }
  render() {      
    return(
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-4">
        <form>
          <div className="form-group">
            <label htmlFor="surname">Surname :</label>
            <input value={this.state.surname} type="surname" className="form-control" id="surname" onChange={evt => this.setSurname(evt)}></input>
          </div>
          <div className="form-group">
            <label htmlFor="name">Name :</label>
            <input value={this.state.name} type="name" className="form-control" id="name"  onChange={evt => this.setName(evt)}></input>
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone :</label>
            <input value={this.state.phone} type="phone" className="form-control" id="phone"  onChange={evt => this.setPhone(evt)}></input>
          </div>
          <div className="form-group">
          <button type="button" className="btn btn-primary" onClick={evt=> this.updateContact()}>Save</button>          
          <button style={{marginLeft: "5px"}} type="button" className="btn btn-warning" onClick={evt=> this.showContacts()}>Go back</button>          
          </div>
          <div className="form-group">
            <label style={{color: "green"}}>{this.state.saved}</label>          
          </div>          
        </form> 
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
      token : props.token,

      activePage : 'contacts' ,
      contactForEdit : null
    }

    this.activateContacts = () => {
      this.setState({
        activePage : 'contacts' ,
        contactForEdit : null
      });
    }
    this.activateAddContact = () => {
      this.setState({
        activePage : 'add_contact',
        contactForEdit : null
      });
    }
    this.activateEditContact = (contactId) => {      
      this.setState({
        activePage : 'edit_contact',
        contactForEdit : contactId
      });
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

    let page = '';
    switch(this.state.activePage) {
      case 'contacts' :
        page = <Contacts userId={this.state.userId} token={this.state.token} activateEditContact={this.activateEditContact}/> ;
      break;
      case 'add_contact' :
        page = <AddContact userId={this.state.userId} token={this.state.token} showContacts={this.activateContacts}/>;
      break;
      case 'edit_contact' :
        page = <EditContact userId={this.state.userId} token={this.state.token} contactId={this.state.contactForEdit} showContacts={this.activateContacts}/>;
      break;
    }    
     
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
                  <a className="dropdown-item" style={{cursor:'pointer'}} onClick={evt=> this.activateContacts()}  >View contacts</a>
                  <a className="dropdown-item" style={{cursor:'pointer'}} onClick={evt=> this.activateAddContact()} >New contact</a>                  
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
        { page }                
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
