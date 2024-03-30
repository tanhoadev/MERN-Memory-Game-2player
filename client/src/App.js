import logo from './logo.svg';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './App.css';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import { useAuth } from './components/contexts/AuthContext';
import LayoutAdmin from './components/admin/LayoutAdmin';
import MainRoom from './components/admin/Room/MainRoom';
import NotFound from './components/user/NotFound';
import UserHomeAd from './components/admin/User/UserHomeAd';
import BackCardHomeAd from './components/admin/BackCard/BackCardHomeAd';
import FrontCardHomeAd from './components/admin/FrontCard/FrontCardHomeAd';
import MainRoomCate from './components/admin/RoomCategory/MainRoomCate';
import LayoutUser from './components/user/layouts/LayoutUser';
import MainUser from './components/user/home/MainUser';
import WaitingRoom from './components/user/waitingRoom/WaitingRoom';
import HomeG from './components/user/game/HomeG';

import { useEffect } from 'react';

function App() {
  const { isAuthenticated, isAdminAuthenticated, joinRoom, startGame } = useAuth()
  useEffect(() =>{
  })
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <Register /> : startGame ? <Navigate to='/game' /> : <Navigate to='/main' />} />
        <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to='/main' />} />
        <Route path='/game' element={isAuthenticated ? (startGame ? <HomeG /> : <Navigate to='/main' />) : <Login />} />
        <Route path='/main' element={!isAuthenticated ? <Login /> : startGame ? <Navigate to='/game' /> : <LayoutUser />}>
          <Route index element={startGame ? <Navigate to='/game' /> : joinRoom ? <WaitingRoom /> : <MainUser />} />
          <Route path='waiting-room' element={startGame ? <Navigate to='/game' /> : joinRoom ? <WaitingRoom /> : <MainUser />} />
        </Route>
        {/* <Route path='/game' element = {!isAuthenticated ? <Login/> : startGame ? <HomeG/>: <Navigate to='main'/>}/> */}
        <Route path='/admin' element={isAuthenticated && (isAdminAuthenticated ? <LayoutAdmin /> : <NotFound />)}>
          {/* <Route index element={isAdminAuthenticated ? <LayoutAdmin />: <NotFound/>} /> */}
          <Route index element={isAdminAuthenticated ? <UserHomeAd /> : <NotFound />} />

          <Route path='front-card' index element={isAdminAuthenticated ? <FrontCardHomeAd /> : <NotFound />} />
          <Route path='back-card' element={isAdminAuthenticated ? <BackCardHomeAd /> : <NotFound />} />
          <Route path='rooms' element={isAdminAuthenticated ? <MainRoom /> : <NotFound />} />
          <Route path='users' element={isAdminAuthenticated ? <UserHomeAd /> : <NotFound />} />
          <Route path='room-cate' element={<MainRoomCate />} />
        </Route>
        {/* <Route path='/test' element={<TestAPI/>}/> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
