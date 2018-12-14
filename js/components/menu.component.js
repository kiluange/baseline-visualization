export const MenuBar = Vue.component('menu-bar', {
  template: `<!-- Just an image -->
    <nav class="navbar navbar-light bg-light">
      <a class="navbar-brand" href="#">
      <img src="img/fiocruz.png" height="30" alt=""/>      
      <img src="img/cidacs.png" height="30" alt="">
      </a>
      <ul class="nav">
  <li class="nav-item">
  <router-link class="nav-link" to="/inicio">Início</router-link>
  </li>
  <li class="nav-item">
  <router-link class="nav-link" to="/metadados">Metadados</router-link>
  </li>
  <li class="nav-item dropdown">
  <router-link class="nav-link dropdown-toggle" data-toggle="dropdown" to="/dashboard">Dashboard</router-link>
  <div class="dropdown-menu dropdown-menu-right">
      <router-link class="dropdown-item" to="/metadados">Metadados</router-link>
      <router-link class="dropdown-item" to="/metadados">Metadados</router-link>
      <router-link class="dropdown-item" to="/metadados">Metadados</router-link>
    </div>
  </li>
</ul>
    </nav>`,
});