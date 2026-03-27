import { useEffect, useRef, useState } from "react";
import SliderContext from "./SliderContext";
import PropTypes from 'prop-types'

export default function SliderProvider({ children }) {
    
    return (
        <SliderContext.Provider value={{  }}>
            {children}
        </SliderContext.Provider>
    )
}

SliderProvider.propTypes = {
    children: PropTypes.node.isRequired
}