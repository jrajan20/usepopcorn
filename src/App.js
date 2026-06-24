import { useState, useEffect, useRef} from "react";
import StarRating from "./StarRating";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const key = 'cd762379';

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {

   const [query, setQuery] = useState("");
 const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState('');
  const [selected, setSelected] = useState(null);

  const [watched, setWatched] = useState(function(){
    const storedValue = localStorage.getItem('watched');
    return JSON.parse(storedValue);
  });

 
function handleSelectMovie(id){
  setSelected(selected => (id === selected ? null : id));
}

function handleCloseMovie(){
  setSelected(null);
}

function addWatchedMovie(movie){
  setWatched(watched => [...watched,movie]);
  localStorage.setItem('watched', JSON.stringify([...watched,movie]));

}

function handleDeleteWatched(id){
  setWatched(watched => watched.filter(movie => movie.imdbID !== id));

}

useEffect(function(){
  
  localStorage.setItem('watched', JSON.stringify(watched));

}, [watched])

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
handleCloseMovie();
fetchMovies();

return function(){
  controller.abort();
}

}, [query]);


 function ErrorMessage({message}){
  return(
    <p className="error">
      <span>🛑</span> {message}</p>
  )    
 }

  return (
    <>
     
    <NavBar>
      <Logo/>
      <Search search={query} handleSearch={setQuery} />
      <NumResults movies={movies}/>
    </NavBar>
    <Main movies={movies}>
      <Box>
        {isLoading && <Loader/>}
        {!isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie}/>}
        {error && <ErrorMessage message={error}/>}
      </Box>

      {/* <Box element={
        isLoading && !error && 
        <MovieList movies={movies}/>}/> */}
        
      <Box>
        {
          selected ? <MovieDetails selectedId={selected} onCloseMovie={handleCloseMovie} onWatchedMovie={addWatchedMovie} watched={watched}/>
          :
          <>
           <WatchedSummary watched={watched}  />
          <WatchedList>
                  {watched.map((watchedMovie) => (
                  <WatchedMovie movie={watchedMovie} onDeleteWatched={handleDeleteWatched}/>
                  ))}
          </WatchedList>
          </>
        }
       
        
      </Box>
    </Main>
  
      

       
    </>
  );
}

function MovieDetails({selectedId, onCloseMovie, onWatchedMovie, watched}){

  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const {Title: title, Year: year, Poster: poster, Runtime: runtime, imdbRating, Plot: plot, Released: Released, Actors: Actors, Director: Director, Genre: genre} = movie
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(movie => movie.imdbID === selectedId )?.userRating;
  console.log(isWatched);


 useEffect(function(){

    function elCallBack(e){
      if(e.code === "Escape"){
          onCloseMovie();
         
        }

      }
      document.addEventListener('keydown', elCallBack)
      

      return function(){
        document.removeEventListener('keydown',elCallBack)
      }

    }
  ,[onCloseMovie]);

  useEffect(function(){
     async function getMovieDetails(){
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?&apikey=${key}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
  }
  getMovieDetails();
},[selectedId]);

useEffect(function(){
  if (!title) return;
  document.title = `Movie | ${title}`;
  return function (){
    document.title = "usePopcorn";
    
  }
},[title]);



function handleAdd(){
  const newWatchedMove = {
    imdbID: selectedId,
    title,
    year,
    poster,
    imdbRating: Number(imdbRating),
    runtime: Number(runtime.split(" ").at(0)),
    userRating,
  };
 

  onWatchedMovie(newWatchedMove);
   onCloseMovie();

}

  return(
    <div className="details">
      {isLoading ? <Loader/>:
      <>
       <header>
         <button className="btn-back" onClick={onCloseMovie}>
        &larr;
      </button>
      <img src={poster} alt={`Poster of ${title} movie`}/>
      <div className="details-overview">
        <h2>{title}</h2>
        <p>{Released} &bull; {runtime}</p>
        <p>{genre}</p>
        <p>
          <span>⭐</span>
          {imdbRating} Imdb Rating</p>
      </div>
  
      </header>
     <section>
      <div className="rating">
        {isWatched ? (<p>"You rated this movie: {watchedUserRating} 🌟"

        </p>):
        (<>
         <StarRating maxRating={10} size={24} onSetRating={setUserRating}/>
        {userRating > 0 && (<button className="btn-add" onClick={()=> handleAdd()}>+ Add to List</button>)}
        </>)}
      </div>
      <p><em>{plot}</em></p>
        <p>Starring {Actors}</p>
        <p> Directed By {Director}</p>
     </section>
      
      </>}

     
    </div>
  );
}

function Loader(){
return(
  <p className="loader">Loading...</p>
)
}

function NavBar({movies, children}){
  // const [query, setQuery] = useState("");
 return( 
      <nav className="nav-bar">
      {children}
      </nav>
 )
}
function Main({children}){

 return (
   <main className="main">
        {children}
        
      </main>
 )
}
function NumResults({movies = []}){
  return(
     <p className="num-results">
          Found <strong>{movies.length}</strong> results
        </p>
  )
}
function Search({search,handleSearch}){
  const inputElement = useRef(null);

useEffect(function(){
 
    function elCallBack(e){
      
        if(document.activeElement === inputElement.current)
          return;
        if(e.code === "Enter"){
           inputElement.current.focus();
        }

      }
      document.addEventListener('keydown', elCallBack)

      return function(){
        document.removeEventListener('keydown',elCallBack)
        handleSearch("");
      }
  
},[handleSearch])

  return(
      <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          ref={inputElement}
        />
  )
}

function Logo(){
  return (
  <div className="logo">
          <span role="img">🍿</span>
          <h1>usePopcorn</h1>
        </div>
        )

}
function Movie({movie, onSelectMovie}){
  return(
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
                  <img src={movie.Poster} alt={`${movie.Title} poster`} />
                  <h3>{movie.Title}</h3>
                  <div>
                    <p>
                      <span>🗓</span>
                      <span>{movie.Year}</span>
                    </p>
                  </div>
                </li>
  )
  
}
function MovieList({movies, onSelectMovie, onCloseMovie}){
 

  
  return(
     <ul className="list">
              {movies?.map((movie) => (
                <Movie movie={movie} onSelectMovie={onSelectMovie} onCloseMovie={onCloseMovie}/>
              ))}
            </ul>
  )
   
}
// function ListBox({ children}){
   
//     const [isOpen1, setIsOpen1] = useState(true);

//   return(
//     <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen1((open) => !open)}
//           >
//             {isOpen1 ? "–" : "+"}
//           </button>
//           {isOpen1 && 
//           children}
//         </div>
//   )
// }
function WatchedSummary({watched}){
   const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
      const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return(
     <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>

  )
}
function WatchedMovie({movie, onDeleteWatched}){
  return(
     <li key={movie.imdbID}>
                    <img src={movie.poster} alt={`${movie.title} poster`} />
                    <h3>{movie.title}</h3>
                    <div>
                      <p>
                        <span>⭐️</span>
                        <span>{movie.imdbRating}</span>
                      </p>
                      <p>
                        <span>🌟</span>
                        <span>{movie.userRating}</span>
                      </p>
                      <p>
                        <span>⏳</span>
                        <span>{movie.runtime} min</span>
                      </p>
                      <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>X</button>
                    </div>
                  </li>
  )
}
function WatchedList({children}){
  return(
    <ul className="list">
                {children}
              </ul>
  )
}
function Box({children}){

  const [isOpen, setIsOpen] = useState(true);


   

  return(
     <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? "–" : "+"}
          </button>
          {isOpen && 
             children
          }
        </div>
  )

}


