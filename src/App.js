import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard.jsx';
import Profile from './components/Profile.jsx';
import User from './components/User.jsx';
import Post from './components/Post.jsx';
import CreatePost from './components/CreatePost.jsx';
import ChatList from './components/ChatList.jsx';
import ChatMessages from './components/ChatMessages.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="">
      <Routes>
         <Route path='/' element={<Register/>}></Route>
         <Route path='/register' element={<Register/>}></Route>
         <Route path='/login' element={<Login/>}></Route>
         <Route path='/dashboard' element={<Dashboard/>}></Route>
         <Route path='/profile' element={<Profile/>}></Route>
         <Route path='/users' element={<User/>}></Route>
         <Route path='/posts' element={<Post/>}></Route>
         <Route path='/create-post' element={<CreatePost/>}></Route>
         <Route path='/chats' element={<ChatList/>}></Route>
         <Route path='/chats/:chatId/messages' element={<ChatMessages/>}></Route>
         <Route path='/admin/chats' element={<ChatList adminOnly/>}></Route>
         <Route path='/admin/chats/:chatId/messages' element={<ChatMessages adminOnly/>}></Route>
      </Routes>
    </div>
  );
}

export default App;