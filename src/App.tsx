import React, {useState} from 'react';
import styles from './App.module.scss';

const App = () => {
  const variable = 'test'
  return (
    <main>
      Make some toggles happen
      <ToggleClass/>
      <ToggleFunction/>
      <Dropdown/>
      <ToggleRender
       render={({isOpen, toggle})=>(
         <div>
           I'm rendered as {isOpen ? 'open': 'closed'}
           {variable}
         </div>
       )}
      />
    </main>
  );
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
const useToggle = () => {
  const [isOpen, setIsOpen] = useState(true)
  const toggle = ()=> {
    setIsOpen(isOpen => !isOpen)
  }
  //so typescript will now to treat these as a pair
  return [isOpen, toggle] as const
}
const Checkbock = () => {
  const [isOpen, toggle] = useToggle()
  return(
    <input
    type="checkbox"
    checked={isOpen}
    onClick={toggle}
    />
  )
}

//render props
//makes it easy to get additional data vs more rigidity for HOC
//render is a function that returns JSX
//can't memomize or use hooks directly inside it
//therefore perfomance issues because have to call each time
//but good way to quickly get data to compose with existing logic
//another way to do it is instead of render you could say children 
const ToggleRender = ({render}: {render: (props: ToggleProps)=>JSX.Element})=>{
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => {
    setIsOpen(isOpen => !isOpen)
  }
  return render({isOpen, toggle})
  //we can't do this
  //return <render isOpen={isOpen} toggle={toggle}/>
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



//HOC the 'with' is a naming convention
type ToggleProps = { isOpen: boolean, toggle: () => void}
const withToggle = (Component: React.ComponentType<ToggleProps>){
  return (
    () => {
      const [isOpen, setIsOpen] = useState(true)
      const toggle = () => {
        setIsOpen(isOpen => !isOpen)
      }
      return (
        <Component toggle={toggle} isOpen={isOpen} />
      )

    }
  )


}
//HOC were gold standard in class based React but now going out of style (to get around inheritance)
//dropdownviewlayer is a dumb component
//does not care how props work or where they come from
//withToggle a reusable factory, write state once and use however whereever if different viewlayer
const DropdownViewLayer: React.FC<ToggleProps> = ({isOpen, toggle})=>{
  return (
    <>
    <div onClick={toggle}>
      dropdown
    </div>
    {isOpen && <div>this is a dropdown</div>}
    </>
  )
}
const Dropdown = withToggle(DropdownViewLayer)

export default App;
