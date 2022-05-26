export const reducer = (state, action ) => {
    switch(action.type) {
      // Case for the get request.. To populate the input on page load. i.e Reducer to handle both Display Initial value and Change Value
      case 'loadProfileDetails': {
        return {
          ...state,
          firstname: action.data.firstname,
          lastname: action.data.lastname,
          email: action.data.email,
          matricNumber: action.data.matricNumber,
          program: action.data.program,
          graduationYear: action.data.graduationYear,
          profilePicture: action.data.profilePicture,
          error: [],
          error2: []

        }
      }
      case 'field' : {
          return {
              ...state,
              error: [],  //To clear the profile details error
              error2: [],  //To clear the password error
              [action.fieldName]: action.payload
          }
      }
      case 'profilePicture' : {   //Handling upload profile picture
        return {
          ...state,
          [action.fieldName]:action.payload
        }
      }
      case 'clearErrorAlert': {
        return {
          ...state,
          error: [],
          error2: []
        }
      }
      case 'success': {
        return {
          ...state,
          successMessage: true,
          error: []
        }
      }
      case 'clearSuccessAlert' : {
        return {
          ...state,
          successMessage: false,
          passwordUpdateSuccessMsg: false,
        }
      }
      case 'error' : {
        return {
          ...state,
          error: action.payload
        }
      }
      case 'passwordError' : {
        return {
          ...state,
          error2: action.payload
        }
      }
      case 'passwordSuccess' : {
        return {
          ...state,
          passwordUpdateSuccessMsg: true,
          error2: []
        }
      }
      default: 
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }