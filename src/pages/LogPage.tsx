import FormLogWrapper from "../components/formLogWrapper/FormLogWrapper";
import Navbar from "../components/navbar/Navbar";
import MainSectionLog from "../components/sections/MainSectionLog";
import ThemeToggleButton from "../components/themeToggleButton/themeToggleButton";

export default function LogPage() {
  return (
    <>
      <ThemeToggleButton />
      <Navbar />
      <FormLogWrapper />
      <MainSectionLog />
    </>
  );
}
