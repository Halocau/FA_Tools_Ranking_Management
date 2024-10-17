// // src/App.jsx
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Sidebar from './layouts/Sidebar.jsx';
// import Header from './layouts/Header.jsx'; // Import Header
// import RankingGroups from './pages/RankingGroups';
// import LoginPage from './pages/LoginPage';
// import SignupPage from './pages/SignupPage';

// function App() {
//   return (
//     <div className="app-layout">
//       <Header /> {/* Header luôn nằm trên cùng */}
//       <div className="main-content">
//         <Sidebar /> {/* Sidebar cố định bên trái */}
//         <div className="content">
//           <BrowserRouter>
//             <Routes>
//               <Route path="/" element={<LoginPage />} />
//               <Route path="/login" element={<LoginPage />} />
//               <Route path="/register" element={<SignupPage />} />
//               <Route path="/ranking-groups" element={<RankingGroups />} />
//             </Routes>
//           </BrowserRouter>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

// src/App.jsx
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './layouts/Sidebar.jsx';
import Header from './layouts/Header.jsx';
import RankingGroups from './pages/RankingGroups';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function LayoutWithSidebar({ children }) {
  return (
    <div className="app-layout">
      <Header /> {/* Header toàn màn hình, đặt bên trên */}
      <div className="layout-body">
        <Sidebar /> {/* Sidebar cố định bên trái */}
        <div className="page-content">{children}</div> {/* Nội dung trang */}
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route
          path="/ranking-groups"
          element={
            <LayoutWithSidebar>
              <RankingGroups />
            </LayoutWithSidebar>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

