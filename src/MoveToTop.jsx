import { useEffect } from "react";
import { useLocation } from "react-router-dom"

export default function MoveToTop() {
    const { pathname } = useLocation()
    useEffect(() => {
        if (pathname) {
            document.documentElement.scrollTop = 0;
        }
    }, [pathname]);

    return null;
}
