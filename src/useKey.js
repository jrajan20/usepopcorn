import {useEffect} from "react";

export function useKey(key, action){

    useEffect(function(){
    
        function elCallBack(e){
          if(e.code.toLowerCase()=== key.toLowerCase()){
              action();
             
            }
    
          }
          document.addEventListener('keydown', elCallBack)
          
    
          return function(){
            document.removeEventListener('keydown',elCallBack)
          }
    
        }
      ,[action, key]);

}