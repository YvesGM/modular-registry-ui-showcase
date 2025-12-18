function registryCardTemplate({ index, entity, typeBadges }) {
  return `
    <button onclick="openEntityDialog(${index})"
            class="entity_card transform_transition" aria-label="Open details for ${capitalize(entity.name)}">

      <h3>#${entity.id} ${capitalize(entity.name)}</h3>

      <div class="entity_image_container"
           style="background:${typeColor(entity.categories[0])}">
        <img class="entity_preview_image"
             src="${entity.previewImage}"
             alt="Entity image of ${capitalize(entity.name)}">
      </div>

      <div class="entity_types">
        ${typeBadges}
      </div>

    </button>
  `;
}

function entityTypeBadgeTemplate(typeName) {
  return `
    <span class="type_badge" style="background:${typeColor(typeName)}">
      <span class="type_label">${typeName}</span>
      <img class="type_icon" src="${typeIcon(typeName)}" alt="" aria-hidden="true">
    </span>
  `;
}

function renderFilteredList(filteredEntities) {
  let registryListRef = document.getElementById("registry-list");
  registryListRef.innerHTML = "";

  for (let i = 0; i < filteredEntities.length; i++) {
    let singleEntity = filteredEntities[i];

    let singleEntityType = singleEntity.categories
      .map(
        type => `
          <span class="type_badge" style="background:${typeColor(type)}">
            <img class="type_icon" src="${typeIcon(type)}" alt="" aria-hidden="true">
          </span>`
      )
      .join("");

    registryListRef.innerHTML += `
      <div onclick="openEntityDialog(${singleEntity.id - 1})" class="entity_card transform_transition">
        <h3>#${singleEntity.id} ${capitalize(singleEntity.name)}</h3>
        <div class="entity_image_container" style="background:${typeColor(singleEntity.categories[0])}">
          <img class="entity_preview_image" src="${singleEntity.previewImage}" alt="Entity Preview Image of ${singleEntity.name}">
        </div>
        <div>${singleEntityType}</div>
      </div>
    `;
  }
}

function renderEntityDialog(currentEntity) {
  let entityDialogWrapperRef = document.getElementById(`entity-dialog-wrapper`);
  let currentEntityType = currentEntity.categories
    .map(
      type =>
        `<span class="type_badge" style="background:${typeColor(type)}">
          <span class="type_label">${type}</span>
          <img class="type_icon" src="${typeIcon(type)}" alt="" aria-hidden="true">
        </span>`
    )
    .join("");

  entityDialogWrapperRef.innerHTML = `
    <div class="entity_dialog_id">
      <span>#${currentEntity.id}</span>
      <h3>${capitalize(currentEntity.name)}</h3>
      <span></span>
    </div>

    <div class="entity_dialog_preview_image_container" style="background:${typeColor(currentEntity.categories[0])}">
      <img class="entity_dialog_preview_image" src="${currentEntity.previewImage}" alt="Entity image of ${currentEntity.name}">
      <div class="entity_dialog_preview_image_bg_image"></div>
    </div>

    <div class="entity_dialog_nav">
      <button onclick="switchEntity(-1)" class="entity_dialog_arrow transform_transition left">◀</button>
      <div class="entity_dialog_type">${currentEntityType}</div>
      <button onclick="switchEntity(1)" class="entity_dialog_arrow transform_transition right">▶</button>
    </div>
    
    

    <div class="entity_dialog_tabs">
      <button onclick="switchTab('main', ${currentEntity.id}, this)" class="entity_dialog_single_tab transform_transition active">
        overview
      </button>

      <button onclick="switchTab('stats', ${currentEntity.id}, this)" class="entity_dialog_single_tab transform_transition">
        stats
      </button>

      <button onclick="switchTab('evo', ${currentEntity.id}, this)" class="entity_dialog_single_tab transform_transition">
        relation
      </button>

      <div id="entity-dialog-tab-underline" class="entity_dialog_tab_underline"></div>

    </div>

    <div id="entity-dialog-content" class="entity_dialog_content"></div>
    
    <button onclick="closeEntityDialog()" class="entity_dialog_close_button transform_transition" aria-label="Close details">
      X
    </button>`;

  loadTabMain(currentEntity);

  setTimeout(() => {
    let activeEntityDialogTab = document.querySelector(".entity_dialog_single_tab.active");
    moveUnderline(activeEntityDialogTab);
  }, 0);
}

function loadTabMain(currentEntity) {
  let entityDialogContentRef = document.getElementById("entity-dialog-content");
  let attributes = currentEntity.attributes.join(", ");

  entityDialogContentRef.innerHTML = `
    <div class="entity_dialog_content_tab">
      <p class="main_fact">
        <span class="main_fact_name">Height</span> 
        <span class="main_fact_value">
          : ${currentEntity.facts.height !== null ? currentEntity.facts.height / 10 + "m" : "—"}
        </span>
      </p>
      <p class="main_fact">
        <span class="main_fact_name">Weight</span>
        <span class="main_fact_value">
          : ${currentEntity.facts.weight !== null ? currentEntity.facts.weight / 10 + "kg" : "—"}
        </span>
      </p>
      <p class="main_fact">
        <span class="main_fact_name">Base Experience</span>
        <span class="main_fact_value">
          : ${currentEntity.facts.experience ?? "—"} exp
        </span>
      </p>
      <p class="main_fact">
        <span class="main_fact_name">Attributes</span>
        <span class="main_fact_value">: ${attributes}</span>
      </p>
    </div>
  `;
}

function loadTabStats(currentEntity) {
  let entityDialogContentRef = document.getElementById("entity-dialog-content");
  let entityMetric = currentEntity.metrics

  let statsHTML = entityMetric
    .map(metric => `
      <div class="stat_row">
        <span class="stat_name">${metric.name}</span>
        <div class="stat_bar">
          <div class="stat_fill" style="width:${metric.value / 2}%"></div>
        </div>
      </div>
`)
    .join("");

  entityDialogContentRef.innerHTML = `
    <div class="entity_dialog_content_tab">
      ${statsHTML}
    </div>
  `;
}

function evoTabTemplate(evoTreeHTML) {
  return `
    <div class="evo_tree">
      ${evoTreeHTML}
    </div>
  `;
}

function relationNodeTemplate({ name, previewImage, evoChildHTML, isRoot }) {
  return `
    <div class="evo_node ${isRoot ? "root" : ""}">
      
      <div class="evo_item transform_transition"
           onclick="openEntityByName('${name}')">
        <img src="${previewImage}" alt="Entity Preview Image of ${capitalize(name)}">
        <span>${capitalize(name)}</span>
      </div>

      ${evoChildHTML
      ? `<div class="evo_children">
               ${evoChildHTML}
             </div>`
      : ""
    }
    </div>
  `;
}

function relationChildWrapper(childHTML) {
  return `
    <div class="evo_child_with_arrow">
      <div class="evo_arrow">>></div>
      ${childHTML}
    </div>
  `;
}