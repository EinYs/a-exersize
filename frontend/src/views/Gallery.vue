<template>
  <div>
    <h1>Gallery</h1>
    <img src="https://d3ntao8dlqowm1.cloudfront.net/thumbs/1557224260371.jpg" />
    <div v-for="image in images" :key="image._id">
        <img :src="(image.small|{}).location"/>
    </div>
    {{images}}
  </div>
</template>

<script>
import axios from "axios";
const HOST = "http://localhost:3000";
const CDN = "https://d3ntao8dlqowm1.cloudfront.net/";
export default {
  data: () => {
    return {
      images: []
    };
  },
  mounted() {
    axios.get("http://localhost:3000/images").then(res => {
      this.images = res.data;
    });
  }
};
</script>

<style>
</style>
