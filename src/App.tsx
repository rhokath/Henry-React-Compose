import React from 'react';
import styles from './App.module.scss';

const App = () => {
  return (
    <main>
      Make some toggles happen
    </main>
  );
}
//undefined meaning its not receiving props, the type is an object with boolean
class ToggleClass extends React.Component<undefined, { isOpen: boolean }> {
  state = {
    isOpen: true,
  };
  //method that takes in state a returns object with opp value
  toggle = () => {
    this.setState(state => ({...state, isOpen: !state.isOpen}))
  }
  render() {
    return (
      <button onClick={this.toggle}>
        {this.state.isOpen ? 'open': 'close'}
      </button>
    )
  }
}

const ToggleFunction = () => {
  return (
    <></>
  );
};

export default App;
