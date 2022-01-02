const TheBoardSolverApp = {
  data() {
    return {
      boardInput: '',
      board: '',
      boardMatrix: [],
      solution: {},
      validWords: this.solution.validWordsArray,
      dictionary: getDictionary(),
      history: getHistory(),
      historyIndex: 0,
      historyLength: 0,
      historyMaxLength: 10,
    }
  },
  computed: {
    boardInputValid() {
      return validateBoard(this.boardInput)?.valid
    },
    boardInputError() {
      return validateBoard(this.boardInput)?.error
    },
    boardParameter() {
      return getBoardParameter()
    },
    gridSizeParameter() {
      return getGridSizeParameter()
    },
  },
  created() {
    this.boardInput = this.boardParameter || '';
    this.board = this.boardInput?.length && validateBoard(this.boardInput)?.board || randomBoard();
    this.gridSize = this.board && Math.sqrt(board.length) || this.gridSizeParameter;
    this.solution = solveBoard(this.board);
    this.boardMatrix = [];
    this.validWords = this.solution.validWordsArray;
  },

  methods: {
    solveBoard() {
      this.solution = solveBoard(this.board);
      this.validWords = this.solution.validWordsArray;
    },
    updateBoard(board) {
      this.boardInput = getBoardInputParams(board);
      this.board = boardInput?.length && validateBoard(boardInput)?.board || randomBoard();
      this.solution = solveBoard(this.boardInput);
      this.validWords = this.solution.validWordsArray;
    },
    randomizeBoard() {
      this.updateBoard(randomBoard());
    },
    clearBoard() {
      this.updateBoard([]);
    },
    clearHistory() {
      this.history = [];
      localStorage.setItem('history', JSON.stringify([]));
    },
    saveHistory() {
      updateHistory(this.board);
    },
    loadHistory() {
      this.updateBoard(this.history[this.history.length - 1]);
    },
    undo() {
      this.updateBoard(this.history[this.history.length - 2]);
    },
    redo() {
      this.updateBoard(this.history[this.history.length - 1]);
    }
  },

  computed: {
    boardInputString() {
      return JSON.stringify(this.boardInput);
    },
    solutionString() {
      return JSON.stringify(this.solution);
    },
    validWordsString() {
      return JSON.stringify(this.validWords);
    },
    historyString() {
      return JSON.stringify(this.history);
    },
    boardMatrix() {
      for (let i = 0; i < this.board.length; i++) {
        let row = [];
        for (let j = 0; j < this.board.length; j++) {
          row.push(this.board[i][j]);
        }
        matrix.push(row);
      }
      return matrix;
    },
  },

  watch: {
    board: function (newValue) {
      updateHistory(newValue);
    },
    boardInput: function (newValue) {
      var validResult = validateBoard(newValue);
      if (validResult?.board) {
        this.board = validResult.board;
        this.solution = solveBoard(this.board);
        this.validWords = this.solution.validWordsArray;
      }
    },
  },
  template: `
  <div class="py-4">
    <div class="row">
      <div class="col-md-12">
        <!-- <BoardInput></BoardInput> -->
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <Board boardMatrix="boardMatrix"></Board>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <!-- <ValidWords></ValidWords> -->
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <!-- <History></History> -->
      </div>
    </div>
  </div>
  `
}