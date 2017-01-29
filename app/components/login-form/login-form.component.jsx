import React, { Component, PropTypes } from 'react';
import style from './login-form.component.scss';

export default class LoginForm extends Component {
  state = { username: '' }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  createNew = (event) => {
    this.props.createNew(this.state.username);

    event.currentTarget.blur();
    event.preventDefault();
  };

  login = (event) => {
    this.props.login(this.state.username);

    event.currentTarget.blur();
    event.preventDefault();
  };

  render() {
    const isDisabled = !this.state.username;

    return (
      <div className={style.loginForm}>
        <div className={style.container}>
          <h1 className={style.title}>Game Master</h1>
          <form className={style.form}>
            <input
              className={style.input}
              name="username"
              value={this.state.username}
              onChange={this.handleChange}
              placeholder="username"
              autoComplete="off"
            />
            <div className={style.controls}>
              <button
                type="button"
                className={style.createNew}
                onClick={this.createNew}
                disabled={isDisabled}
              >CREATE NEW</button>
              <button
                type="submit"
                className={style.login}
                onClick={this.login}
                disabled={isDisabled}
              >SUBMIT</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  createNew: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
};