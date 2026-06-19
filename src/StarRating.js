import { useState } from "react"

const containerStyle={
    display: "flex",
    alignItems: "center",
    gap: "16px",
}

const starContainerStyle={
    display: "flex",

   
}


const textStyle={
    lineHeight: "1",
     margin: "0",
}


export default function StarRating({maxRating = 5}) {
    const [rating, setRating] = useState(0);
    const [tempRating, setTempRating] = useState(0)

    function handleRating(i){
        setRating(i)
    }

    function handleHover(i){
        setTempRating(i);
    }

    return(
        <div style={containerStyle}>
            <div style={starContainerStyle}>
                {Array.from({length: maxRating},(_,i) => (
                    <Star key={i} full={tempRating ? tempRating >= i+1: rating >= i + 1} onRate={() => handleRating(i + 1)} onHoverIn={() => handleHover(i+1)} onHoverOut={() => handleHover(0)}/>
                ))}
            </div>  
            <p style={textStyle}>{tempRating || rating || ""}</p>  
        </div>
            )
}

const starStyle={
    width:"48px",
    height: "48px",
    display: "block",
    cursor: 'pointer',
}

function Star({onRate,onHoverIn,onHoverOut,full}){

return(
    <span 
    style={starStyle} 
    role='button' 
    onClick={onRate} 
    onMouseEnter={onHoverIn} 
    onMouseLeave={onHoverOut}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill={full ? "#000" : 'none'}
        stroke="#000"
        >
        <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
        />
        </svg>

    </span>
)
}