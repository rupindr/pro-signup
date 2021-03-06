import React, { Component } from 'react';

export default class Dashboard extends Component {

    state = { data: 'loading...' }

    componentDidMount() {
        fetch('http://localhost:5000/main/data', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
        })
            .then(res => res.json())
            .then(response => {
                if (response.redirect) {
                    window.location.href = response.redirect;
                }
                else if(response.data) {
                    this.setState({
                        data: response.data
                    });
                }
            });
    }

    render() {
        return <div>
            {this.state.data}
        </div>
    }
}