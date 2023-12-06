import React, {useState,useEffect} from 'react'
import '../components/CardCss.css'
function Card({movie_name,movie_url}) {
  return (
        <div className="card">
          <img className='movie_poster_image' src={movie_url} alt="Avatar"/>
          <div className="container">
            <h4><b>{movie_name}</b></h4>
          </div>
        </div>
  );
}

export default Card;
