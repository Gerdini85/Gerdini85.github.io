const msg: string = "Hello!";
alert(msg);

const styles: Record<string, string> = {
    Pierwszy: "/style-1.css",
    Drugi: "/style-2.css",
    Trzeci: "/style-3.css",
}

let currentStyle: string = Object.keys(styles)[0];

function switchStyle(styleName: string): void {
    const oldLink = document.getElementById("dynamic-style");
    if (oldLink) {
        oldLink.remove();
    }

    const newLink = document.createElement("link");
    newLink.id = "dynamic-style";
    newLink.rel = "stylesheet";
    newLink.href = styles[styleName];

    document.head.appendChild(newLink);

    currentStyle = styleName;
    console.log("Zmieniono styl na:", styleName);
}

switchStyle(currentStyle);

function renderstyle(): void {
    const container = document.getElementById("style-switcher");
    if (!container) return;

    const linksHtml = Object.keys(styles)
        .map(name => `<a href="#" data-style="${name}" style="margin-left: 15px; color: inherit;">${name}</a>`)
        .join("");

    container.innerHTML = `<h3 style="display: flex; align-items: center; flex-wrap: wrap;">Wybierz styl: ${linksHtml}</h3>`;

    container.querySelector("h3")?.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "A") {
            e.preventDefault();
            const styleName = target.getAttribute("data-style");
            if (styleName) switchStyle(styleName);
        }
    });
}

renderstyle();
