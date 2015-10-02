import { showGistsRequest,showGistsSuccess,showGistsFail } from '../actions/user';
import { combineReducers } from 'redux';


const gistReducer = combineReducers({
  user : getGists

});

export default gistReducer;