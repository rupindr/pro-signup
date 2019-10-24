import React, { Component } from 'react';

export default class Register extends Component {

    state = {
        name: '',
        email: '',
        password: '',
        password2: '',
    }

    onChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    onSubmit = () => { return;
        let { name, email, password, password2 } = this.state;
        fetch('http://localhost:5000/auth/register', {

        })
    }

    render(){

        let { name, email, password, password2 } = this.state;

        return <div>
            <div>
                <label htmlFor="name">Name</label>
                <input name="name" id="name" value={name} onChange={this.onChange} type="text"></input>
            </div>
            <div>
                <label htmlFor="email">Email</label>
                <input name="email" id="email" value={email} onChange={this.onChange} type="email"></input>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input name="password" id="password" value={password} onChange={this.onChange} type="password"></input>
            </div>
            <div>
                <label htmlFor="password2">Confirm Password</label>
                <input name="password2" id="password2" value={password2} onChange={this.onChange} type="password"></input>
            </div>
            <div>
                <button onClick={this.onSubmit}>Submit</button>
            </div>
        </div>
    }
}