function capitalize(entityName) {
  if (!entityName) return "";
  return entityName.charAt(0).toUpperCase() + entityName.slice(1).toLowerCase();
}

function toggleLoadMoreButton(show) {
  let loadMoreButtonRef = document.getElementById("load-more-entities-button");
  if (!loadMoreButtonRef) return;

  loadMoreButtonRef.style.display = show ? "block" : "none";
}

// Templates 
function buildRegistryHTML(startIndex) {
  let htmlBuffer = "";

  for (let i = startIndex; i < COMPLETE_REGISTRY.length; i++) {
    let entity = COMPLETE_REGISTRY[i];

    let typeBadges = entity.categories
      .map(type => entityTypeBadgeTemplate(type))
      .join("");

    htmlBuffer += registryCardTemplate({
      index: i,
      entity,
      typeBadges
    });
  }

  return htmlBuffer;
}

function normalizeEntity(apiEntity) {
  return {
    id: apiEntity.id,
    name: apiEntity.name,

    previewImage:
      apiEntity.sprites?.other?.["official-artwork"]?.front_default ||
      apiEntity.sprites?.front_default ||
      "",

    categories: apiEntity.types?.map(t => t.type.name) || [],

    metrics: apiEntity.stats?.map(stat => ({
      name: stat.stat.name,
      value: stat.base_stat
    })) || [],

    attributes: apiEntity.abilities?.map(a => a.ability.name) || [],

    facts: {
      height: apiEntity.height ?? null,
      weight: apiEntity.weight ?? null,
      experience: apiEntity.base_experience ?? null
    },

    relations: {
      relationUrl: apiEntity.species?.url || null
    },

    raw: apiEntity
  };
}

// Search
function filterRegistry() {
  let inputRef = document.getElementById("searching-input");
  let hintRef = document.getElementById("search-hint");
  let registryListRef = document.getElementById("registry-list");

  let searchValue = inputRef.value.toLowerCase().trim();

  if (handleEmptySearch(searchValue, hintRef, registryListRef)) return;
  if (handleShortSearch(searchValue, hintRef)) return;

  toggleLoadMoreButton(false);

  let filteredEntities = getFilteredEntities(searchValue);

  if (handleNoResults(filteredEntities, registryListRef)) return;

  renderFilteredList(filteredEntities);
}

function getFilteredEntities(searchValue) {
  return COMPLETE_REGISTRY.filter(entity => {
    let name = entity.name.toLowerCase();
    let types = entity.categories.map(type => type.toLowerCase());

    return (
      name.includes(searchValue) ||
      types.some(t => t.includes(searchValue))
    );
  });
}

function handleEmptySearch(value, hintRef, listRef) {
  if (value.length !== 0) return false;

  hintRef.textContent = "";
  listRef.innerHTML = "";

  toggleLoadMoreButton(offset < maxEntities);
  renderRegistryList();

  return true;
}

function handleShortSearch(value, hintRef) {
  if (value.length >= 3) return false;

  hintRef.textContent = "Enter at least 3 characters to search…";
  return true;
}

function handleNoResults(filteredEntities, listRef) {
  if (filteredEntities.length > 0) return false;

  listRef.innerHTML = `<p class="no_results">No matching entities found.</p>`;
  return true;
}

// Dialog
function openEntityDialog(i) {
  let entityDialogRef = document.getElementById(`entity-dialog`);
  entityDialogRef.focus();
  entityDialogRef.style.display = "flex";
  entityDialogRef.showModal();

  renderEntityDialog(COMPLETE_REGISTRY[i]);
  entityDialogBackdropClose();

  entityDialogRef.classList.add("active");
}

function switchEntity(direction) {
  let currentEntity = document.querySelector(".entity_dialog_id span").textContent.replace("#", "");
  currentEntity = parseInt(currentEntity);

  let newEntity = currentEntity - 1 + direction;

  if (newEntity < 0 || newEntity >= COMPLETE_REGISTRY.length) return;

  renderEntityDialog(COMPLETE_REGISTRY[newEntity]);
}

function switchTab(tabName, entityId, currentTab) {
  let singleTabRef = document.querySelectorAll(".entity_dialog_single_tab");
  let currentEntity = COMPLETE_REGISTRY.find(p => p.id === entityId);
  singleTabRef.forEach(entityDialogTabs => {
    entityDialogTabs.classList.remove("active"),
      entityDialogTabs.style.background = "transparent"
  },);
  currentTab.classList.add("active");
  currentTab.style.background = "rgba(255,255,255,0.06)";
  moveUnderline(currentTab);

  if (tabName === "main") loadTabMain(currentEntity);
  if (tabName === "stats") loadTabStats(currentEntity);
  if (tabName === "evo") loadTabEvo(currentEntity);
}

function moveUnderline(activeEntityDialogTab) {
  let entityDialogTabBar = document.getElementById("entity-dialog-tab-underline");
  entityDialogTabBar.style.width = activeEntityDialogTab.offsetWidth + "px";
  entityDialogTabBar.style.left = activeEntityDialogTab.offsetLeft + "px";
}

function renderRelationNode(node, isRoot = false) {
  let entity = COMPLETE_REGISTRY.find(p => p.name === node.name);
  let previewImage = entity?.previewImage || "";
  let evoChildHTML = buildRelationChildren(node.evolvesTo);

  return relationNodeTemplate({
    name: node.name,
    previewImage,
    evoChildHTML,
    isRoot
  });
}

function buildRelationChildren(evolvesTo) {
  if (!Array.isArray(evolvesTo) || evolvesTo.length === 0) return "";

  return evolvesTo
    .map(child =>
      relationChildWrapper(
        renderRelationNode(child)
      )
    )
    .join("");
}

function parseRelationTree(chain) {
  return {
    name: chain.species.name,
    evolvesTo: chain.evolves_to.map(evo => parseRelationTree(evo))
  };
}

function openEntityByName(name) {
  let entity = COMPLETE_REGISTRY.find(p => p.name === name);
  if (!entity) return;

  renderEntityDialog(entity);
}

function closeEntityDialog() {
  let entityDialogRef = document.getElementById(`entity-dialog`);
  entityDialogRef.classList.add("closed");
  entityDialogRef.close();

  setTimeout(() => {
    entityDialogRef.style.display = "none";
    entityDialogRef.classList.remove("active");
    entityDialogRef.classList.remove("closed");
  }, 300);

}

function entityDialogBackdropClose() {
  let entityDialogRef = document.getElementById(`entity-dialog`);
  entityDialogRef.addEventListener("click", (e) => {
    if (e.target === entityDialogRef) {
      closeEntityDialog();
    }
  })
};