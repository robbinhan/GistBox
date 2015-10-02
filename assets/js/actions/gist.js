
import axios from 'axios';
/*
 * action types
 */
export function getGistRequest (url) {
  return {
    type: 'GET_GIST_REQUEST',
    url
  }
}

export function getGistSuccess (url,code) {
  return {
    type: 'GET_GIST_SUCCESS',
    url,
    code,
    receivedAt: Date.now()
  }
}

export function fetchGistContent(url) {

  // Thunk middleware 知道如何处理函数。
  // 这里把 dispatch 方法通过参数的形式参给函数，
  // 以此来让它自己也能 dispatch action。

  return function (dispatch) {

    // 首次 dispatch：更新应用的 state 来通知
    // API 请求发起了。

    dispatch(getGistRequest(url));

    // thunk middleware 调用的函数可以有返回值，
    // 它会被当作 dispatch 方法的返回值传递。

    // 这个案例中，我们返回一个等待处理的 promise。
    // 这并不是 redux middleware 所必须的，但是我们的一个约定。
    // 
    axios.get(url)
    .then(response => response.data)
    .then(function(json) {
      console.log('fetchGistContent response json',json); 
      dispatch(getGistSuccess(url, json)); 
    }).catch(function(ex) {
      console.log('parsing failed', ex)
    })

      // 在实际应用中，还需要
      // 捕获网络请求的异常。
  };
}