import React, { useEffect } from 'react'
import {useState} from 'react'

export default function Counter(){
    const [count, setCount]=useState(0);

    useEffect(()=>{

        fetch("http://localhost:8000/count")
        .then((res)=> res.json())
        .then((data)=>{
            console.log("mydata", data.count)
            setCount(data.count)
        })
        .catch((error)=> console.log(error))

    },[])


    function sendRequest(type){
        fetch("http://localhost:8000/count", {
            method: "POST",
            headers: {
                'requestType': type
            },
            body: JSON.stringify({})
        })
            .then((response) => response.json())
            .then((data)=>{
                console.log("mydata", data.count)
                setCount(data.count)
            })
            .catch(e=>console.log(e))
    }

    return (
        <>
            <h1>{count}</h1>
            <button 
            className='border-2 m-2 p-2'
            onClick={()=>{sendRequest('Increment')}}>increment</button>
            <button 
            className='border-2 m-2 p-2'
            onClick={()=>{sendRequest('Decrement')}}>decrement</button>
        </>);
}