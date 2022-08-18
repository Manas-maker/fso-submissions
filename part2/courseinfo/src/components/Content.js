import React from "react";
import Part from './Part';

const Content = ({parts}) => <div>
    {parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}/>)}
    <p style={{fontWeight: "bold"}}>total of {parts.reduce((s, p) => s + p.exercises, 0)} exercises</p></div>

export default Content