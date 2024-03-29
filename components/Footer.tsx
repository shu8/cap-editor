import LanguageSelector from "./LanguageSelector";

export default function Footer() {
  return (
    <footer>
      <LanguageSelector />
      <a
        href="https://github.com/shu8/cap-editor"
        target="_blank"
        rel="noreferrer"
      >
        GitHub ↗
      </a>
      <a href="https://alerthub.ifrc.org/" target="_blank" rel="noreferrer">
        IFRC Alert Hub ↗
      </a>
    </footer>
  );
}
