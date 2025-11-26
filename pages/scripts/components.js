class HeaderComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <header>
            <div id="headerNavigation">
                <a href="index.html" class="nav-button" id="header-nav-home">Home</a>
                <a href="messages.html" class="nav-button" id="header-nav-messages">Messages</a>
                <a href="about.html" class="nav-button" id="header-nav-about">About</a>
            </div>
        </header>
    `;
    }
}

class FooterComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer>
            <div id="footerHackerNoonAttribution">
                <img src="icons/info-circle.svg" alt="info" class="filterWhite" width="24px"/>
                <div>Icons from <a href="https://pixeliconlibrary.com/" target="_blank" class="highlight-nav-button">Pixel Icon Library</a> by <a href="https://hackernoon.com/" target="_blank" class="highlight-nav-button">HackerNoon</a></div>
            </div>
            <div id="footerSocialIcons">
                <div>CesarZ</div>
                <a href="https://x.com/zcesarrr" target="_blank"><img src="icons/twitter.svg" alt="twitter" class="filterWhite" width="28px"/></a>
                <a href="https://github.com/zcesarrr" target="_blank"><img src="icons/github.svg" alt="github" class="filterWhite" width="28px"/></a>
            </div>
        </footer>
    `;
    }
}

customElements.define("header-component", HeaderComponent);
customElements.define("footer-component", FooterComponent);