<div class="boggle-board" id="boggle-board">
<div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
  <div v-for="(letter, letterIndex) in row" :key="letterIndex" class="square">
    <div class="square-content">
      {{ letter }}
    </div>
  </div>
</div>
</div>