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

    onSubmit = () => {
        const getUrlWithParams = (params) => {
            let query = [];
            let keys = Object.keys(params);
            for (let i = 0; i < keys.length; i++) {
              if (params[keys[i]]) {
                query.push((encodeURIComponent(keys[i]) + '=' + encodeURIComponent(params[keys[i]])));
              }
            }
            query = query.join('&');
            return query;
          }
        let { name, email, password, password2 } = this.state;
        fetch('/auth/register', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            body: getUrlWithParams({
                name, email, password, password2
            })
        })
            .then(res => res.json())
            .then(response => {
                if(response.redirect){
                    window.location.href = response.redirect;
                }
                else{
                    console.log(response.errors);
                }
            });
    }

    render() {

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