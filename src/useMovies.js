import { useState,useEffect } from "react";

const key = 'cd762379';

export function useMovies(query){
     const [movies, setMovies] = useState([]);
      // const [watched, setWatched] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [error,setError] = useState('');

    useEffect( function(){
   
    const controller = new AbortController();
    
    async function fetchMovies(){
      try{
        setIsLoading(true);
        setError("");
        const res = await fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=${key}&s=${query}`, {signal: controller.signal})
        
        if(!res.ok){
          throw new Error("Something went wrong! Unable to fetch movies");
        }
    
        
        const data = await res.json();
        if(data.Response === 'False'){
          throw new Error("Movie not found!");
          
        }
    
        setMovies(data.Search);
        setError("");
        console.log(data.Search);
        
        console.log(data);
      } catch(err){
        console.log(err.message);
    
        if (err.name !== "AbortError")    
          setError(err.message);
      
      }  finally{
          setIsLoading(false);
      }
      
    }
    if(!query.length){
      setMovies([]);
      setError("");
      return;
    }
  

    fetchMovies();
    
    return function(){
      controller.abort();
    }
    
    }, [query]);
    return {
        movies,
        isLoading,
        error
    }
}