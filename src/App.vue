<template>
    <div id="app">
        <router-view name="header"></router-view>
        <div class="main-body">
            <div class="container">
                <router-view name="side"></router-view>
                <router-view class="main" name="main"></router-view>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'app'
    }
</script>
