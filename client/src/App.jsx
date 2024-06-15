import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import Saved from "./pages/Saved";
import Mylistings from "./pages/Mylistings";

export default function App() {
  return (
    <BrowserRouter> 
      <Header />
      <Routes>
        <Route path='/' element = {<Home />} />
        <Route path='/signin' element = {<SignIn />} />
        <Route path='/signup' element = {<SignUp />} />
        <Route path='/about' element = {<About />} />
        <Route path='/listing/:listingId' element = {<Listing />} />
        <Route path='/search' element={< Search/>} />
        <Route path='/savedlistings' element={<Saved/>} />
        <Route path='/mylistings' element={<Mylistings/>} />
        <Route element = {<PrivateRoute />}>
          <Route path='/profile' element = {<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        </Route>
      </Routes> 
    </BrowserRouter>
  )
}

