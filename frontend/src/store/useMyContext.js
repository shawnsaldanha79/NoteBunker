import { useContext } from "react";
import ContextApi from "./ContextApi";

export const useMyContext = () => {
    const context = useContext(ContextApi);
    return context;
};
