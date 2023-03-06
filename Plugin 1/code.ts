// This plugin will create pages in Figma based on user input.

// Show the HTML page in "ui.html".
figma.showUI(__html__);

// Handle messages sent from the HTML page.
figma.ui.onmessage = msg => {
  // Distinguish between different types of messages based on the "type" property.
  if (msg.type === 'create-pages') {
    const pageCount = parseInt(msg.count, 10);

    // Add a new page to the list
    const addPage = () => {
      if (pageCount < 20) {
        pageCount++;
        const li = document.createElement('li');
        const select = document.createElement('select');
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        const option3 = document.createElement('option');
        const input = document.createElement('input');
        select.addEventListener('change', () => {
          input.placeholder = `${select.value} ${pageCount}`;
          if (select.value === 'section') {
            input.value = `------- section ${pageCount} -------`;
          } else if (select.value === 'separator') {
            input.value = '---------------------------';
          } else {
            input.value = `page ${pageCount}`;
          }
        });
        option1.value = 'pages';
        option1.text = 'Page';
        option2.value = 'section';
        option2.text = 'Section';
        option3.value = 'separator';
        option3.text = 'Separator';
        select.appendChild(option1);
        select.appendChild(option2);
        select.appendChild(option3);
        input.type = 'text';
        input.placeholder = `Page ${pageCount}`;
        input.value = `page ${pageCount}`;
        if (pageCount > 1) {
          removePageButton.disabled = false;
        }
        li.appendChild(select);
        li.appendChild(input);
        pageList.appendChild(li);
        if (pageCount === 20) {
          addPageButton.disabled = true;
        }
      }
    };

    // Remove the last page from the list
    const removePage = () => {
      if (pageCount > 1) {
        pageCount--;
        pageList.removeChild(pageList.lastElementChild);
        if (pageCount === 1) {
          removePageButton.disabled = true;
        }
        if (pageCount < 20) {
          addPageButton.disabled = false;
        }
      }
    };

    // Create the pages in Figma
    const createPages = () => {
      const pages = [];
      const separator = '---------------------------';
      for (let i = 0; i < pageCount; i++) {
        const li = pageList.children[i];
        const select = li.children[0];
        const input = li.children[1];
        let pageName = input.value.trim();
        if (select.value === 'section') {
          pageName = `### ${pageName} ###`;
        } else if (select.value === 'separator') {
          pageName = separator;
        }
        const page = figma.createPage();
        page.name = pageName;
        figma.root.appendChild(page);
        pages.push(page);
      }

      figma.currentPage = pages[0];
      figma.closePlugin();
    };

    // Get references to DOM elements
        const pageList = document.getElementById('page-list');
    const addPageButton = document.getElementById('add-page');
    const removePageButton = document.getElementById('remove-page');
    const createButton = document.getElementById('create');
    const cancelButton = document.getElementById('cancel');
    const countInput = document.getElementById('count');

    // Get the current number of pages in the document
    let pageCount = figma.root.children.length;
