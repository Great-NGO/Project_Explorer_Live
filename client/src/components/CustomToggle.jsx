import React from 'react';
import { ThreeDotsVertical } from 'react-bootstrap-icons';


// ForwardRef is a method that allows parent components pass down (i.e. "forward") refs to their children. Using forwardRef in React gives the child component a reference to the a DOM element created by its parent component. This then allows the child component to read and modify that element anywhere it is being used.
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => {
    return (
      <div
    //   href=""
      ref={ref}
      onClick={e => {
      e.preventDefault();
      onClick(e)
      }}
    //   style={{color:'black', textDecoration:'none', float:"right"}}
      style={{color:'black', textDecoration:'none', cursor:"pointer" }}
      >
        <ThreeDotsVertical />
        {children}
      </div>
    );
});

export default CustomToggle;