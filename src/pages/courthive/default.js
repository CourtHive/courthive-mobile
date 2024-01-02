import chLogo from "../../assets/images/courthive-transparent-logo.png";
import "../../styles/default.css";
export function renderDefaultPage(display) {
    if (display) {
        document.querySelector("#app").innerHTML = `
  <div>
    <a href="https://courthive.com" target="_blank">
      <img src="${chLogo}" class="logo" alt="Vite logo" />
    </a>
    <h1 class="name">CourtHive</h1>
  </div>
`;
    }
}
