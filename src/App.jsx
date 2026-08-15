import { BrowserRouter , Routes , Route } from "react-router-dom";
import login from "./pages/Login";
import SignUP from "./pages/Signup";
export default function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignUP />}/>
      <Route path="/login" element={<login />} />
    </Routes>
    </BrowserRouter>
  )
}