let COMPLETE_REGISTRY = [];
let RELATION_CHAIN = [];

function typeColor(type) {
  let colors = {
    normal: "#A8A899",
    fighting: "#A84C3D",
    flying: "#87B5E5",
    poison: "#864AB8",
    ground: "#956833",
    rock: "#A8995B",
    bug: "#83AD25",
    ghost: "#633C64",
    steel: "#9999A8",
    fire: "#E53B19",
    water: "#278BCC",
    grass: "#58A951",
    electric: "#E5C600",
    psychic: "#E55973",
    ice: "#68BAAC",
    dragon: "#4D64AB",
    fairy: "#D480CF",
  };
  return colors[type] || "#A8A899";
}

// optional: if you want to add type icons
// also: make sure to add the corresponding images in the assets/img/ folder
// also: update the paths below accordingly
// also: edited the templates to include the icons in templates.js
function typeIcon(type) {
  let colors = {
    normal: "../assets/img/#.png",
    fighting: "../assets/img/#.png",
    flying: "../assets/img/#.png",
    poison: "../assets/img/#.png",
    ground: "../assets/img/#.png",
    rock: "../assets/img/#.png",
    bug: "../assets/img/#.png",
    ghost: "../assets/img/#.png",
    steel: "../assets/img/#.png",
    fire: "../assets/img/#.png",
    water: "../assets/img/#.png",
    grass: "../assets/img/#.png",
    electric: "../assets/img/#.png",
    psychic: "../assets/img/#.png",
    ice: "../assets/img/#.png",
    dragon: "../assets/img/#.png",
    fairy: "../assets/img/#.png",
  };
  return colors[type] || "#A8A899";
}