<template>
  <div>
    <h1>Gallery {{windowWidth}}</h1>
    <div
      class="container"
      id="gal-container"
      ref="gallery"
    >
      <h3>Align</h3>
      <img
        v-for="a in fetched"
        :key="a._id"
        :src="(a.store ? a.store.small : null) ? 'https://d3ntao8dlqowm1.cloudfront.net/' + a.store.small.key : null "
      />
    </div>

    {{attachs}}
  </div>
</template>

<script>
import axios from "axios";
const HOST = "http://localhost:3000";
const CDN = "https://d3ntao8dlqowm1.cloudfront.net/";
export default {
  data: () => {
    return {
      fetched: [],
      fetchCount: 0,
      attachs: [],
      rowCount: 0
    };
  },
  mounted() {
    axios.get("http://localhost:3000/images").then(res => {
      this.attachs = res.data;
      this.display();
    });
  },
  methods: {
    addRow() {
      console.log(
        "[Gallery.vue]",
        window.innerWidth,
        window.innerHeight,
        this.rowMaxWidth
      );
      let newRow = document.createElement("div");
      newRow.id = this.rowCount++;
      newRow.className = "row";
      let container = document.getElementById("gal-container");
      container.appendChild(newRow);
    },
    display() {
      console.log(
        "[Gallery.vue]",
        this.windowWidth,
        window.innerHeight,
        this.rowMaxWidth,
        this.limitRatio
      );
      do { //반복 시작
        console.log('[Gallery.vue]', this.attachs.length )
        let rsum = 0; // 로딩할 이미지들의 비율상수의 총합
        let rowArr = []; // 로딩할 이미지들
        while (
          rsum < this.limitRatio &&
           this.fetchCount < this.attachs.length
        ) {
          // 비율상수의 총합이 제한보다 작을 때 로딩할 row에 추가
          let a = this.attachs[this.fetchCount++];
          console.log(this.fetchCount-1, a);
          let r = a.store.w / a.store.h;
          rowArr.push(a);
          rsum += r;
        }

        //row div생성
        let newRow = document.createElement("div");
        let rowHeight = this.windowWidth / rsum;
        newRow.style.height = `${rowHeight}px`;
        newRow.style.backgroundColor = "black";

        //row div에 대기중인 image element들 추가
        let rowArrCount = rowArr.length; // 이 row의 attachment 갯수
        for (let i = 0; i < rowArrCount; i++) {
          let newImg = document.createElement("img");
          let a = rowArr[i];
          newImg.src = a.store.small.location;
          newImg.style.height = `${rowHeight}px`;
          newImg.style.width = "auto";
          newRow.appendChild(newImg);
        }

        //컨테이너에 row 추가
        let container = document.getElementById("gal-container");
        container.appendChild(newRow);
      } while (this.fetchCount < this.attachs.length);
    }
  },
  computed: {
    windowWidth() {
      return window.innerWidth - 30;
    },
    rowMaxWidth() {
      return 300;
    },
    limitRatio() {
      return this.windowWidth / this.rowMaxWidth;
    }
  }
};
</script>

<style>
</style>
