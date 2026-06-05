/**
 * Scroll to a DOM section by id, or fall back to switching the active tab.
 *
 * @param {string} sectionId - The DOM element id to scroll to.
 * @param {function} setActiveTab - State setter for the active tab.
 * @param {string} tabId - The tab id to activate if the section isn't found in the DOM.
 */
export function scrollToSectionOrTab(sectionId, setActiveTab, tabId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' });
  } else {
    setActiveTab(tabId);
  }
}
