import { useState } from "react";
import { API_URL } from "../api";
import { useNavigate } from "react-router-dom";
export default function Login(){
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const nav = useNavigate()


    async function handlelogin(){
        const res = await fetch(`${API_URL}/login` , {
            method : 'POST',
            headers: {'Content-tytpe' : 'application/json'},
            body: JSON.stringify({email , password})
        })

        const data = await res.json();

        if(data.token){
            localStorage.setItem('token' , data.token);
            nav('/boards')
        }
    }


    return(
        <div>
            <input 
            value={email}
            placeholder="enter your email"
            onChange={e =>  setEmail(e.target.value)}
            />
            <input 
            value={password}
            placeholder="enter your password"
            type="password"
            onChange={e =>  setPassword(e.target.value)}
            />
            <button onClick={handlelogin}>Login</button>
        </div>
    )
}