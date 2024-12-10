import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Homepage from './Component/Homepage';
import Signuppage from './Component/Signuppage';
import Loginpage from './Component/Loginpage';
import SignuppageProvider from './Component/Provider';
import { UserProvider } from './UserContext.js'; 
import { Profile } from './Component/Profile.jsx';
import MyOrder from './Component/MyOrder.jsx';
import Productreview from './Component/Productreview.jsx';
import Cart from './Component/Cart.jsx';
import Theme from './redux/Theme.js'
import ForgotPassword from './Component/ForgotPassword.jsx';
import VerifyOtpAndResetPassword from './Component/VerifyOtpAndResetPassword.jsx'
import ProductOrder from './Component/ProductOrder.jsx';
import OrderSummary from './Component/OrderSummary.jsx';
function App() {
  return (
    <Provider store={store}>
      <UserProvider> 
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/signup" element={<Signuppage />} />
            <Route path="/login" element={<Loginpage />} />
            <Route path="/provider" element={<SignuppageProvider />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/myorder" element={<MyOrder />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/theme" element={<Theme/>} />
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path="/reset-password" element={<VerifyOtpAndResetPassword />} />
             <Route path='/product-order' element={<ProductOrder/>}/><Route path="/product-review/:_id" element={<Productreview />} />
             <Route path="/order-summary" element={<OrderSummary />} />
            <Route path="/productreview/:_id" element={<Productreview />} />
        <Route path="/order-summary" element={<OrderSummary />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </Provider>
  );
}

export default App;
