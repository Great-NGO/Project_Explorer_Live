export const reducer = (state, action) => {
    switch(action.type) {
        case 'field' : {
            return {
                ...state,
                error: [],
                [action.fieldName]: action.payload
            }
        }
        case 'error': {
            return {
                ...state,
                error: action.payload
            }
        }
        case 'clearErrorAlert' : {
            return {
                ...state,
                error: []
            }
        }
        case 'success': {
            return {
                ...state,
                successMsg: true,
                error: []
            }
        }
        default: 
          throw new Error(`Unknown action type: ${action.type}`);
    }
}