<template>
  <div>
    <h1>Gallery {{windowWidth}}</h1>
    <div
      class="container"
      id="gal-container"
      ref="gallery"
    >
      <p> 개발예정 : 추가 로딩. 작은 화면일 때 썸네일 표시 선택 가능. </p>

    </div>

  </div>
</template>

<script>
import axios from "axios";
const HOST = "http://localhost:3000";
export default {
  data: () => {
    return {
      displayCount: 0,
      attachs: [],
      rowCount: 0,
      lastRow: []
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
      newRow.id = ++this.rowCount;
      newRow.className = "row";
      let container = document.getElementById("gal-container");
      container.appendChild(newRow);
    },
    display() {
        if(this.rowCount === 0){
            console.log('Page Init')
        }
      console.log(
        "[Gallery.vue]",
        this.windowWidth,
        window.innerHeight,
        this.rowMaxHeight,
        this.limitRatio
      );
      do {
        //반복 시작
        //이 루프 한 번이 row 한 개를 만든다.
        console.log("[Gallery.vue]", this.attachs.length);
        let rsum = 0; // row의 템들 각각의 비율(가로/세로) r 의 총합
        let rowArr = []; // row에 들어간 템들

        while (
          rsum < this.limitRatio &&
          this.displayCount < this.attachs.length
        ) {
          //이 루프 한 번이 row에 아이템 하나를 추가한다.
          // row의 템들 각각의 r 을 다 더한 것이 제한 limitRatio 보다 작을 때 로딩할 row에 새로 하나를 추가
          // r 이 크면 가로로 엄청긴거다.
          let a = this.attachs[this.displayCount++];
          let r = a.store.w / a.store.h;

          //최대비율과 최소비율 설정.. 너무 납작해지지 않게
          const MIN_RATIO = 0.9;
          const MAX_RATIO = 2;
          r = r > MIN_RATIO ? r : MIN_RATIO;
          r = r < MAX_RATIO ? r : MAX_RATIO;
          a.r = r;

          //row에 템을 푸쉬
          rowArr.push(a);
          rsum += r;
        }

        //row div생성
        let newRow = document.createElement("div");
        newRow.id = ++this.rowCount;
        newRow.className = "row";

        //최대높이보정
        let rowHeight =
          this.windowWidth / rsum < this.rowMaxHeight
            ? this.windowWidth / rsum
            : this.rowMaxHeight;

        //최소높이보정
        if (rowHeight < 150) {
          //너무 낮은 높이를 키워줄 것이다... 그럼 가로/세로 = r 값은 원래보다 줄어들겠지..
          rowHeight = 150;

          let fixedRatio = this.windowWidth / rowHeight;
          let diff = rsum - fixedRatio;
          //원래보다 얼마나 줄어들었을까 diff를 구해보자..

          //이 이상으로는 안 줄어들 베이스 = (새로 fix된 r값 / 갯수) 또는 (row에서 가장 작은 r값)
          //row 가 한 장이라면... fixedRatio = base = 새로운 r 값이어야 한다...
          let ratioArr = rowArr.map(a => {
            return a.r;
          });
          let base =
            fixedRatio / rowArr.length < Math.min.apply(null, ratioArr)
              ? fixedRatio / rowArr.length
              : Math.min.apply(null, ratioArr); // 마진을 구하기 위한 베이스

          // 얼마나 줄일 수 있을까 마진토탈을 구해보자... 한 장이라면 diff 값과 같다..
          let marginTotal = 0;
          for (let i = 0; i < rowArr.length; i++) {
            marginTotal += rowArr[i].r - base;
          }

          //짜잔 템들에 새로운 r값을 준다
          for (let i = 0; i < rowArr.length; i++) {
            let margin = rowArr[i].r - base;
            rowArr[i].r = rowArr[i].r - (diff * margin) / marginTotal;
          }
          /*
            console.log('[Gallery.vue] minHeight fix : ', fixedRatio, rsum, diff, rowArr, ratioArr,Math.min.apply(null, ratioArr), base, marginTotal)

            for(let i=0; i< rowArr.length ; i++ ){
                let my = rowArr[i].r
                let mymargin = my - base
                my = my - ( diff * mymargin / marginTotal )
            }
            */
        }
        newRow.style.height = `${rowHeight}px`;

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
          newImg.style.padding = "4px";
          newImg.style.boxSizing = "border-box"
          newRow.appendChild(newImg);
        }

        //컨테이너에 row 추가
        let container = document.getElementById("gal-container");
        container.appendChild(newRow);

        //마지막줄이면 나중에 이어서 패치하기 위해 따로 저장해둠.
        if(this.displayCount === this.attachs.length){
            this.lastRow = rowArr
        }

      } while (this.displayCount < this.attachs.length);
      console.log('row count : ', this.rowCount, this.lastRow)
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

