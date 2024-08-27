<template>
    <div class="container">
        <a href="/"><button class="tab" @click="LogOut()"> <i class="fa fa-sign-out"></i> LogOut</button></a>
    </div>
</template>

<script>
export default{
    methods: {
        LogOut() {
            localStorage.removeItem('user-info');
            this.$router.push({
                name: 'Login'
            });
        },
    }
}
</script>

<style>
</style>