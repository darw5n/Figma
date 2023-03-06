// Creare un nuovo comando per il plugin
figma.showUI(__html__, {themeColors: true, width: 650, height: 800 });

// Ascoltare il pulsante premuto
figma.ui.onmessage = (msg) => {
  if (msg.type === "create-pages") {
    const pageNames = msg.pageNames;

    // Selezionare la prima pagina creata
    figma.currentPage = figma.root.children[0];

    // Rimuovere tutte le pagine esistenti
    while (figma.root.children.length > 1) {
      const page = figma.root.children[1];
      page.remove();
    }

    // Creare pagine con i nomi specificati
    let currentPage = figma.currentPage;
    currentPage.name = formatPageName(pageNames[0]);
    for (let i = 1; i < pageNames.length; i++) {
      let newPage = figma.createPage();
      newPage.name = formatPageName(pageNames[i]);
    }

    // Selezionare la prima pagina creata
    figma.currentPage = figma.root.children[0];

    // Informare l'interfaccia utente che l'operazione è stata completata
    figma.ui.postMessage({ type: "pages-created" });
  }
};

// Formatta il nome della pagina come appropriato
function formatPageName(pageName) {
  if (pageName.startsWith("--  ") && pageName.endsWith("  --")) {
    return '-----------' + pageName + '-----------';
  } else if (pageName === "---------------------------") {
    return pageName;
  } else {
    return pageName;
  }
}
