import { useState , useEffect } from "react"

export default function useFetch(url){
    const[FinalData,setFinalData]=useState({});
    const[Loading,setLoading]=useState(true);

    async function getDetails(){
        try {
            let response=await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            let json=await response.json();
            setFinalData(json);
        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getDetails();
        const interval = setInterval(getDetails, 10*1000);
        return () => clearInterval(interval); // cleanup
    },[url]);

    return { FinalData, Loading };
}