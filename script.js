function initRegistry() {
  document.getElementById("searching-input").addEventListener("input", filterRegistry);
  renderRegistryList();
}