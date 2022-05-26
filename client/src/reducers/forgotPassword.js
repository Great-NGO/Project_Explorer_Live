export const reducer = (state, action) => {
    switch (action.type) {
      case 'field': {
        return {
          ...state,
          successMsg: false,
          error: '',  //To clear the error
          [action.fieldName]: action.payload
        }
      }
      case 'success' : {
        return {
          ...state,
          successMsg: true,
          error: '',
        }
      }
      case 'error': {
        return {
          ...state,
          error: action.payload,
          successMsg: false
        }
      }
      case 'clearAlert': { //To clear the Error Alert each time a user clicks on it
        return {
          ...state,
          error: '',
          successMsg: false
        }
      }
      default: 
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }