function getDictionary(dictionaryObj) {
  if (localStorage.getItem('dictionary') === null) {
    var req = new XMLHttpRequest();
    req.open('GET', 'scripts/Collins2019Words.json', false);
    req.send(null);
    var dictionary = JSON.parse(req.responseText);
    localStorage.setItem('dictionary', JSON.stringify(dictionary));
  } else {
    var dictionary = JSON.parse(localStorage.getItem('dictionary'));
  }
  return dictionary;
}

function updateHistory(board) {
}

function renderUI() {
  var boggleBoard = document.querySelector('#boggle-board');
  var boggleBoardInput = document.querySelector('#board-input');
  var validWordsList = document.querySelector('#valid-words-list');

  boggleBoard.innerHTML = '';
  boggleBoardInput.value = '';
  validWordsList.innerHTML = '';

  boggleBoardInput.value = SOLUTION.board.join(',');

  SOLUTION.validWordArray.forEach(function (word) {
    var li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerText = word;
    validWordsList.appendChild(li);
  });

  var validWordsGroup = document.createElement('div');

  let root = document.documentElement;
  root.style.setProperty('--grid-size', SOLUTION.gridSize);

  for (let i = 0; i < SOLUTION.gridSize; i++) {
    var row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < SOLUTION.gridSize; j++) {
      var squareElement = document.createElement('div');
      squareElement.classList.add('square');

      var squareText = document.createElement('span');
      squareText.classList.add('square-content');
      squareText.innerText = SOLUTION.board[i * SOLUTION.gridSize + j];
      squareElement.appendChild(squareText);

      row.appendChild(squareElement);
    }
    boggleBoard.appendChild(row);
  }
}

function generateRandomBoard() {
  var gridSize = document.querySelector('#grid-size-input').value;
  BOARD = randomBoard(gridSize);
  console.log('BOARD', BOARD);

  const url = new URL(window.location);
  url.searchParams.set('board', BOARD.join(','));
  window.history.pushState({}, '', url);

  SOLUTION = solveBoard(BOARD, DICTIONARY, 3);
  console.log('SOLVER OUTPUT', JSON.stringify(SOLUTION));

  renderUI();
}

// Needs Collins2019Words (Trie Dictionary) to work;
const DICE_SETS = {
  3: [["A", "A", "E", "E", "G", "N"], ["A", "B", "B", "J", "O", "O"], ["A", "C", "H", "O", "P", "S"], ["A", "F", "F", "K", "P", "S"], ["A", "O", "O", "T", "T", "W"], ["C", "I", "M", "O", "T", "U"], ["D", "E", "I", "L", "R", "X"], ["D", "E", "L", "R", "V", "Y"], ["D", "I", "S", "T", "T", "Y"]],
  4: [["A", "A", "E", "E", "G", "N"], ["A", "B", "B", "J", "O", "O"], ["A", "C", "H", "O", "P", "S"], ["A", "F", "F", "K", "P", "S"], ["A", "O", "O", "T", "T", "W"], ["C", "I", "M", "O", "T", "U"], ["D", "E", "I", "L", "R", "X"], ["D", "E", "L", "R", "V", "Y"], ["D", "I", "S", "T", "T", "Y"], ["E", "E", "G", "H", "N", "W"], ["E", "E", "I", "N", "S", "U"], ["E", "H", "R", "T", "V", "W"], ["E", "I", "O", "S", "S", "T"], ["E", "L", "R", "T", "T", "Y"], ["H", "I", "M", "N", "U", "QU"], ["H", "L", "N", "N", "R", "Z"]],
  5: [["A", "A", "A", "R", "F", "S"], ["A", "A", "E", "E", "E", "E"], ["A", "A", "F", "I", "R", "S"], ["A", "E", "D", "N", "N", "N"], ["A", "E", "E", "E", "E", "M"], ["A", "E", "E", "G", "M", "U"], ["A", "E", "G", "M", "N", "N"], ["A", "F", "I", "R", "S", "Y"], ["B", "J", "K", "QU", "X", "Z"], ["C", "C", "E", "N", "S", "T"], ["C", "E", "I", "I", "L", "T"], ["C", "E", "I", "L", "P", "T"], ["C", "E", "I", "P", "S", "T"], ["D", "D", "H", "N", "O", "T"], ["D", "H", "H", "L", "N", "O"], ["D", "H", "H", "L", "O", "R"], ["D", "H", "L", "N", "O", "R"], ["E", "I", "I", "I", "T", "T"], ["E", "M", "O", "T", "T", "T"], ["E", "N", "S", "S", "S", "U"], ["F", "I", "P", "R", "S", "Y"], ["G", "O", "R", "R", "V", "W"], ["I", "K", "L", "QU", "U", "W"], ["N", "O", "O", "T", "U", "W"], ["O", "O", "O", "T", "T", "U"]],
  6: [["A", "A", "A", "F", "R", "S"], ["A", "A", "E", "E", "E", "E"], ["A", "A", "E", "E", "O", "O"], ["A", "A", "F", "I", "R", "S"], ["A", "B", "D", "E", "I", "O"], ["A", "D", "E", "N", "N", "N"], ["A", "E", "E", "E", "E", "M"], ["A", "E", "E", "G", "M", "U"], ["A", "E", "G", "M", "N", "N"], ["A", "E", "I", "L", "M", "N"], ["A", "E", "I", "N", "O", "U"], ["A", "F", "I", "R", "S", "Y"], ["AN", "ER", "HE", "IN", "QU", "TH"], ["B", "B", "J", "K", "X", "Z"], ["C", "C", "E", "N", "S", "T"], ["C", "D", "D", "L", "N", "N"], ["C", "E", "I", "I", "T", "T"], ["C", "E", "I", "P", "S", "T"], ["C", "F", "G", "N", "U", "Y"], ["D", "D", "H", "N", "O", "T"], ["D", "H", "H", "L", "O", "R"], ["D", "H", "L", "N", "O", "R"], ["D", "H", "N", "O", "O", "W"], ["E", "H", "I", "L", "R", "S"], ["E", "I", "I", "L", "S", "T"], ["E", "I", "L", "P", "S", "T"], ["E", "I", "O", "▄", "▄", "▄"], ["E", "M", "O", "T", "T", "T"], ["E", "N", "S", "S", "S", "U"], ["G", "O", "R", "R", "V", "W"], ["H", "I", "R", "S", "T", "V"], ["H", "O", "P", "R", "S", "T"], ["I", "P", "R", "S", "Y", "Y"], ["J", "K", "QU", "W", "X", "Z"], ["N", "O", "O", "T", "U", "W"], ["O", "O", "O", "T", "T", "U"]],
};

let DICTIONARY, BOARD_INPUT, SOLUTION, VALID_WORDS;
document.addEventListener('DOMContentLoaded', function () {
  DICTIONARY = getDictionary();
  main();
  renderUI();
});

function main(BOARD_INPUT = '') {
  if (!BOARD_INPUT && typeof window !== 'undefined') {
    BOARD_INPUT = new URLSearchParams(window.location.search).get('board') || '';
  }

  BOARD = BOARD_INPUT?.length && validateBoard(BOARD_INPUT)?.board || randomBoard();
  SOLUTION = solveBoard(BOARD, DICTIONARY, 3);
  console.log('SOLVER OUTPUT', JSON.stringify(SOLUTION));

  VALID_WORDS = SOLUTION.validWordArray;
  // console.log(VALID_WORDS);
}

function randomBoard(gridSize = 4) {
  console.log('randomBoard', gridSize);
  let board = [];
  const dice = DICE_SETS[gridSize];
  console.log('DICE', dice);

  for (let i = 0; i < dice.length; i++) {
    board.push(dice[i][Math.ceil(Math.random() * dice[i].length - 1)]);
  }
  return board;
}

function solveBoard(boardInput, wordList, minLength = 3) {
  let startRuntime = Date.now();
  let output = {
    status: "initialized",
    validWordArray: undefined,
    boardInput: boardInput,
    board: undefined,
    gridSize: undefined,
    minLength: minLength,
    score: undefined,
    variantScore: undefined,
    messages: [],
    errors: [],
  };

  const boardValidatorResult = validateBoard(boardInput);
  console.log(boardValidatorResult.messages, boardValidatorResult.errors);

  const board = boardValidatorResult.board;
  const gridSize = Math.floor(Math.sqrt(board.length));

  const validWordSet = new Set();
  const boardMatrix = [];
  const dictionaryTrie = GenerateDictionaryTrie(wordList);

  output.status = boardValidatorResult.status;
  output.messages = [...output.messages, ...boardValidatorResult.messages];
  output.errors = [...output.errors, ...boardValidatorResult.errors];
  // console.log(boardValidatorResult);

  if (!board) {
    console.log('SOLVER OUTPUT', output);
    return output;
  }

  // Convert Board to Matrix
  for (let i = 0; i < gridSize; i++) {
    let row = [];
    for (let j = 0; j < gridSize; j++) {
      row.push(board[i * gridSize + j]);
    }
    boardMatrix.push(row);
  }

  /* console.log(boardMatrix.map(function (row) {
      return row.join(" ")
    }).join("\n")); */

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      let word = "";
      let visited = Array(gridSize).fill().map(function () { return Array(gridSize).fill(false) });
      continueWord([i, j], visited, word);
    }
  }

  let validWordArray = Array.from(validWordSet);
  validWordArray.sort(function (a, b) { return a.charCodeAt(0) - b.charCodeAt(0) });
  validWordArray.sort(function (a, b) { return b.length - a.length });

  let runtimeSeconds = (Date.now() - startRuntime) / 1000;
  output = {
    ...output,
    status: "success",
    validWordArray: validWordArray,
    board: board,
    gridSize: gridSize,
    minLength: minLength,
    score: scoreWords(validWordSet),
    variantScore: scoreWords(validWordSet, true),
    count: [...validWordSet].length,
    runtime: runtimeSeconds,
  };

  return output;

  /******************************************************************************
   * End Main Function
  ******************************************************************************/

  function continueWord([row, col], visited, word) {
    var letter = boardMatrix[row][col];
    word += letter;

    // Deep copy visited matrix and mark current position as visited
    visited = JSON.parse(JSON.stringify(visited));
    visited[row][col] = true;

    // Check neighboring positions for valid paths
    var neighbors = getNeighbors([row, col], visited);
    for (var i = 0; i < neighbors.length; i++) {
      let letter = boardMatrix[neighbors[i][0]][neighbors[i][1]];
      if (checkDictionary(word + letter)) {
        continueWord(neighbors[i], visited, word);
      }
    }
  }

  function getNeighbors(startPos, visited) {
    var [row, col] = startPos;
    var neighbors = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let x = row + i;
        let y = col + j;
        if (!(x < 0 || x >= gridSize || y < 0 || y >= gridSize)) {
          if (visited[x][y] !== true) {
            neighbors.push([x, y]);
          }
        }
      }
    }
    return neighbors;
  }

  function checkDictionary(word) {
    var node = dictionaryTrie;
    for (var i = 0; i < word.length; i++) {
      node = node[word[i]];
      if (!node) { return false; }
    }
    if (node) {
      if (node.end) {
        if (word.length >= minLength) {
          validWordSet.add(word);
        }
      }
      return true;
    } else { return false; };
  }

  function scoreWords(words) {
    const result = {};

    result[0] = {
      name: "Length Minus 3",
      score: (function () {
        let score = 0;
        for (let word of words) {
          var points = 0;
          if (word.length < 5) {
            points = 1;
          } else {
            points = word.length - 3;
          }
          score += points;
        }
        return score
      })()
    };

    result[6] = {
      name: "Super Big Boggle (6x6)",
      score: (function () {
        let score = 0;
        for (let word of words) {
          var points = 0;
          if (word.length < 5) {
            points = 1;
          } else if (word.length < 7) {
            points = word.length - 3;
          } else if (word.length === 7) {
            points = 5;
          } else if (word.length === 8) {
            points = 11;
          } else if (word.length >= 9) {
            points = word.length * 2;
          }
          score += points;
        }
        return score
      })()
    };

    result[4] = {
      name: "Standard Boggle",
      score: (function () {
        let score = 0;
        for (let word of words) {
          var points = 0;
          if (word.length < 5) {
            points = 1;
          } else if (word.length < 7) {
            points = word.length - 3;
          } else if (word.length === 7) {
            points = 5;
          } else if (word.length >= 8) {
            points = 11;
          }
          score += points;
        }
        return score
      })()
    };

    result[3] = { ...result[4].score };
    result[5] = { ...result[4].score };

    return result;
  }

  function GenerateDictionaryTrie(wordList) {
    const dictionaryTrie = {};
    for (let i = 0; i < wordList.length; i++) {
      const word = wordList[i];
      var node = dictionaryTrie;
      for (let j = 0; j < word.length; j++) {
        if (!node[word[j]]) {
          node[word[j]] = {};
        }
        node = node[word[j]];
        if (j == word.length - 1) {
          node.end = true;
        }
      }
    }
    return dictionaryTrie;
  }
}

/******************************************************************************
 * Helper Functions
 ******************************************************************************/

const delimiters = [",", " ", "+", "|", "-", "\n", ";"];
const delimitersString = delimiters.map(function (char) { return '\\' + char }).join('');
const delimitersRegex = new RegExp('[' + delimitersString + ']', 'g');
const boardRegex = new RegExp('^[a-zA-Z#' + delimitersString + ']+$', 'gm');

function validateBoard(boardInput) {
  console.log('Validating Board', boardInput);
  const validGridSizes = [3, 4, 5, 6];
  const validBoardLengths = validGridSizes.map(function (size) { return size * size });
  const result = {
    "status": "validatingBoard",
    "messages": [],
    "errors": [],
    "boardInput": boardInput,
    "boardInput": undefined,
  };
  result.messages.push(`board parameter received: ${JSON.stringify(boardInput)}.`);

  let board = [];

  switch (typeof boardInput) {
    case "string":
      boardInput = boardInput.match(boardRegex)?.[0];

      if (boardInput && boardInput.length) {
        if (boardInput.match(boardRegex)) {
          if (boardInput.match(delimitersRegex)) {
            board = boardInput.split(delimitersRegex);
          } else {
            board = boardInput.split('');
          }
        } else {
          result.errors.push(`board parameter contains invalid characters. boardInput input may only contain letters and the following delimiters: ${delimiters.join(',')}.`);
          return result;
        }
      } else {
        result.errors.push(`No board parameter received.`);
        return result;
      }
      break;
    case "object":
      if (Array.isArray(boardInput)) {
        if (boardInput.length) {
          if (boardInput.every(function (letter) {
            return letter.match(/^[A-Za-z#▄]+$/m);
          })) {
            board = boardInput;
          } else {
            result.errors.push("Invalid characters detected in board parameter.");
            return result;
          }
        } else {
          result.errors.push("board parameter is an empty array.");
          return result;
        }
      }
      break;
    default:
      result.errors.push("board parameter must be a string or array.");
      return result;
      break;
  }

  if (board.length) {
    if (validBoardLengths.includes(board.length)) {
      result.board = board.map(function (letter) {
        return letter.toUpperCase()
      });
    } else {
      result.errors.push(`invalid number of cells in board parameter. ${boardInput.length} cells found. Valid boardInput lengths are: ${validBoardLengths.join(", ")}.`);
    }
  } else { result.errors.push("Unable to parse board parameter input."); }

  if (result.board?.length) {
    result.messages.push('Successfully parsed board parameter!', JSON.stringify(result.board));
    result.status = "validateBoard: Success";
  } else {
    result.messages.push('Failed to parse board parameter.', result.errors.map(function (err, index) {
      return (`Error ${index}: ${err}`);
    }).join('\n'));
    result.status = "validateBoard: Failed";
  }
  return result;
}
