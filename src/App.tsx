import React, {useState, useContext} from 'react';
import styles from './App.module.scss';
//algorithm react uses to compare changes in DOM is O(n^3)!!
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
      <Checkbox/>
      <ToggleProvider>
        <ToggleFunctionConsumer/>
        <ToggleIsOpen>
          We are open
        </ToggleIsOpen>

      </ToggleProvider>
    </main>
  );
}
//context pass data to components through component hierarchy
//allows eliminate need for render props, often state management
//context provider/consumer consumer uses render props
//instead of render props use hooks
//type outsdie of provider generally null
//compose stateful logic like if with HOC also free in way we choose to render stateful like we do with render props
//can wrap in divs with color, make use of context in whatever way we so choose
//make interesting interfaces
const ToggleContext = React.createContext<ToggleProps | null>(null)
const ToggleProvider: React.FC = ({children}) => {
  const [isOpen, toggle] = useToggle()
  //memoize when have pure function with same inputs and outputs
  //if inputs haven't changed don't need to recalculate
  //const value = useMemo(()=> {
   // return {isOpen, toggle} 
  //}, [isOpen, toggle])
  //useCallback is same as useMemo but recognizes the function is the thign you want to memoize
  //split context like for ecommerce site a cart context, add items to cart could be it's ow context
  return(
    <ToggleContext.Provider value={{isOpen, toggle}}>
      {children}

    </ToggleContext.Provider>
  )
}
const useToggleContext = () => {
  const value = useContext(ToggleContext)
  if(value === null){
    throw new Error('useToggleContext must be used in ToggleProvider')
  }
  return value;
}
const ToggleFunctionConsumer = ()=>{
  const { isOpen, toggle} = useToggleContext()
  return(
    <button onClick={toggle}>
      {isOpen ? 'open': 'close'}
    </button>
  )

}
//interesting interface with context
const ToggleIsOpen: React.FC = ({children})=> {
  const {isOpen} = useToggleContext();
  if(isOpen){
  return <>{children}</>
  }
  return null;
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
const Checkbox = () => {
  const [isOpen, toggle] = useToggle()
  return(
    <input
    type="checkbox"
    checked={isOpen}
    onClick={toggle}
    readOnly
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
