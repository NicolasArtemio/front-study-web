
import Navbar from "../components/navbar/Navbar"
import { MainSectionHome } from "../components/sections/MainSectionHome"
import ThemeToggleButton from "../components/themeToggleButton/ThemeToggleButton"



function Home() {
    return (
        <>
            <ThemeToggleButton />
            <Navbar />
            <MainSectionHome />
        </>
    )
}

export default Home