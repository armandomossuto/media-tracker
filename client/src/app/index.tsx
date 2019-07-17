import * as React from "react";
import * as ReactDOM from "react-dom";

export interface IndexProps { compiler: string; framework: string; }

export const Index = (props: IndexProps) => <h1 className="test">Hello from {props.compiler} and {props.framework}!</h1>;