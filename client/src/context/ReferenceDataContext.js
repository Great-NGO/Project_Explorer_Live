import React,{createContext, useState, useMemo} from 'react';
import AuthService from '../services/auth';

const UserContext = createContext({
    firstname: '',
    setFirstName: () => {},
    profilePicture: '',
    setProfilePicture: () => {}
})

const user = AuthService.getCurrentUser();   
console.log("The USER FROM ReferenceDataCOntext ", user)    



const UserContextProvider = ({ children }) => {

    const [firstname, setFirstName ] = useState(user?user.firstname :"");
    const [profilePicture, setProfilePicture ] = useState(user?user.profilePicture:"")
    
    console.log("THe FNN ", firstname)
    //We use the useMemo Hook so our component only re-renders when the existing memoized value has been changed. firstname and profilePicture are the dependencies which it checks for a change in their values before re-rendering
    const value1 = useMemo(() => ({firstname, setFirstName}), [firstname]);     
    const value2 = useMemo(() => ({profilePicture, setProfilePicture}), [profilePicture]);
    
    console.log("THe FNN value", value1)
    console.log("THe PROFPIC value", value2)

    
    return (
        <UserContext.Provider value={{value1, value2}} >
            {children}
        </UserContext.Provider>
   
    )
}


export {UserContext, UserContextProvider };


