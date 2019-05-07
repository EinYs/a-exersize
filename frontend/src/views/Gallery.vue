<template>
  <div>
    <h1>Gallery</h1>
    <img src="https://d3ntao8dlqowm1.cloudfront.net/thumbs/1557224260371.jpg" />
  </div>
</template>

<script>
const CDN = "https://d3ntao8dlqowm1.cloudfront.net/";
export default {
  props: {
    contentPoint: String,
    category: String, //rncm
    propPage: Number
  },
  mounted() {
    this.$http.get("http://localhost:3000/images").then();
  }
};
</script>

<style>
</style>
