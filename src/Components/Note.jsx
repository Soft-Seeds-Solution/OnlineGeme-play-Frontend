import { useContext } from "react"
import UserContext from "../ContextApi/UserContext"

export default function Note() {
    const { signUser } = useContext(UserContext)
    return (
        <>
            {!signUser?.role && (
                <p style={{ border: "1px solid var(--border)" }} className="text-white text-center my-4 p-2"><span className="fw-bold" style={{ color: "var(--icon-color)" }}>Note:</span> To track your activity, save your progress, and manage your favorite games, please sign up before playing. Creating an account ensures your game history and favorites are saved properly.</p>
            )}
        </>
    )
}