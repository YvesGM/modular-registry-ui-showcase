let limit = 40;
let offset = 0;
let maxEntities = 151;
let loading = false;

async function renderRegistryList() {
  let globalLoader = document.getElementById("global-loader");
  let registryListRef = document.getElementById("registry-list");

  globalLoader.classList.remove("hidden");

  await loadRegistry();

  let startIndex = registryListRef.childElementCount;
  let htmlBuffer = buildRegistryHTML(startIndex);

  registryListRef.insertAdjacentHTML("beforeend", htmlBuffer);

  globalLoader.classList.add("hidden");

  if (offset < maxEntities) {
    toggleLoadMoreButton(true);
  } else {
    toggleLoadMoreButton(false);
  }

  if (offset >= maxEntities && COMPLETE_REGISTRY.length >= maxEntities) return;
}

async function loadRegistry() {
  if (loading) return;

  if (offset >= maxEntities) return;
  loading = true;

  let remaining = maxEntities - offset;
  let effectiveLimit = Math.min(limit, remaining);

  let batch = await fetchEntitiesBatch(effectiveLimit);
  await loadEntitiesDetails(batch);

  offset += effectiveLimit;
  loading = false;
}

async function fetchEntitiesBatch(limit) {
  let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  let response = await fetch(url);
  let data = await response.json();
  return data.results;
}

async function loadEntitiesDetails(batch) {
  for (let pok of batch) {
    let details = await fetch(pok.url).then(res => res.json());
    COMPLETE_REGISTRY.push(normalizeEntity(details));
  }
}

async function loadTabEvo(currentEntity) {
  let dialogLoader = document.getElementById("dialog-loader");
  let entityContentRef = document.getElementById("entity-dialog-content");

  dialogLoader.classList.remove("hidden");

  let evoTree = await getRelationData(currentEntity);

  await preloadRelationEntities(evoTree);

  let evoHTML = renderRelationNode(evoTree, true);

  entityContentRef.innerHTML = evoTabTemplate(evoHTML);

  dialogLoader.classList.add("hidden");
}

async function getRelationData(currentEntity) {
  if (!currentEntity.relations?.relationUrl) return null;

  let species = await fetch(currentEntity.relations.relationUrl).then(res => res.json());
  let evoData = await fetch(species.evolution_chain.url).then(res => res.json());
  return parseRelationTree(evoData.chain);
}

async function preloadRelationEntities(node) {
  await getEntitiesByName(node.name);

  for (let child of node.evolvesTo) {
    await preloadRelationEntities(child);
  }
}

async function getEntitiesByName(name) {
  let existingEntitiesData = COMPLETE_REGISTRY.find(p => p.name === name);
  if (existingEntitiesData) return existingEntitiesData;

  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  let addedEntityData = await response.json();

  COMPLETE_REGISTRY.push(normalizeEntity(addedEntityData));
  return addedEntityData;
}
