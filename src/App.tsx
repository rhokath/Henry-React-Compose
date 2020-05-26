import React, {useState} from 'react';
import styles from './App.module.scss';

const App = () => {
  return (
    <main>
      Make some toggles happen
      <ToggleClass/>
      <ToggleFunction/>
    </main>
  );
}
//HOC the 'with' is a naming convention
type ToggleProps = { isOpen: boolean, toggle: () => void}
const withToggle = (Component: React.ComponentType<ToggleProps>){
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => {
    setIsOpen(isOpen => !isOpen)
  }
  return (
    <Component toggle={toggle} isOpen={isOpen} />
  )

}
class ToggleClass extends React.Component<{}, { isOpen: boolean }> {
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
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => {
    setIsOpen(isOpen => !isOpen)
  }
  return (
    <button onClick={toggle}>
      {isOpen ? 'open': 'close'}
    </button>
  );
};

export default App;
