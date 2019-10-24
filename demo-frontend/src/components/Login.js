import React, { Component } from 'react';

export default class Login extends Component {
    state = {
        email: '',
        password: '',
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmit = () => {
        console.log(this.state);
    }

    render(){

        let { email, password } = this.state;

        return <div>
            <div>
                <label htmlFor="email">Email</label>
                <input name="email" id="email" value={email} onChange={this.onChange} type="email"></input>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input name="password" id="password" value={password} onChange={this.onChange} type="password"></input>
            </div>
            <div>
                <button onClick={this.onSubmit}>Submit</button>
            </div>
        </div>
    }
}