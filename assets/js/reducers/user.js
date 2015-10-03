import { showGistsRequest,showGistsSuccess,showGistsFail } from '../actions/user';
import { combineReducers } from 'redux';
/**
 * reducer中写每个action的业务逻辑
 * @param  {[type]} state  [description]
 * @param  {[type]} action [description]
 * @return {[type]}        [description]
 */
function gets(state = {
  isFetching: false,
  items: []
}, action) {
  switch (action.type) {
  case 'SHOW_GISTS_REQUEST':
  	return Object.assign({}, state, {
      isFetching: true
    });
  case 'SHOW_GISTS_SUCCESS':
  	return Object.assign({}, state, {
      isFetching: false,
      items: action.json
    });
  case 'SHOW_GISTS_FAIL':
  	return Object.assign({}, state, {
      isFetching: false,
      error: action.error
    });
  default:
    return state;
  }
}


function getGists(state = {username:'robbinhan',items:[],isFetching: false,error:null}, action) {
  switch (action.type) {
  case 'SHOW_GISTS_REQUEST':
  case 'SHOW_GISTS_SUCCESS':
  case 'SHOW_GISTS_FAIL':
    return Object.assign({}, state, gets(state[action.username], action) );
  case 'CHANGE_USER_NAME':
      return Object.assign({}, state,{
        username: action.username
      });
  default:
    return state;
  }
}


const gistReducer = combineReducers({
  gists : getGists
});

export default gistReducer;