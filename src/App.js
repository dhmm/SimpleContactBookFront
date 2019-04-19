import React, { Component } from 'react';
import './App.css';

class Login extends Component {
  render() {
    return (      
      <div className="container">
        <div className="row" style={{marginTop: 50}}>
          <div className = "col-md-4"></div>
          <div className = "col-md-4">
            <form>
              <div className="form-group">
                <label for="userName">Username</label>
                <input type="text" class="form-control" id="userName" placeholder="Enter username"></input>              
              </div>
              <div className="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Enter password"></input>              
              </div>
              <button type="submit" class="btn btn-primary">Login</button>
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
      accessToken : null,
    }

    this.isLoggedIn = ()=> {
      return this.state.userId != null && this.state.accessToken != null;
    }
  }
  render() {
    if(this.isLoggedIn() === false) {
      return (
        <div className="App">
            <Login/>
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
