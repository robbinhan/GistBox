import { connect } from 'react-redux';
import { fetchGists,changeUserName } from '../actions/user';
import UserBox from '../components/UserBox';

// Which part of the Redux global state does our component want to receive as props?
// 给子组件的props对象定义数据
function mapStateToProps(state) {
  console.log('connet state',state)
  return {
    username: state.gists.username,
    items: state.gists.items || [],
    isFetching: state.gists.isFetching,
    error: state.gists.error
  };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch,ownProps) {
  return {
    handlerSubmit: (username) => dispatch(fetchGists(username)),
    handlerChange: (username) => dispatch(changeUserName(username)),
    handlerClick: (username) => dispatch(fetchGists(username,true))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserBox);