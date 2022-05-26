export const reducer = (state, action ) => {
    switch(action.type) {
      // Case for the get request.. To populate the input on page load. i.e Reducer to handle both Display Initial value and Change Value
      case 'loadProjectDetails': {
        return {
          ...state,
          name: action.data.name,
          abstract: action.data.abstract,
          authors: action.data.authors,
          tags: action.data.tags,
          createdBy: `${action.data.createdBy.firstname} ${action.data.createdBy.lastname}`,
          profilePicture: action.data.createdBy.profilePicture,
          error: []

        }
      }
      case 'nameAndAbstract': {
        return {
          ...state,
          error: [],
          [action.fieldName]:action.payload
        }
      }
      case 'authors' : {
        return {
          ...state,
          error: [],
          authors: action.payload
        }
      }
      case 'tags': {
        return {
          ...state,
          error: [],
          tags: action.payload
        }
      }
      case 'clearErrorAlert': {
        return {
          ...state,
          error: []
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