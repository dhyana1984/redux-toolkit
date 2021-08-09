import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { SinglePostPage } from './features/posts/SinglePostPage'

import { Navbar } from './app/Navbar'
import { AddPostForm } from './features/posts/AddPostForm'
import { PostsList } from './features/posts/PostsList'
import { EditPostForm } from './features/posts/EditPostForm'
// import { useEffect } from 'react'




function App() {

  // useEffect(() => {
  //   fetch("/fakeApi/posts")
  //     .then((response) => response.json())
  //     .then((json) => console.log(json))
  // }, [])

  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <>
                <AddPostForm />
                <PostsList />
              </>
            )}
          />
          <Route
            exact
            path="/posts/:postId"
            component={SinglePostPage}
          />
          <Route
            exact
            path="/editPost/:postId"
            component={EditPostForm}
          />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  )
}

export default App