import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api";
export default function SignUP(){
    const nav = useNavigate()

    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');

    async function handleSignUp(){
        const res = await fetch(`${API_URL}/singup`,{
            headers : {'Content-type' : 'application/json'},
            body: JSON.stringify({email , password})
        })

        if(res.ok){
            nav('/login')
        }
    }

    return(
        <div className="signup">
            <input 
            value={email}
            type="email"
            placeholder="enter your email"
            onChange={e => setEmail(e.target.value)}
            />
            <input 
            value={password}
            type="password"
            placeholder="enter your password"
            onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp}>Signup</button>
        </div>
    )
}