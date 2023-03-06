// This shows the HTML page in "ui.html".
// figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.

// figma.ui.onmessage = msg => {
//   // Handle messages sent from the UI
//   if (msg.type === 'create-pages') {
//     const pageCount = msg.pageCount;
//     const pages = [];

//     // Create pages
//     for (let i = 0; i < pageCount; i++) {
//       const pageName = `Page ${i + 1}`;
//       const page = figma.createPage();
//       page.name = pageName;
//       pages.push(page);
//     }

//     // Rename pages
//     const listItems = msg.listItems;
//     for (let i = 0; i < listItems.length; i++) {
//       const listItem = listItems[i];
//       const page = pages[i];

//       if (listItem.type === 'page') {
//         page.name = listItem.value;
//       } else if (listItem.type === 'separator') {
//         const frame = figma.createFrame();
//         frame.resize(page.width, 10);
//         frame.y = 50;
//         frame.locked = true;
//         page.appendChild(frame);
//       } else if (listItem.type === 'section') {
//         const sectionName = `------- ${listItem.value} -------`;
//         page.name = sectionName;
//       } else if (listItem.type === 'pages') {
//         page.name = listItem.value;
//       }
//     }

//     // Close plugin
//     figma.closePlugin();
//   } else if (msg.type === 'delete-pages') {
//     // Delete pages
//     const pages = figma.currentPage.children.filter(node => node.type === 'PAGE');
//     pages.forEach(page => {
//       if (!page.name.startsWith('🏁')) {
//         page.remove();
//       }
//     });

//     // Close plugin
//     figma.closePlugin();
//   }
// };

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
// Shows the HTML page in "ui.html".

// figma.showUI(__html__);

// // Handles messages sent from the UI.
// figma.ui.onmessage = msg => {
//   // Handle messages sent from the UI
//   if (msg.type === 'create-pages') {
//     const pageCount = msg.pageCount;
//     const pages = [];

//     // Create pages
//     for (let i = 0; i < pageCount; i++) {
//       const pageName = `Page ${i + 1}`;
//       const page = figma.createPage();
//       page.name = pageName;
//       pages.push(page);
//     }

//     // Close plugin
//     figma.closePlugin();
//   } else if (msg.type === 'delete-pages') {
//     // Delete pages
//     const pages = figma.currentPage.children.filter(node => node.type === 'PAGE');
//     pages.forEach(page => {
//       if (!page.name.startsWith('🏁')) {
//         page.remove();
//       }
//     });

//     // Close plugin
//     figma.closePlugin();
//   } else if (msg.type === 'add-page') {
//     // Add a new page
//     const pageName = msg.pageName;
//     const page = figma.createPage();
//     page.name = pageName;
//     figma.currentPage = page;

//     // Close plugin
//     figma.closePlugin();
//   } else if (msg.type === 'delete-page') {
//     // Delete current page
//     const currentPage = figma.currentPage;
//     if (!currentPage.name.startsWith('🏁')) {
//       currentPage.remove();
//     }
//     // Close plugin
//     figma.closePlugin();
//   }
// };

// This plugin will create and organize pages in Figma.

figma.showUI(__html__);

// Initialize the page list with one page by default
let pageList = [{ type: "page", name: "🏁 cover", editable: false }];

// Handle messages sent from the UI
figma.ui.onmessage = (msg) => {
  if (msg.type === "create-page-list") {
    const pageCount = msg.count;
    pageList = [{ type: "page", name: "🏁 cover", editable: false }];
    for (let i = 1; i <= pageCount; i++) {
      pageList.push({ type: "page", name: "Page " + i, editable: true });
    }
    figma.ui.postMessage({ type: "update-page-list", pageList: pageList });
  } else if (msg.type === "add-page") {
    pageList.push({
      type: "page",
      name: "Page " + (pageList.length - 1),
      editable: true,
    });
    figma.ui.postMessage({ type: "update-page-list", pageList: pageList });
  } else if (msg.type === "remove-page") {
    if (pageList.length > 2) {
      // Don't allow removing the cover page
      pageList.pop();
      figma.ui.postMessage({ type: "update-page-list", pageList: pageList });
    }
  } else if (msg.type === "create-pages") {
    const pages = [];
    pageList.forEach((item) => {
      if (item.type === "page") {
        const page = figma.createPage();
        page.name = item.name;
        pages.push(page);
      } else if (item.type === "separator") {
        pages.push(item);
      } else if (item.type === "section") {
        const sectionName = "------- " + item.name + " -------";
        const page = figma.createPage();
        page.name = sectionName;
        pages.push(page);
      }
    });
    figma.currentPage = pages[0];
    figma.ui.postMessage({ type: "pages-created", pages: pages });
  }
};
