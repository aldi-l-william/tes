import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router';
import LoginForm from './component/LoginForm';
import ProductPage from './pages/ProductPage';
import CustomerPage from './pages/CustomerPage';
import ProtectedRoute from './component/ProtectedLayout';
import DashboardLayout from './component/Dashboard';
import OrderPage from './pages/OrderPage';

function App() {


  return (
    <>
      <BrowserRouter>
    <Routes>

      {/* Public route */}
        <Route path="/login" element={<LoginForm />} />

        <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
        }>

        
        <Route index element={<ProductPage />} />
        <Route path="customer" element={<CustomerPage />} />
        <Route path="order" element={<OrderPage />} />
      </Route>
    </Routes>
</BrowserRouter>
    </>
  )
}

export default App
