<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
                    <router-link class="navbar-brand" to="/">Board Game</router-link>
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">
                            <a href="" class="nav-link">Home</a>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/gomoku">Gomoku</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/">Connect Six</router-link>
                        </li>
                        <li class="nav-item dropdown">
                            <router-link
                                class="nav-link dropdown-toggle"
                                to = "/"
                                id="navbarDropdown"
                                role="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >More Games</router-link>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="#">Connect X</a>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        <div class="row">
        </div>
        <router-view></router-view>
    </div>
</template>
<script>

export default {
    
}
</script>