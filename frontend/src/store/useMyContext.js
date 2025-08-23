import { useContext } from "react";
import { contextApi } from "./ContextApi";

export const useMyContext = () => {
    const context = useContext(contextApi);
    return context;
};
