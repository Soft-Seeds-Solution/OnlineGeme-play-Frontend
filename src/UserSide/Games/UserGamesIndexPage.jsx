import UploadedGames from "../../AdminSide/Games/UploadedGames";
import UploadGame from "../../AdminSide/Games/UploadGame";

export default function GamesIndexPage() {
    return (
        <>
            <UploadGame />
            <UploadedGames />
        </>
    )
}
