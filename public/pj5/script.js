/* ==========================================================
   Algorithms Visualizer + Generative Divide & Conquer Art
   p5.js (Next.js/Nextra 埋め込み用)
   ----------------------------------------------------------
   モード:
   1: Binary Search
   2: QuickSort
   3: Merge Sort           (placeholder)
   4: BFS / DFS (toggle B)
   5: Dijkstra             (placeholder)
   6: A*                   (placeholder)
   7: Kruskal              (placeholder)
   8: KMP                  (placeholder)
   9: FFT                  (placeholder)
   0: Gradient Descent     (placeholder)
   L: Life (Conway)
   D: Generative Divide & Conquer Art   ← 追加モード
   H: Help ON/OFF   R: Reset current
   ========================================================== */

   let app; // アプリ本体

   // ---------------- App ステート ----------------
   class App {
     constructor() {
       this.mode = '1';
       this.showHelp = true;
       this.viz = null;
       this.resetMode();
     }
     resetMode() {
       switch (this.mode) {
         case '1': this.viz = new BinarySearchViz(); break;
         case '2': this.viz = new QuickSortViz(); break;
         case '3': this.viz = new PlaceholderViz('Merge Sort'); break;
         case '4': this.viz = new GraphSearchViz(); break;
         case '5': this.viz = new PlaceholderViz('Dijkstra'); break;
         case '6': this.viz = new PlaceholderViz('A*'); break;
         case '7': this.viz = new PlaceholderViz('Kruskal'); break;
         case '8': this.viz = new PlaceholderViz('KMP'); break;
         case '9': this.viz = new PlaceholderViz('FFT'); break;
         case '0': this.viz = new PlaceholderViz('Gradient Descent'); break;
         case 'L': this.viz = new LifeViz(); break;
         case 'D': this.viz = new GenerativeDivideViz(); break; // 追加
         default:  this.viz = new PlaceholderViz('Unknown'); break;
       }
     }
     update()  { if (this.viz?.update) this.viz.update(); }
     render()  { if (this.viz?.render) this.viz.render(); if (this.showHelp) drawHelpOverlay(this.mode); }
     keyPressed(k) {
       // グローバルなモード切替
       if (k === 'H' || k === 'h') { this.showHelp = !this.showHelp; return; }
       if (k === 'R' || k === 'r') { this.resetMode(); return; }
       const selectable = '1234567890LD';
       if (selectable.includes(k)) { this.mode = k; this.resetMode(); return; }
       // それ以外は viz 個別へ委譲
       if (this.viz?.keyPressed) this.viz.keyPressed(k);
     }
     mousePressed(){ if (this.viz?.mousePressed) this.viz.mousePressed(); }
     mouseDragged(){ if (this.viz?.mouseDragged) this.viz.mouseDragged(); }
     mouseReleased(){ if (this.viz?.mouseReleased) this.viz.mouseReleased(); }
     mouseWheel(e){ if (this.viz?.mouseWheel) return this.viz.mouseWheel(e); return false; }
   }
   
   // ---------------- 共有ユーティリティ ----------------
   function mountCanvas() {
     const holder = document.getElementById('canvas-holder');
     const w = holder.clientWidth;
     const h = Math.round(w * 0.62); // 16:10 くらい
     const cnv = createCanvas(w, h);
     cnv.parent(holder);
     pixelDensity(window.devicePixelRatio || 1);
   }
   function windowResized() {
     const holder = document.getElementById('canvas-holder');
     const w = holder.clientWidth;
     const h = Math.round(w * 0.62);
     resizeCanvas(w, h);
     if (app?.viz?.onResize) app.viz.onResize();
   }
   function drawHelpOverlay(mode) {
     push();
     noStroke();
     fill(0,0,0,160);
     rect(0, 0, width, 84);
     fill(0,0,100);
     textSize(14); textAlign(LEFT, CENTER);
     const names = {
       '1':'Binary Search','2':'QuickSort','3':'MergeSort*','4':'BFS/DFS',
       '5':'Dijkstra*','6':'A**','7':'Kruskal*','8':'KMP*','9':'FFT*','0':'GradDescent*',
       'L':'Life','D':'Generative Divide Art'
     };
     const title = names[mode] || 'Unknown';
     text(`Mode: ${title}   |   1..0, L, D to switch   |   H: help  R: reset`, 12, 24);
     if (mode === '4') text(`BFS/DFS: 'B' toggle`, 12, 52);
     if (mode === 'L') text(`Life: SPACE play/pause, C clear, G glider, [ ] brush, ↑/↓ speed, S step`, 12, 52);
     if (mode === 'D') text(`Divide Art: M=KD/Quad  P=palette  I=img-driven  C=avg-color  [ ] depth  A=animate  D=autoDepth  G=gutter  O=outline  H=pattern  0=reset view`, 12, 52);
     pop();
   }
   
   // ---------------- p5 ライフサイクル ----------------
   function setup() {
     colorMode(HSB, 360, 100, 100, 100);
     textFont('Menlo, ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace');
     mountCanvas();
     app = new App();
     frameRate(30);
   }
   function draw() {
     background(0, 0, 10);  // #0e0e12 近辺
     app.update();
     app.render();
   }
   function keyPressed()  { app.keyPressed(key); }
   function mousePressed(){ app.mousePressed(); }
   function mouseDragged(){ app.mouseDragged(); }
   function mouseReleased(){ app.mouseReleased(); }
   function mouseWheel(e)  { return app.mouseWheel(e); }
   
   // =====================================================
   // 1) Binary Search
   // =====================================================
   class BinarySearchViz {
     constructor() {
       this.n = 80;
       this.a = Array.from({length:this.n}, (_,i)=> i*2 + (random()<0.5?0:1));
       this.target = random(this.a);
       this.lo = 0; this.hi = this.n-1; this.mid = -1;
       this.found = false; this.done = false;
     }
     update(){
       if (this.done) return;
       if (this.lo > this.hi){ this.done = true; return; }
       this.mid = this.lo + ((this.hi - this.lo) >> 1);
       if (this.a[this.mid] === this.target){ this.found = true; this.done = true; }
       else if (this.a[this.mid] < this.target) this.lo = this.mid + 1;
       else this.hi = this.mid - 1;
     }
     render(){
       const w = width / this.n;
       for (let i=0;i<this.n;i++){
         const h = map(this.a[i], this.a[0], this.a[this.n-1], 10, height*0.6);
         let c = color(210, 60, 86);
         if (i===this.mid) c = color(45, 100, 100);
         if (i>=this.lo && i<=this.hi) c = lerpColor(c, color(130,80,100), .35);
         if (this.found && i===this.mid) c = color(140, 100, 100);
         noStroke(); fill(c); rect(i*w, height-h-60, w-2, h);
       }
       fill(0,0,90); textAlign(LEFT, BOTTOM);
       text(`target=${this.target}  lo=${this.lo} hi=${this.hi} mid=${this.mid}${this.found?'  FOUND':''}`, 12, height-16);
     }
   }
   
   // =====================================================
   // 2) QuickSort (iterative partition steps)
   // =====================================================
   class QuickSortViz{
     constructor(){
       this.n=120;
       this.a = Array.from({length:this.n}, ()=> floor(random(5, height-120)));
       this.stack = [[0,this.n-1]];
       this.i=-1; this.j=-1; this.pivot=-1; this.l=-1; this.r=-1;
       this.partActive=false;
     }
     update(){
       if (this.partActive){
         if (this.i <= this.j){
           while(this.a[this.i] < this.pivot) this.i++;
           while(this.a[this.j] > this.pivot) this.j--;
           if (this.i <= this.j){
             [this.a[this.i], this.a[this.j]] = [this.a[this.j], this.a[this.i]];
             this.i++; this.j--;
           }
         } else {
           if (this.l < this.j) this.stack.push([this.l, this.j]);
           if (this.i < this.r) this.stack.push([this.i, this.r]);
           this.partActive = false;
         }
       } else if (this.stack.length){
         [this.l, this.r] = this.stack.pop();
         if (this.l >= this.r) return;
         this.pivot = this.a[(this.l+this.r)>>1]; this.i=this.l; this.j=this.r; this.partActive=true;
       }
     }
     render(){
       const w = width/this.n;
       for (let k=0;k<this.n;k++){
         noStroke();
         if (this.partActive && k>=this.l && k<=this.r) fill(200,80,100); else fill(220,0,85);
         if (this.partActive && k===this.i) fill(45,100,100);
         if (this.partActive && k===this.j) fill(0,100,100);
         if (this.partActive && this.a[k]===this.pivot) fill(140,100,100);
         rect(k*w, height-this.a[k]-60, w-2, this.a[k]);
       }
       fill(0,0,90); textAlign(LEFT,BOTTOM);
       text(`QuickSort  active=${this.partActive}  seg=[${this.l},${this.r}] i=${this.i} j=${this.j} pivot=${this.pivot}`, 12, height-16);
     }
   }
   
   // =====================================================
   // 4) BFS/DFS on grid (toggle with B)
   // =====================================================
   class GraphSearchViz{
     constructor(){
       this.cols=50; this.rows=32;
       this.cell = Math.min(width/this.cols, (height-80)/this.rows)|0;
       this.grid = [...Array(this.cols)].map((_,x)=> [...Array(this.rows)].map((_,y)=> ({x,y,wall:false})));
       for(let x=0;x<this.cols;x++) for(let y=0;y<this.rows;y++) if (random()<0.18) this.grid[x][y].wall=true;
       this.bfs = true;
       this.start=this.grid[2][2]; this.goal=this.grid[this.cols-3][this.rows-3];
       this.start.wall=false; this.goal.wall=false;
       this.reset();
     }
     reset(){
       this.dq=[]; this.vis=new Set(); this.prev=new Map(); this.found=false;
       this.dq.push(this.start); this.vis.add(this.keyOf(this.start));
     }
     keyOf(n){ return `${n.x},${n.y}`; }
     toggle(){ this.bfs=!this.bfs; this.reset(); }
     nbs(n){
       const a=[]; const d=[[1,0],[-1,0],[0,1],[0,-1]];
       for(const [dx,dy] of d){ const nx=n.x+dx, ny=n.y+dy;
         if (nx>=0&&ny>=0&&nx<this.cols&&ny<this.rows) a.push(this.grid[nx][ny]); }
       return a;
     }
     update(){
       let steps=200; if (this.found) steps=0;
       while(steps-- > 0 && this.dq.length){
         const cur = this.bfs? this.dq.shift() : this.dq.pop();
         if (cur===this.goal){ this.found=true; break; }
         for(const nb of this.nbs(cur)){
           if (nb.wall || this.vis.has(this.keyOf(nb))) continue;
           this.vis.add(this.keyOf(nb)); this.prev.set(this.keyOf(nb), cur);
           this.dq.push(nb); // remove order defines BFS/DFS with shift/pop above
         }
       }
     }
     render(){
       push();
       translate((width-this.cols*this.cell)/2, 40);
       noStroke();
       for(let x=0;x<this.cols;x++) for(let y=0;y<this.rows;y++){
         const n=this.grid[x][y];
         fill(n.wall? 220: 230, 4, n.wall? 30: 16); rect(x*this.cell, y*this.cell, this.cell-1, this.cell-1);
       }
       for(const k of this.vis){ const [x,y]=k.split(',').map(Number); fill(210,70,90,80); rect(x*this.cell,y*this.cell,this.cell-1,this.cell-1); }
       for(const q of this.dq){ fill(140,70,90,90); rect(q.x*this.cell, q.y*this.cell, this.cell-1, this.cell-1); }
       // path
       if (this.found){
         let t=this.goal;
         while(t && t!==this.start){
           fill(45,100,100); rect(t.x*this.cell, t.y*this.cell, this.cell-1, this.cell-1);
           t = this.prev.get(this.keyOf(t));
         }
       }
       // endpoints
       fill(0,100,100); rect(this.start.x*this.cell, this.start.y*this.cell, this.cell-1, this.cell-1);
       fill(300,100,100); rect(this.goal.x*this.cell, this.goal.y*this.cell, this.cell-1, this.cell-1);
       pop();
       fill(0,0,90); textAlign(LEFT, BOTTOM);
       text(`BFS/DFS  (B to toggle)  algo=${this.bfs?'BFS':'DFS'}`, 12, height-16);
     }
     keyPressed(k){ if (k==='B'||k==='b') this.toggle(); }
     onResize(){ this.cell = Math.min(width/this.cols, (height-80)/this.rows)|0; }
   }
   
   // =====================================================
   // L) Life (Conway)
   // =====================================================
   class LifeViz{
     constructor(){
       this.cols=120; this.rows=80;
       this.cell = Math.min(width/this.cols, (height-80)/this.rows)|0;
       this.xoff = (width - this.cols*this.cell)/2; this.yoff = 40;
       this.grid=[...Array(this.cols)].map(()=>Array(this.rows).fill(false));
       this.next=[...Array(this.cols)].map(()=>Array(this.rows).fill(false));
       this.age =[...Array(this.cols)].map(()=>Array(this.rows).fill(0));
       this.paused=false; this.stepsPerFrame=1; this.brush=6;
       this.ageInc=0.04; this.ageDecay=0.965; this.trail=0.90;
       this.randomize(0.18);
     }
     randomize(p){
       for(let x=0;x<this.cols;x++) for(let y=0;y<this.rows;y++){
         const a = random()<p; this.grid[x][y]=a; this.age[x][y]= a? random(0.3,0.8):0;
       }
     }
     clear(){ for(let x=0;x<this.cols;x++) for(let y=0;y<this.rows;y++){ this.grid[x][y]=false; this.age[x][y]=0; } }
     nbr(x,y){
       let c=0; for(let dx=-1;dx<=1;dx++) for(let dy=-1;dy<=1;dy++){
         if (!dx && !dy) continue;
         const nx=(x+dx+this.cols)%this.cols, ny=(y+dy+this.rows)%this.rows;
         if (this.grid[nx][ny]) c++;
       } return c;
     }
     step(){
       for(let x=0;x<this.cols;x++) for(let y=0;y<this.rows;y++){
         const n=this.nbr(x,y), a=this.grid[x][y];
         const born=!a && n===3, survive=a && (n===2||n===3);
         this.next[x][y]=born||survive;
         const ap=this.age[x][y];
         this.age[x][y] = this.next[x][y] ? Math.min(1, ap+this.ageInc) : ap*this.ageDecay;
       }
       const tmp=this.grid; this.grid=this.next; this.next=tmp;
     }
     update(){ if (!this.paused){ for(let s=0;s<this.stepsPerFrame;s++) this.step(); } }
     render(){
       push(); translate(this.xoff, this.yoff); noStroke(); colorMode(HSB,360,100,100,100);
       for(let x=0;x<this.cols;x++) for(let y=0;y<this.rows;y++){
         const a=this.age[x][y];
         if (this.grid[x][y]){ fill((a*360)%360, 100, 100); }
         else { fill(0,0, this.trail*Math.pow(a,.9)*100); }
         rect(x*this.cell, y*this.cell, this.cell-1, this.cell-1);
       }
       pop();
       fill(0,0,90); textAlign(LEFT,BOTTOM);
       text(`Life — SPACE pause, C clear, G glider, [ ] brush, ↑/↓ speed, S step`, 12, height-16);
     }
     handleBrush(mx,my,alive){
       const gx = Math.floor((mx - this.xoff)/this.cell);
       const gy = Math.floor((my - this.yoff)/this.cell);
       if (gx<0||gy<0||gx>=this.cols||gy>=this.rows) return;
       const r=this.brush;
       for(let dx=-r;dx<=r;dx++) for(let dy=-r;dy<=r;dy++){
         const x=gx+dx, y=gy+dy;
         if (x<0||y<0||x>=this.cols||y>=this.rows) continue;
         if (dx*dx+dy*dy>r*r) continue;
         this.grid[x][y]=alive; this.age[x][y]= alive? Math.max(this.age[x][y], .6):0;
       }
     }
     putGlider(mx,my){
       const gx = Math.floor((mx - this.xoff)/this.cell);
       const gy = Math.floor((my - this.yoff)/this.cell);
       const pts=[[1,0],[2,1],[0,2],[1,2],[2,2]];
       for(const [dx,dy] of pts){
         const x=gx+dx, y=gy+dy;
         if (x>=0&&y>=0&&x<this.cols&&y<this.rows){ this.grid[x][y]=true; this.age[x][y]=Math.max(this.age[x][y], .6); }
       }
     }
     keyPressed(k){
       if (k===' ') this.paused=!this.paused;
       else if (k==='c'||k==='C') this.clear();
       else if (k==='g'||k==='G') this.putGlider(mouseX,mouseY);
       else if (k===']') this.brush=Math.min(64, this.brush+1);
       else if (k==='[') this.brush=Math.max(1, this.brush-1);
       else if ((k==='s'||k==='S') && this.paused) this.step();
       else if (keyCode===UP_ARROW) this.stepsPerFrame=Math.min(64,this.stepsPerFrame+1);
       else if (keyCode===DOWN_ARROW) this.stepsPerFrame=Math.max(1,this.stepsPerFrame-1);
     }
     mousePressed(){ this.handleBrush(mouseX,mouseY, mouseButton!==RIGHT); }
     mouseDragged(){ this.handleBrush(mouseX,mouseY, mouseButton!==RIGHT); }
     onResize(){ this.cell = Math.min(width/this.cols, (height-80)/this.rows)|0; this.xoff=(width - this.cols*this.cell)/2; }
   }
   
   // =====================================================
   // D) Generative Divide & Conquer Art  ← 追加モード
   // （前に作った p5.js 版を統合向けに微調整）
   // =====================================================
   class GenerativeDivideViz{
     constructor(){
       // 状態
       this.maxDepth = 7; this.minSize = 28; this.modeQuadtree=false;
       this.autoDepth=true; this.animate=true; this.showGutter=true;
       this.showOutline=true; this.showLabels=false; this.usePatterns=true;
       this.gutter=4; this.paletteIndex=0; this.seedBase=12345;
       this.manualDepth=5;
   
       this.PAL = this.buildPalettes();
       randomSeed(this.seedBase); noiseSeed(this.seedBase);
       this.imgSource = null; this.useImageQuadtree=false; this.imageColorFill=false; this.imgVarThreshold=8.0;
       this.viewScale=1; this.viewPanX=0; this.viewPanY=0; this.panning=false; this.lastMX=0; this.lastMY=0; this.lastClickMillis=-1000;
       this.rootRect = null;
   
       // 画像は必要な時に読み込む（OpenProcessing/Next 公開想定）
       // loadImage('source.jpg', img => this.imgSource=img);
     }
     buildPalettes(){
       return [
         [ color(10,80,95), color(50,90,95), color(210,70,95), color(0,0,15), color(0,0,100) ],
         [ color(15,90,98), color(25,85,98), color(35,80,98), color(280,25,80), color(210,20,85) ],
         [ color(190,70,95), color(160,50,85), color(210,50,85), color(230,30,80), color(200,10,95) ],
         [ color(120,60,80), color(95,40,70), color(60,50,90), color(35,45,90), color(15,20,95) ]
       ];
     }
     applyCanvasTransform(){
       translate(width*0.5 + this.viewPanX, height*0.5 + this.viewPanY);
       scale(this.viewScale);
       translate(-width*0.5, -height*0.5);
     }
     update(){}
     render(){
       const depthNow = this.autoDepth ? floor((millis()/1000) % (this.maxDepth+1)) : constrain(this.manualDepth, 0, this.maxDepth);
       const t = this.animate ? millis()*0.001 : 0;
   
       push();
       this.applyCanvasTransform();
       noStroke(); fill(0,0,0,6); rect(14,14,width-28,height-28,8);
   
       this.rootRect = {x:20,y:20,w:width-40,h:height-40};
       this.divide(this.rootRect, depthNow, t, 0);
       pop();
     }
     // 分割
     divide(r, depth, t, level){
       let stop = (depth<=0 || r.w<this.minSize || r.h<this.minSize);
       if (this.useImageQuadtree && this.imgSource && !stop){
         const std = this.regionStdBright(r, 14);
         if (std < this.imgVarThreshold) stop = true;
       }
       if (stop){ this.drawLeaf(r, level, t); return; }
   
       const stopProb = map(level, 0, this.maxDepth, 0.02, 0.25);
       if (!this.useImageQuadtree && random() < stopProb){ this.drawLeaf(r, level, t); return; }
   
       const asp = r.w/max(1,r.h);
       const nDir = noise(r.x*0.01, r.y*0.01, t*0.25 + level*0.37);
       const verticalFirst = (asp>1.15)?true:(asp<0.87)?false:(nDir<0.5);
   
       const phi = 0.6180339887;
       const nR = noise(r.x*0.02+100, r.y*0.02-50, t*0.3 + level*0.11);
       let ratio;
       if (nR<0.33) ratio=0.5;
       else if (nR<0.66) ratio=(nR<0.495)?(1.0-phi):phi;
       else ratio = map(noise(r.x*0.07, r.y*0.07, t*0.2), 0,1, 0.25, 0.75);
       ratio = constrain(ratio + map(noise(r.x*0.03-33, r.y*0.03+77, t*0.5),0,1,-0.12,0.12), 0.18, 0.82);
   
       if (!this.modeQuadtree){
         if (verticalFirst){
           const cut = r.w*ratio;
           const g = this.showGutter ? min(this.gutter, min(cut, r.w-cut) - 1) : 0;
           const leftW = cut - g*0.5;
           const rightX = r.x + cut + g*0.5;
           const rightW = r.w - cut - g*0.5;
           if (this.showGutter && g>0){ noStroke(); fill(0,0,0,12); rect(r.x + cut - g*0.5, r.y, g, r.h); }
           if (leftW>1) this.divide({x:r.x,y:r.y,w:leftW,h:r.h}, depth-1, t, level+1);
           if (rightW>1) this.divide({x:rightX,y:r.y,w:rightW,h:r.h}, depth-1, t, level+1);
         } else {
           const cut = r.h*ratio;
           const g = this.showGutter ? min(this.gutter, min(cut, r.h-cut) - 1) : 0;
           const topH = cut - g*0.5;
           const botY = r.y + cut + g*0.5;
           const botH = r.h - cut - g*0.5;
           if (this.showGutter && g>0){ noStroke(); fill(0,0,0,12); rect(r.x, r.y + cut - g*0.5, r.w, g); }
           if (topH>1) this.divide({x:r.x,y:r.y,w:r.w,h:topH}, depth-1, t, level+1);
           if (botH>1) this.divide({x:r.x,y:botY,w:r.w,h:botH}, depth-1, t, level+1);
         }
       } else {
         const cutX = r.w*ratio;
         const cutY = r.h*(0.32 + 0.36*noise(r.x*0.025+7, r.y*0.025-9, t*0.33));
         const gx = this.showGutter ? min(this.gutter, min(cutX, r.w-cutX) - 1) : 0;
         const gy = this.showGutter ? min(this.gutter, min(cutY, r.h-cutY) - 1) : 0;
         if (this.showGutter && gx>0){ noStroke(); fill(0,0,0,12); rect(r.x + cutX - gx*0.5, r.y, gx, r.h); }
         if (this.showGutter && gy>0){ noStroke(); fill(0,0,0,12); rect(r.x, r.y + cutY - gy*0.5, r.w, gy); }
         const x1=r.x, x2=r.x+cutX+gx*0.5;
         const y1=r.y, y2=r.y+cutY+gy*0.5;
         const w1=cutX-gx*0.5, w2=r.w-cutX-gx*0.5;
         const h1=cutY-gy*0.5, h2=r.h-cutY-gy*0.5;
         if (w1>1 && h1>1) this.divide({x:x1,y:y1,w:w1,h:h1}, depth-1, t, level+1);
         if (w2>1 && h1>1) this.divide({x:x2,y:y1,w:w2,h:h1}, depth-1, t, level+1);
         if (w1>1 && h2>1) this.divide({x:x1,y:y2,w:w1,h:h2}, depth-1, t, level+1);
         if (w2>1 && h2>1) this.divide({x:x2,y:y2,w:w2,h:h2}, depth-1, t, level+1);
       }
     }
     // 葉
     drawLeaf(r, level, t){
       let col;
       if (this.useImageQuadtree && this.imgSource && this.imageColorFill){
         col = this.averageColorFromImage(r);
       } else {
         let u = map(level, 0, max(1,this.maxDepth), 0, 1);
         u += map(noise(r.x*0.01, r.y*0.01, t*0.2), 0,1, -0.2, 0.2);
         u = constrain(u, 0, 1);
         col = this.paletteLerp(this.PAL[this.paletteIndex % this.PAL.length], u);
       }
       noStroke(); fill(0,0,0,8); rect(r.x+2, r.y+2, r.w, r.h, 4);
       noStroke(); fill(hue(col), saturation(col), brightness(col), 82); rect(r.x, r.y, r.w, r.h, 4);
       if (this.usePatterns){ const pat=this.choosePattern(r,t); this.drawPattern(r,pat,level,t,col); }
       if (this.showOutline){
         stroke(0,0,0,28); strokeWeight(max(1, min(6, min(r.w,r.h)*0.02))); noFill(); rect(r.x,r.y,r.w,r.h,4);
       }
       if (this.showLabels){ noStroke(); fill(0,0,0,90); textSize(11); textAlign(LEFT,TOP); text(`d:${level}`, r.x+4, r.y+2); }
     }
     // 補助
     paletteLerp(pal, t){ if (!pal?.length) return color(0,0,100); if (pal.length===1) return pal[0];
       const idx=t*(pal.length-1); const i=constrain(floor(idx),0,pal.length-2); const f=idx-i; return lerpColor(pal[i], pal[i+1], f); }
     choosePattern(r,t){ const n=noise(r.x*0.015+31, r.y*0.015-27, t*0.4); if (n<.18) return 0; else if (n<.45) return 1; else if (n<.63) return 2; else if (n<.82) return 3; else return 4; }
     hatch(r, ang, step){ push(); translate(r.x+r.w*.5, r.y+r.h*.5); rotate(radians(ang)); stroke(0,0,0,22); strokeWeight(1);
       const L=max(r.w,r.h)*1.5; for(let x=-L;x<=L;x+=step) line(x,-L,x,L); pop(); }
     crossHatch(r, step){ this.hatch(r,35,step); this.hatch(r,-35,step); }
     dots(r, step){ noStroke(); fill(0,0,0,28); const m=step*.5; for(let yy=r.y+m; yy<r.y+r.h-m; yy+=step) for(let xx=r.x+m; xx<r.x+r.w-m; xx+=step) ellipse(xx,yy,2.2,2.2); }
     rings(r){ push(); translate(r.x+r.w*.5, r.y+r.h*.5); noFill(); stroke(0,0,0,18); strokeWeight(1.5); const R=max(4, min(r.w,r.h)*.5);
       for(let rad=R; rad>4; rad-=6) ellipse(0,0,rad*2,rad*2); pop(); }
     drawPattern(r, pat, level, t, base){
       switch(pat){
         case 0: return;
         case 1: this.hatch(r, 45 + 30*noise(r.x*0.02, r.y*0.02, t*0.2), map(level,0,max(1,this.maxDepth),22,8)); break;
         case 2: this.dots(r,  map(level,0,max(1,this.maxDepth),9,4)); break;
         case 3: this.crossHatch(r, map(level,0,max(1,this.maxDepth),26,10)); break;
         case 4: this.rings(r); break;
       }
     }
     // 画像統計（必要時のみ）
     regionStdBright(r, samples){
       if (!this.imgSource || !this.rootRect) return 0;
       let sum=0,sum2=0,cnt=0;
       for(let j=0;j<samples;j++){
         for(let i=0;i<samples;i++){
           const px=r.x+(i+.5)*(r.w/samples), py=r.y+(j+.5)*(r.h/samples);
           const u=constrain((px-this.rootRect.x)/this.rootRect.w,0,1), v=constrain((py-this.rootRect.y)/this.rootRect.h,0,1);
           const ix=int(u*(this.imgSource.width-1)), iy=int(v*(this.imgSource.height-1));
           const c=this.imgSource.get(ix,iy);
           const b=brightness(c); sum+=b; sum2+=b*b; cnt++;
         }
       }
       if (!cnt) return 0; const mean=sum/cnt; const vari=max(0, sum2/cnt - mean*mean); return sqrt(vari);
     }
     averageColorFromImage(r){
       if (!this.imgSource || !this.rootRect) return color(0,0,100);
       const samples=16; let sr=0,sg=0,sb=0,cnt=0;
       for(let j=0;j<samples;j++){
         for(let i=0;i<samples;i++){
           const px=r.x+(i+.5)*(r.w/samples), py=r.y+(j+.5)*(r.h/samples);
           const u=constrain((px-this.rootRect.x)/this.rootRect.w,0,1), v=constrain((py-this.rootRect.y)/this.rootRect.h,0,1);
           const ix=int(u*(this.imgSource.width-1)), iy=int(v*(this.imgSource.height-1));
           const c=this.imgSource.get(ix,iy); sr+=red(c); sg+=green(c); sb+=blue(c); cnt++;
         }
       }
       if (!cnt) return color(0,0,100); return color(sr/cnt, sg/cnt, sb/cnt);
     }
     // 入力
     keyPressed(k){
       if (k==='R'||k==='r'){ this.seedBase=floor(random(1<<30)); randomSeed(this.seedBase); noiseSeed(this.seedBase); }
       else if (k==='P'||k==='p'){ this.paletteIndex=(this.paletteIndex+1)%this.PAL.length; }
       else if (k==='M'||k==='m'){ this.modeQuadtree=!this.modeQuadtree; }
       else if (k==='A'||k==='a'){ this.animate=!this.animate; }
       else if (k==='D'||k==='d'){ this.autoDepth=!this.autoDepth; }
       else if (k==='['){ this.manualDepth=max(0,this.manualDepth-1); this.autoDepth=false; }
       else if (k===']'){ this.manualDepth=min(this.maxDepth,this.manualDepth+1); this.autoDepth=false; }
       else if (k==='G'||k==='g'){ this.showGutter=!this.showGutter; }
       else if (k==='O'||k==='o'){ this.showOutline=!this.showOutline; }
       else if (k==='H'||k==='h'){ this.usePatterns=!this.usePatterns; }
       else if (k==='I'||k==='i'){ this.useImageQuadtree=!this.useImageQuadtree; if (this.useImageQuadtree && !this.imgSource) console.log('[IMG] place public/p5/source.jpg and reload'); if (this.useImageQuadtree) this.modeQuadtree=true; }
       else if (k==='C'||k==='c'){ this.imageColorFill=!this.imageColorFill; }
       else if (k==='0'){ this.resetView(); }
     }
     mousePressed(){ this.panning=true; this.lastMX=mouseX; this.lastMY=mouseY; const now=millis(); if (now-this.lastClickMillis<300) this.resetView(); this.lastClickMillis=now; }
     mouseDragged(){ if (!this.panning) return; const dx=mouseX-this.lastMX, dy=mouseY-this.lastMY; this.viewPanX+=dx; this.viewPanY+=dy; this.lastMX=mouseX; this.lastMY=mouseY; }
     mouseReleased(){ this.panning=false; }
     mouseWheel(e){
       const delta = e.delta; const factor = pow(1.05, -delta/53);
       const beforeX = (mouseX - (width*0.5 + this.viewPanX)) / this.viewScale + width*0.5;
       const beforeY = (mouseY - (height*0.5 + this.viewPanY)) / this.viewScale + height*0.5;
       this.viewScale = constrain(this.viewScale * factor, 0.2, 6.0);
       const afterX = (mouseX - (width*0.5 + this.viewPanX)) / this.viewScale + width*0.5;
       const afterY = (mouseY - (height*0.5 + this.viewPanY)) / this.viewScale + height*0.5;
       this.viewPanX += (afterX - beforeX) * this.viewScale;
       this.viewPanY += (afterY - beforeY) * this.viewScale;
       return false; // ページスクロール抑止
     }
     resetView(){ this.viewScale=1; this.viewPanX=0; this.viewPanY=0; }
   }
   
   // =====================================================
   // Placeholder（あとで埋める用の安全なダミー）
   // =====================================================
   class PlaceholderViz{
     constructor(name){ this.name=name; this.t=0; }
     update(){ this.t++; }
     render(){
       noStroke(); fill(0,0,20); rect(0,0,width,height);
       push(); translate(width/2, height/2);
       noFill(); stroke(210,50,90); strokeWeight(2);
       const r=min(width,height)*0.25;
       rotate(this.t*0.01);
       ellipse(0,0,r*2,r);
       rotate(-this.t*0.02);
       rectMode(CENTER); rect(0,0,r*1.6,r*1.6,12);
       pop();
       fill(0,0,90); textAlign(CENTER, CENTER); textSize(18);
       text(`${this.name}\n(Coming soon)`, width/2, height/2);
     }
   }
   
   // =====================================================
   // mount canvas into container
   // =====================================================
   (function initDOMOptions(){
     // ページ側でスクロールを抑える
     window.addEventListener('wheel', (e)=> {
       // キャンバス内は p5 側で処理、外はそのまま
     }, { passive: false });
   })();
   