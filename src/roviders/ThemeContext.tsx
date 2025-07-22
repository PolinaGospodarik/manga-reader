import {createContext, PropsWithChildren, useState} from "react";
import {TContext} from "@/types/types";

export const themeContext = createContext<TContext>(["", () => {}]);

const ThemeContext = ({children}: PropsWithChildren<{}>) => {
    const [color, setColor] = useState("dark");
    return (
        <div>
            <themeContext.Provider value={[color, setColor]}>
                {children}
            </themeContext.Provider>
        </div>
    );
};

export default ThemeContext;