import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login Page/Login'; // Correctly import the Login page
import Dashboard from './Pages/Admin Pages/Dashboard/Dashboard';
import Products from './Pages/Admin Pages/Products/Products';
import Stock from './Pages/Admin Pages/Stock/Stock';
import Sales from './Pages/Admin Pages/Sales/Sales'
import Charges from './Pages/Admin Pages/Charges/Charges';
import TableOfSales from './Pages/Admin Pages/Table Of Sales/TableOfSales'
import Cash from './Pages/Admin Pages/Cash/Cash';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Login />} /> {/* Login route */}
        <Route path="/login" element={<Login />} /> {/* Login route */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Dashboard route */}
        <Route path="/products" element={<Products />} /> {/* Products route */}
        <Route path="/stock" element={<Stock />} /> {/* Stock route */}
        <Route path="/sales" element={<Sales />} /> {/* Sales route */}
        <Route path="/charges" element={<Charges />} /> {/* Charges route */}
        <Route path="/tableofsales" element={<TableOfSales />} /> {/* TableOfSales route */}
        <Route path="/cash" element={<Cash />} /> {/* Cash route */}
      </Routes>
    </Router>
  );
}

export default App;
