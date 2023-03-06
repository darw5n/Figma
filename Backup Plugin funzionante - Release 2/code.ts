// Creare un nuovo comando per il plugin
figma.showUI(__html__, {themeColors: true, width: 720, height: 850 });

// Ascoltare il pulsante premuto
figma.ui.onmessage = (msg) => {
  if (msg.type === "create-pages") {
    const pageNames = msg.pageNames;
    const selectedOptions = msg.selectedOptions;
    const selectedEmojis = msg.selectedEmojis;

    console.log(pageNames.length);


    // Selezionare la prima pagina creata
    figma.currentPage = figma.root.children[0];

    // Rimuovere tutte le pagine esistenti
    while (figma.root.children.length > 1) {
      const page = figma.root.children[1];
      page.remove();
    }

    // Creare pagine con i nomi specificati
    let currentPage = figma.currentPage;
    currentPage.name = formatPageName(pageNames[0], selectedOptions[0], selectedEmojis[0]);
    for (let i = 1; i < pageNames.length; i++) {
      let newPage = figma.createPage();
      newPage.name = formatPageName(pageNames[i], selectedOptions[i], selectedEmojis[i]);

      console.log(selectedOptions[i]);
      console.log(selectedEmojis[i]);
      console.log(pageNames[i]);
    }

    // Selezionare la prima pagina creata
    figma.currentPage = figma.root.children[0];

    // Informare l'interfaccia utente che l'operazione è stata completata
    figma.ui.postMessage({ type: "pages-created" });
  }
};

// Formatta il nome della pagina come appropriato
function formatPageName(pageNames: string, selectedOptions: string, selectedEmojis: string) {
  if (selectedOptions === "Section") {
    return '————— ' + selectedEmojis + ' ' + pageNames + ' —————';
  } else if (selectedOptions === "Separator") {
    return '———————————————————';
  } else if (selectedOptions === "Subpage") {
    return '↳' + selectedEmojis + ' ' + pageNames;
  // } else if (pageNames === "Cover" && selectedEmojis ==="🏁") {
  //   return '🏁 Cover'
  } else {
    return selectedEmojis + ' ' + pageNames;
  }
}


