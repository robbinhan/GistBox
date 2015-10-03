import axios from 'axios';
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
      var serial_promise = getUserGist(username)

      if (following === false) {
            console.log('not in following 1',serial_promise)
            serial_promise.then(function(gists){ 
                  console.log('no following gist 2',gists);
                  dispatch(showGistsSuccess(username, gists)) 
            }).catch(function(ex) {
                  console.log('parsing failed', ex)
                  dispatch(showGistsFail(username,ex))
            })
      } else {
            let following_serial_promise = getUserFollowing(username);
            
            following_serial_promise.then(function  (following_serial_promises) {
                  console.log('in following 1',serial_promise,following_serial_promises)
                  following_serial_promises.push(...[serial_promise])
                  return following_serial_promises;
            }).then(function  (serial_promise) {
                  console.log('in following ',serial_promise)
                  axios.all(serial_promise)
                  .then(function (gistsArray) {
                        console.log('following true',gistsArray);
                        var items = [];
                        gistsArray.map(function(gists) {
                              items.push(...gists)
                        })
                        console.log('following items',items);
                        dispatch(showGistsSuccess(username, items)) 
                  }).catch(function(ex) {
                        console.log('parsing failed', ex);
                        dispatch(showGistsFail(username,ex))
                  })
            })
      }
  };
}

/**
 * 返回后，通过then获取指定用户的所有gist的promise对象
 * @param  {[type]} username [description]
 * @return {[type]}          [description]
 */
function getUserGistPromise (username) {
      return axios.get(`https://api.github.com/users/${username}/gists?access_token=042af57e21de136c66ff9704106be9d8abfc5af5`)
                  .then(response => response.data)
                  .then(function(json) {
                        console.log('response json',json); 
                        //解析gist的URL，并发异步请求获取内容
                        var promise = [];
                        json.map(function(gist){
                              for (var key in gist.files) {
                                    let file = gist.files[key];
                                    var p = axios.get(file.raw_url).then(res => Object.assign({},file,{code:res.data}));
                                    promise.push(p);
                              }
                        })
                        console.log('promise',promise);

                        return promise;
                  });
}

/**
 * 返回后，通过then获取指定用户所关注的人的Gist对象
 * @param  {[type]} username [description]
 * @return {[type]}          [description]
 */
function getUserFollowing(username) {
      return axios.get(`https://api.github.com/users/${username}/following?access_token=042af57e21de136c66ff9704106be9d8abfc5af5`)
                  .then(response => response.data)
                  .then(function(json) {
                        var following_gist_promises = [];
                        json = json.slice(0,1)
                        json.map(function(user){
                              following_gist_promises.push(getUserGist(user.login))
                        })

                        console.log('following_gist_promises',following_gist_promises);

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
                  console.log('no following gist 3',gists);
                  return gists;
            })
            .catch(function(ex) {
                  console.log('parsing failed', ex)
            })
      }).catch(function(ex) {
                  console.error('parsing failed', ex)
      })
}
