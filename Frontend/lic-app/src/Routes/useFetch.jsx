import { useState , useEffect } from "react"

export default function useFetch(url){
    const[FinalData,setFinalData]=useState({});
    const[Loading,setLoading]=useState(true);

    async function getDetails(){
        try {
            let response=await fetch(url);
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
    },[url]);
    useEffect(()=>{
        setInterval(getDetails,10*1000);//cleanup refetching the data
    },[])
    return {
        FinalData,  // was finalData
        Loading     // was loading
    }
}