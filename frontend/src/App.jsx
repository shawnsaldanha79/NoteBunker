import { useState } from "react";

function App() {
    const [count, setCount] = useState(0);
    return (
        <>
            <h1 className="text-3xl text-amber-600">Vite + React</h1>
            <div>
                <button className="bg-amber-600 text-white m-4 p-4 rounded" type="button" onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
            </div>
        </>
    );
}

export default App;
