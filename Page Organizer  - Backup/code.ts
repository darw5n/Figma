// Creare un nuovo comando per il plugin
figma.showUI(__html__, { themeColors: true, width: 720, height: 850 });

// Verifica il numero di pagine nel documento
let pages = figma.root.children;
if (pages.length > 1) {
  // Creare array con nomi di tutte le pagine
  let pageNames = [];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    // Rimuovi eventuali caratteri speciali dal nome della pagina
    // let cleanName = page.name.replace(/[^\w\s]/gi, "");
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
    currentPage.name = formatPageName(
      pageNames[0],
      selectedOptions[0],
      selectedEmojis[0]
    );
    for (let i = 1; i < pageNames.length; i++) {
      let newPage = figma.createPage();
      newPage.name = formatPageName(
        pageNames[i],
        selectedOptions[i],
        selectedEmojis[i]
      );

      // console.log(selectedOptions[i]);
      // console.log(selectedEmojis[i]);
      // console.log(pageNames[i]);
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