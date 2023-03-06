// Creare un nuovo comando per il plugin
figma.showUI(__html__, {width: 200, height: 100});

// Ascoltare il pulsante premuto
figma.ui.onmessage = (msg) => {
  if (msg.type === 'create-pages') {
    // Creare pagine
    let pages = [
      "Cover",
      "----------------",
      "Workspace - 🟡 In progress",
      "----------------",
      "Page 1 - 🟡 In progress",
      "----------------",
      "Page 2 - 🟡 In progress"
    ];
    let currentPage = figma.currentPage;
    currentPage.name = pages[0];

    for (let page of pages.slice(1)) {
      let newPage = figma.createPage();
      newPage.name = page;
    }

    // Selezionare la prima pagina creata
    figma.currentPage = figma.root.children[0];

    // Informare l'interfaccia utente che l'operazione è stata completata
    figma.ui.postMessage({type: 'pages-created'});
  }
};
