<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#"></a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/Home">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="/Add">Add Restorent</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="/About">About Restorent</a>
            </li>
            <li class="nav-item">
              <a class="nav-link active" href="#" v-on:click="logout">logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
</template>

<script>

</script>