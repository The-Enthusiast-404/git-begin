import React from "react";
import { Globe } from "lucide-react";

function ChangeLanguage() {
    
    return (
            <div>
                <Globe 
                className="h-[1.2rem] w-[1.2rem] transition-opacity duration-300 opacity-100 border-none outline-none" 
                //onClick={}
                /> 
            </div>
        
    );
}

export default ChangeLanguage;
