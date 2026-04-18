import { StarIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
import { useAppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const {image_base_url}=useAppContext()

  const cardVariants = {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
      className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl w-66 cursor-pointer">
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          scrollTo(0, 0);
        }}
        src={image_base_url+movie.backdrop_path}
        alt=""
        className="rounded-lg h-52 w-full
       object-cover object-right-bottom"
      />

      <p className="font-semibold mt-2 truncate">{movie.title}</p>
      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} •{" "}
        {movie.genres
          .slice(0, 2)
          .map((genre) => genre.name)
          .join(" | ")}{" "}
        • {timeFormat(movie.runtime)}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button onClick={()=>{navigate(`/movies/${movie._id}`); scrollTo(0,0)}} className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull
        transition rounded-full font-medium cursor-pointer"> Buy Tickets</button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
            <StarIcon className="w-4 h-4 text-primary fill-primary"/>
            {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </motion.div>
  );
};

export default MovieCard;
