export const reducer = (state, action ) => {
    switch(action.type) {
      // Case for the get request.. To populate the input on page load. i.e Reducer to handle both Display Initial value and Change Value
      case 'loadContinueSignupDetails': {
        return {
          ...state,
          program: action.data.program,
          graduationYear: action.data.graduationYear,
          error: [],

        }
      }
      case 'field' : {
          return {
              ...state,
              error: [],  //To clear the profile details error
              [action.fieldName]: action.payload
          }
      }
      case 'clearErrorAlert': {
        return {
          ...state,
          error: [],
        }
      }
      case 'error' : {
        return {
          ...state,
          error: action.payload
        }
      }
      default: 
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }