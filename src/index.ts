
function main() {

  const header = document.getElementById("header");

  if (header) {
    console.log('header found');
    header.textContent = "test successful";
  }

  console.log("TypeScript loaded");
}

function setup() {
  // setup
  console.log('setup');
  console.warn('setup');
  // update world state
  // request plan
  // run plan
}

main();