import { match } from "react-router";
import { CategoriesState } from "./categories/types";

export type TrackerProps = {
  match: match;
} 

export type TrackerState = {
  categories: CategoriesState;
}