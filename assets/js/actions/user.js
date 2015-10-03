import axios from 'axios';
import localforage from 'localforage';
const ACCESS_TOKEN='a795112d8f7504cc08f81e5d7ede0cd8327dafb1';
/*
 * action types
 */
export function showGistsRequest (username) {
	return {
		type: 'SHOW_GISTS_REQUEST',
		username
	}
}

export function showGistsSuccess (username,json) {
	return {
		type: 'SHOW_GISTS_SUCCESS',
		username,
		json
	}
}

export function showGistsFail (username,json) {
	return {
		type: 'SHOW_GISTS_FAIL',
		username,
            error: json.statusText
	}
}

export function changeUserName (username) {
  return {
    type: 'CHANGE_USER_NAME',
    username
  }
}


// 来看一下我们写的第一个 thunk action creator！
// 虽然内部操作不同，你可以像其它 action creator 一样使用它：
// store.dispatch(fetchPosts('reactjs'));

export function fetchGists(username,following=false) {

  return function (dispatch) {

      dispatch(showGistsRequest(username));
      
      if (following === false) {
            let storageKey = 'nofollowing'+username;
            localforage.getItem(storageKey).then((nofollowingJson,err) => {
                  if (nofollowingJson) {
                        dispatch(showGistsSuccess(username, JSON.parse(nofollowingJson)))
                  } else {
                        var serial_promise = getUserGist(username)
                        serial_promise.then(function(gists){ 
                              localforage.setItem(storageKey,JSON.stringify(gists));
                              dispatch(showGistsSuccess(username, gists)) 
                        }).catch(function(ex) {
                              dispatch(showGistsFail(username,ex))
                        })
                  }
            })
      } else {
            let storageKey = 'following'+username;

            localforage.getItem(storageKey).then((nofollowingJson,err) => {
                  if (nofollowingJson) {
                        dispatch(showGistsSuccess(username, JSON.parse(nofollowingJson)))
                  } else {
                        var serial_promise = getUserGist(username)
                        let following_serial_promise = getUserFollowing(username);
                        
                        following_serial_promise.then(function  (following_serial_promises) {
                              following_serial_promises.push(...[serial_promise])
                              return following_serial_promises;
                        }).then(function  (serial_promise) {
                              axios.all(serial_promise)
                              .then(function (gistsArray) {
                                    var items = [];
                                    gistsArray.map(function(gists) {
                                          items.push(...gists)
                                    })
                                    localforage.setItem(storageKey,JSON.stringify(items));
                                    dispatch(showGistsSuccess(username, items)) 
                              }).catch(function(ex) {
                                    dispatch(showGistsFail(username,ex))
                              })
                        })
                  }
            });
      }
  };
}

/**
 * 返回后，通过then获取指定用户的所有gist的promise对象
 * @param  {[type]} username [description]
 * @return {[type]}          [description]
 */
function getUserGistPromise (username) {
      return axios.get(`https://api.github.com/users/${username}/gists?access_token=${ACCESS_TOKEN}`)
                  .then(response => response.data)
                  .then(function(json) {
                        //解析gist的URL，并发异步请求获取内容
                        var promise = [];
                        json.map(function(gist){
                              for (var key in gist.files) {
                                    let file = gist.files[key];
                                    var p = axios.get(file.raw_url).then(res => Object.assign({},file,{code:res.data}));
                                    promise.push(p);
                              }
                        })

                        return promise;
                  });
}

/**
 * 返回后，通过then获取指定用户所关注的人的Gist对象
 * @param  {[type]} username [description]
 * @return {[type]}          [description]
 */
function getUserFollowing(username) {
      return axios.get(`https://api.github.com/users/${username}/following?access_token=${ACCESS_TOKEN}`)
                  .then(response => response.data)
                  .then(function(json) {
                        var following_gist_promises = [];
                        json = json.slice(0,1)
                        json.map(function(user){
                              following_gist_promises.push(getUserGist(user.login))
                        })

                        return following_gist_promises;
                  })
}

/**
 * 返回后，通过then获取指定用户的所有gist对象
 * @param  {[type]} username [description]
 * @return {[type]}          [description]
 */
function getUserGist (username) {
      return getUserGistPromise(username).then(function  (serial) {
            return axios.all(serial)
            .then(function(gists){ 
                  return gists;
            })
            .catch(function(ex) {
            })
      }).catch(function(ex) {
      })
}
