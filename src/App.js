import './App.css';
import Card from './components/Card';
import React, {useState,useEffect} from 'react'
import similarity_matrix_data from './data/numpyData.json'
import movies_array_data from './data/movies_array.json'
import location_data from './data/location.json'
import genre_data from './data/genreData.json'
import poster_data from './data/poster.json'
import age_data from './data/age.json'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

var all_locations = ["China","India","United States","Indonesia","Pakistan","Brazil","Nigeria","Bangladesh","Russia","Mexico","Japan","Ethiopia"
    ,"Philippines","Egypt","Vietnam","DR Congo","Turkey","Iran","Germany","Thailand","United Kingdom","France"];

var all_genres = ['Action', 'Adventure', 'Animation', 'Children', 'Comedy', 'Crime','Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 'IMAX',
'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War','Western']

function App() {
  var similarity_matrix = similarity_matrix_data["array"];
  var movies_array = movies_array_data["array"];
  var age_array = age_data["array"]
  var location_array = location_data["array"];
  var genre_array = genre_data["array"];
  var poster_array = poster_data["array"];
  var movie_to_index = new Map();
  
  for (var i=0;i<movies_array.length;i++){
    movie_to_index[movies_array[i]]=i;
  }

  const [age,setAge] = useState(25)
  const [location,setLocation] = useState("India")
  const [movies,setMovies] = useState([])
  const [movie_name,setMovieName] = useState(movies_array[0])
  const [recmovies,setRecmovies] = useState([])
  const [genre,setGenre] = useState("Action")

  useEffect(()=>{

  },[])

  // function to shuffle the array
  function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  // update the predicted age nationality and favourite genre of the user
  function setAgeNationalityGenre(){
    var locationmap = new Map() // calculate frequency of each country
    var genremap = new Map()    // calculate frequency of each genre type
    for (var i=0;i<all_locations.length;i++){
      locationmap[all_locations[i]]=0;
    }
    for (var i=0;i<all_genres.length;i++){
      genremap[all_genres[i]]=0;
    }
    var ageSum = 0;
    for (var i=0;i<recmovies.length;i++){
      ageSum += age_array[recmovies[i]];
      locationmap[location_array[recmovies[i]]]++;
      for (var j=0;j<genre_array[recmovies[i]].length;j++)
        genremap[genre_array[recmovies[i]][j]]++;
    }
    //console.log(locationmap);
    if (recmovies.length!=0)
      setAge(Math.ceil(ageSum/recmovies.length));
    var maxfreq = -1;
    for (var i=0;i<all_locations.length;i++){
      if (maxfreq<locationmap[all_locations[i]]){
        maxfreq = locationmap[all_locations[i]];
        setLocation(all_locations[i]);}
    }
    maxfreq=-1;
    for (var i=0;i<all_genres.length;i++){
      if (maxfreq<genremap[all_genres[i]]){
        maxfreq = genremap[all_genres[i]];
        setGenre(all_genres[i]);
      }
    }
  }

  // recommend movies on the basis of movies selected by user
  function get_similar(){
    var temp = new Set();  // selected movie_id
    movies.map((movie_id,i)=>{
      var xx = [];
      var yo = similarity_matrix[movie_id];
      yo.map((similarity,index)=>{
        xx.push([similarity,index]);
      })
      xx.sort(function(left,right){
        return left[0]<right[0] ? -1 : 1;
      })
      for (var k=0;k<10;k++){
        if (xx[k][1]==i)continue;
        temp.add(xx[k][1]);
      }
    })
    var to_rec = []
    var x=40;
    for (var ele of temp){
      to_rec.push(ele);
      x--;
      if (x==0)break;
    }
    shuffle(to_rec);
    setRecmovies(to_rec);
  }

  // movie choosen from dropdown
  function dropdownchange(e){
    console.log(e.value);
    setMovieName(e.value);
  }

  // movie with movieId = idx is selected by user
  function movieSelected(idx){
    var f=0;
    movies.map((value)=>{
      if (value==idx)f=1;
    })
    if (f==0){
      console.log(movies)
      movies.push(idx);
      setMovies(movies);
      get_similar();
      setAgeNationalityGenre();
    }
  }

  return (
    <div className="App">
      <h1 className='heading'>Movie Recommendation System</h1>
      <div class="smallcard">
        <div class="container">
          <h4><b>Predicted Age</b></h4>
          <p>{age}</p>
        </div>
      </div>
      <div class="smallcard">
        <div class="container">
          <h4><b>Predicted Nationality</b></h4>
          <p>{location}</p>
        </div>
      </div>
      <div class="smallcard">
        <div class="container">
          <h4><b>Favourite genre</b></h4>
          <p>{genre}</p>
        </div>
      </div>
      <Dropdown className="dropDown" options={movies_array} value={movies_array[0]} onChange={dropdownchange} placeholder="Select a movie" />
      <button className='button' onClick={()=>movieSelected(movie_to_index[movie_name])}>Predict</button>
      <div className='selected_movies'>
        {
          movies.map((movie_id,i)=>( 
            <h4 className='selected_movie'>{movies_array[movie_id]}</h4>
          ))
        }
      </div>
      <div className='movies_container'>
        {
          (typeof recmovies === 'undefined') ? (  
            <p>Loading...</p>
          ): (
            recmovies.map((movie_id,i)=>(
              <div className='card_container' onClick={()=>movieSelected(movie_id)}>
                <Card  movie_name={movies_array[movie_id]} movie_url={poster_array[movie_id]}/>
              </div>
            ))
          )
        }
      </div>
    </div>
  );

}

export default App;
