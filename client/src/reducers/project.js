export const reducer = (state, action ) => {
    switch(action.type) {
      // Case for the get request.. To populate the input on page load. i.e Reducer to handle both Display Initial value and Change Value
      case 'loadProjectDetails': {
        return {
          ...state,
          projName: action.data.name,
          projAbstract: action.data.abstract,
          projAuthors: action.data.authors,
          projTags: action.data.tags,
          createdBy: `${action.data.createdBy.firstname} ${action.data.createdBy.lastname}`,
          profilePicture: action.data.createdBy.profilePicture,
          createdAt: new Date(action.data.createdAt).toLocaleDateString('en-GB'),
          updatedAt: new Date(action.data.updatedAt).toLocaleDateString('en-GB'),
          createdById: action.data.createdBy._id,
        //   error: []
        }
      }
      default: 
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }