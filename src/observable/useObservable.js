import { useState, useEffect } from "react";

export const useObservable = (observable, defaultValue) => {
    const [state, setState] = useState(defaultValue);

    useEffect(() => {
        const sub = observable.subscribe(setState);
        return () => sub.unsubscribe();
    }, [observable]);

    return state;
};