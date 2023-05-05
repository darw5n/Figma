// Creare un nuovo comando per il plugin
figma.showUI(__html__, { themeColors: true, width: 720, height: 850 });

/// Verifica il numero di pagine nel documento
let pages = figma.root.children;
if (pages.length > 1) {
  // Creare array con nomi di tutte le pagine
  let pageNames = [];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    let cleanName = page.name;
    cleanName = cleanName.trim(); // Rimuovi eventuali spazi all'inizio e alla fine del nome

    // Aggiungere il nome della pagina all'array
    if(i === 0){
      pageNames.push('cover'); // assegna il nome 'cover' al primo elemento
    } else {
      pageNames.push(cleanName);
    }
  }
  // Invia i dati all'interfaccia utente
  figma.ui.postMessage({
    type: "update-page-names",
    data: { pageCount: pages.length, pageNames: pageNames },
  });
}

// Ascoltare il pulsante premuto
figma.ui.onmessage = (msg) => {
  if (msg.type === "create-pages") {
    const pageNames = msg.pageNames;
    const selectedOptions = msg.selectedOptions;
    const selectedEmojis = msg.selectedEmojis;
    const newPageCount = msg.newPageCount;

    // Selezionare la prima pagina creata
    figma.currentPage = figma.root.children[0];

    // Eliminare le pagine esistenti in eccesso
    if (newPageCount < pages.length) {
      while (figma.root.children.length > newPageCount) {
        const page = figma.root.children[figma.root.children.length - 1];
        page.remove();
      }
    }

    // Rinominare le pagine esistenti se il nuovo numero di pagine è superiore a quello attuale
    if (newPageCount > pages.length) {
      for (let i = pages.length; i < newPageCount; i++) {
        let newPage = figma.createPage();
        newPage.name = formatPageName(
          pageNames[i],
          selectedOptions[i],
          selectedEmojis[i]
        );
      }
    }

    // Rinominare tutte le pagine
    for (let i = 0; i < figma.root.children.length; i++) {
      let page = figma.root.children[i];
      page.name = formatPageName(
        pageNames[i],
        selectedOptions[i],
        selectedEmojis[i]
      );
    }

    // Selezionare la prima pagina creata
    figma.currentPage = figma.root.children[0];

    // Informare l'interfaccia utente che l'operazione è stata completata
    figma.ui.postMessage({ type: "pages-created" });
  }
};


// Formatta il nome della pagina come appropriato
function formatPageName(
  pageNames: string,
  selectedOptions: string,
  selectedEmojis: string
) {
  if (selectedOptions === "Section") {
    if (pageNames.trim().length == 0) {
      if (selectedEmojis.trim().length == 0) {
        return "—————  Section   —————";
      } else return "—————  " + selectedEmojis + "  " + "Section" ;
    } else if (selectedEmojis.trim().length == 0) {
      return"—————  " + pageNames + "  —————";
    } else return "—————  " + selectedEmojis + " " + pageNames + "  —————";
  } else if (selectedOptions === "Separator") {
    return "———————————————————";
  } else if (selectedOptions === "Subpage") {
    if (pageNames.trim().length == 0) {
      if (selectedEmojis.trim().length == 0) {
        return "↳ Subpage";
      } else return "↳" + " " +selectedEmojis + "  " + "Subpage";
    } else if (selectedEmojis.trim().length == 0) {
      return "↳" + " " + pageNames;
    } else return "↳" + " " + selectedEmojis + "  " + pageNames;
  } else {
    //pages
    if (pageNames.trim().length == 0) {
      if (selectedEmojis.trim().length == 0) {
        return "Page";
      } else return selectedEmojis + "  " + "Page";
    } else if (selectedEmojis.trim().length == 0) {
      return pageNames;
    } else return selectedEmojis + "  " + pageNames;
  }
}



