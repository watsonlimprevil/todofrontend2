export const API_URL = import.meta.env.VITE_API_URL;

export function  AuthHeader(){
    return{
        Authorization : `Bearer ${localStorage.getItem('token')}`
    }
}