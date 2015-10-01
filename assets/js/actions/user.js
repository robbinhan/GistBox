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
		posts: json.map(child => child.html_url),//function(child){return child.data}
            receivedAt: Date.now()
	}
}

export function showGistsFail (username) {
	return {
		type: 'SHOW_GISTS_FAIL',
		username
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

export function fetchGists(username) {

  // Thunk middleware 知道如何处理函数。
  // 这里把 dispatch 方法通过参数的形式参给函数，
  // 以此来让它自己也能 dispatch action。

  return function (dispatch) {

    // 首次 dispatch：更新应用的 state 来通知
    // API 请求发起了。

    dispatch(showGistsRequest(username));

    // thunk middleware 调用的函数可以有返回值，
    // 它会被当作 dispatch 方法的返回值传递。

    // 这个案例中，我们返回一个等待处理的 promise。
    // 这并不是 redux middleware 所必须的，但是我们的一个约定。
    // 
    axios.get(`https://api.github.com/users/${username}/gists`)
    .then(response => response.data)
    .then(function(json) {
      console.log('response json',json); 
      dispatch(showGistsSuccess(username, json)); 
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })

      // 在实际应用中，还需要
      // 捕获网络请求的异常。
  };
}
