import React from 'react';
import './App.css';


export default function Square(props) {
    return(
        //shade - dark or light 
        <button className={"square " + props.shade + " " + props.highlighted}
        onClick={props.onClick}
        style={props.style}>
        </button>
    );
}
