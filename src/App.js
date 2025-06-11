import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './Components/MainApp/NavBar/NavBar';
import Mortgage from "./Components/Mortgage/Mortgage";
import ApplicantForm from './Components/MortgageApp/Forms/ApplicantForm/ApplicantForm';
import MortgageApp from './Components/MortgageApp/MortgageApp';
import MortgageViewApp from './Components/MortgageViewApp/MortgageViewApp';
import PrivateRoute from "./utils/PrivateRoute"
import Login from './Components/MainApp/auth/Login/Login';
import Register from './Components/MainApp/auth/Register/Register';
import FloatingProfile from './Components/MainApp/Profile/FloatingProfile/FloatingProfile';
import 'bootstrap/dist/css/bootstrap.min.css';
import ApplicantDetails from './Components/MortgageViewApp/Views/ApplicantDetails/ApplicantDetails';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path="/" element={<Mortgage />} />
        <Route path="/applicant-form" element={
          <PrivateRoute>
            <ApplicantForm />
          </PrivateRoute>
        } />
        <Route path="/applicant-details" element={
          <PrivateRoute>
            <ApplicantDetails />
          </PrivateRoute>
        } />
        <Route path='/profile' element={
          <PrivateRoute>
            <FloatingProfile />
          </PrivateRoute>
        } />
        <Route path='/mortgage/:applicantId/*' element={
          <PrivateRoute>
            <MortgageViewApp />
          </PrivateRoute>
        } />
        <Route path='/mortgage/add-data/:applicantId/*' element={
          <PrivateRoute>
            <MortgageApp />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;