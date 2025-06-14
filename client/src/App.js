import './App.css';
import Post from "./Post";
import Header from "./Header" ;
import {Route, Routes} from "react-router-dom" ;
import Layout from "./Layout";
import IndexPage from "./pages/IndexPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import {UserContextProvider} from "./UserContext";
import Create from './pages/Create';
import PostPage from "./pages/PostPage";

function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
      <Route index element={<IndexPage />} />  
      <Route path={'/login'} element ={<LoginPage />}/> 
      <Route path={'/register'} element ={<RegisterPage />}/> 
      <Route path={'/create'} element ={<Create />}/> 
      <Route path="/post/:id" element={<PostPage />} />  {/* New Route */}
      </Route>  
  </Routes>
  </UserContextProvider>
  );
}

export default App;
