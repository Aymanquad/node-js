const backdrop = document.querySelector('.backdrop');
const sideDrawer = document.querySelector('.mobile-nav');
const menuToggle = document.querySelector('#side-menu-toggle');

function backdropClickHandler() {
  backdrop.style.display = 'none';
  sideDrawer.classList.remove('open');
}

function menuToggleClickHandler() {
  backdrop.style.display = 'block';
  sideDrawer.classList.add('open');
}

backdrop.addEventListener('click', backdropClickHandler);
menuToggle.addEventListener('click', menuToggleClickHandler);



// -------------------------------- hamburger stuff -------------------------------- //


const ul = document.getElementById('my_ul');
const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('side-menu-toggle');

hamburger.addEventListener('click', () => {
  menu.classList.add('active');

  const menuItems = ul.getElementsByTagName('li');

  for (let i = 0; i < menuItems.length; i++) {
    menuItems[i].style.display = 'inline-block';
    menuItems[i].style.zIndex = '100' ;
    // Add additional styling if needed, such as margin or padding
  }
});


// ----------------------------------------------------- -------------------------------- //