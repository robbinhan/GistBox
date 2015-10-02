import { getGistRequest,getGistSuccess } from '../actions/gist';
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
  case 'GET_GIST_REQUEST':
    return Object.assign({}, state, {
      isFetching: true
    });
  case 'GET_GIST_SUCCESS':
    return Object.assign({}, state, {
      isFetching: false,
      action.code,
      lastUpdated: action.receivedAt
    });
  default:
    return state;
  }
}


function getGistContent(state = {username:'robbinhan',items:[]}, action) {
  switch (action.type) {
  case 'GET_GIST_REQUEST':
  case 'GET_GIST_SUCCESS':
    return Object.assign({}, state, gets(state[action.username], action) );
  default:
    return state;
  }
}


const gistReducer = combineReducers({
  gists : getGists
});

export default gistReducer;