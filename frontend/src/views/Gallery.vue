<template>
  <div>
    <h1>Gallery {{windowWidth}}</h1>
    <div
      class="container"
      id="gal-container"
      ref="gallery"
    >
      <h3>Align</h3>
      <p> 이제 너무 작은사진이나 큰사진 크롭하기. 추가 로딩. 마지막줄 맞추기. 작은 화면일 때 썸네일 표시 선택 가능. </p>

    </div>

  </div>
</template>

<script>
import axios from "axios";
const HOST = "http://localhost:3000";
export default {
  data: () => {
    return {
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
        this.rowMaxHeight
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
        this.rowMaxHeight,
        this.limitRatio
      );
      do {
        //반복 시작
        console.log("[Gallery.vue]", this.attachs.length);
        let rsum = 0; // 로딩할 이미지들의 비율상수의 총합
        let rowArr = []; // 로딩할 이미지들
        while (
          rsum < this.limitRatio &&
          this.fetchCount < this.attachs.length
        ) {
          // 비율상수의 총합이 제한보다 작을 때 로딩할 row에 추가
          let a = this.attachs[this.fetchCount++];
          console.log(this.fetchCount - 1, a);
          let r = a.store.w / a.store.h;

          const MIN_RATIO = 0.9;
          const MAX_RATIO = 2;
          r = r > MIN_RATIO ? r : MIN_RATIO;
          r = r < MAX_RATIO ? r : MAX_RATIO;
          a.r = r;
          rowArr.push(a);
          rsum += r;
        }

        //row div생성
        let newRow = document.createElement("div");
        let rowHeight =
          this.windowWidth / rsum < this.rowMaxHeight
            ? this.windowWidth / rsum
            : this.rowMaxHeight;
        newRow.style.height = `${rowHeight}px`;
        newRow.style.backgroundColor = "black";

        //row div에 대기중인 image element들 추가
        let rowArrCount = rowArr.length; // 이 row의 attachment 갯수
        const CDN = "https://d3ntao8dlqowm1.cloudfront.net/";

        for (let i = 0; i < rowArrCount; i++) {
          let newImg = document.createElement("img");
          let a = rowArr[i];
          newImg.src = CDN + a.store.small.key;
          newImg.style.height = `${rowHeight}px`;
          newImg.style.width = `${rowHeight * a.r}px`;
          newImg.style.objectFit = "cover";
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
    rowMaxHeight() {
      return 300;
    },
    limitRatio() {
      return this.windowWidth / this.rowMaxHeight;
    }
  }
};
</script>

<style>
</style>

