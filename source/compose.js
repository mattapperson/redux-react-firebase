
import Firebase from 'firebase'
import * as Actions from './actions'



export default (url, config) => {
  return next => (reducer, initialState) => {

    const defaultConfig = {
      userProfile: null
    }

    const store = next(reducer, initialState)

    const {dispatch} = store

    const ref = new Firebase(url)

    const configs = Object.assign({}, defaultConfig, config)

    const firebase = {
      ref,
      _: {
        watchers: {},
        config: configs,
        authUid: null
      },
    }


    const set = (path, value) => ref.child(path).set(value)
    const push = (path, value) => ref.child(path).push(value)
    const remove = (path, value) => ref.child(path).remove(value)
    const login = credentials => Actions.login(dispatch, firebase, credentials)
    const logout = () => Actions.logout(dispatch, firebase)
    const createUser = (credentials, profile) => Actions.createUser(dispatch, firebase, credentials, profile)

    firebase.helpers = {
      set, push, remove,
      createUser,
      login, logout,
    }

    Actions.init(dispatch,  firebase)

    store.firebase = firebase

    return store

  }
}

