function DecisionTree(questions) {
  this.questions = questions;

  this.init = () => {
    let root = this.questions['root'].children;
    return this.getNodes(root);
  };
 
  this.getNodes = (arrChildId) => {
    if (!arrChildId) return [];
    let list = [];

    arrChildId.forEach(id => {
      let node = this.questions[id];
      list.push(node);
    });

    return list; 
  };

  // Get an array of node children
  this.getChildNode = (id) => {
    // Stop when reaching the final questions.
    if (!('children' in this.questions[id])) return false;

    let childIds = this.questions[id].children;
    return this.getNodes(childIds);
  };
   
  // Set parent node for each node, except root node
  this.setParents = () => {
    for (let id in this.questions) {
      this.questions[id].id = id;
      let arrChildNode = this.getChildNode(id);

      for (let i = 0; i < arrChildNode.length; i++) {
        let child = arrChildNode[i];
        if (child.parent) {
          throw `Can't assign parent because it already has parent`;
        }

        child.parent = id;
      };
    }
  };

  this.getParent = (parentId) => {
    return this.questions[parentId];
  };

};

(function() {
  /* QUESTIONS */
  const questions = {
    'root': {
      key: `Let't Start`,
      children: ['home', 'hang-out']
    },
    'home': {
      key: 'Stay home?',
      children: ['watch-movie', 'tv-show', 'cook', 'play-music']
    },
    'hang-out': {
      key: 'Hang out with friends?',
      children: ['cinema', 'drink', 'restaurant']
    },

    'watch-movie': {
      key: 'Watch a movie?',
      children: ['romantic', 'scary', 'action', 'comedy']
    },
    'tv-show': {
      key: 'Watch a TV show?',
      children: ['drama', 'sport', 'comedy-tv']
    },
    'cook': {
      key: 'Cook a meal?',
      children: ['spicy', 'traditional']
    },
    'play-music': {
      key: 'Play a song?',
      children: ['rap', 'rnb']
    },

    'cinema': {
      key: 'Go to the cinema?',
      children: ['romantic-cine', 'scary-cine']
    },
    'drink': {
      key: 'Have a drink?',
      children: ['beer', 'whiskey']
    },
    'restaurant': {
      key: 'Visit a restaurant?',
      children: ['italian', 'bbq']
    },

    'romantic': {
      key: 'Notebook'
    },
    'scary': {
      key: 'Insidious'
    },
    'action': {
      key: 'Fast and furious 9'
    },
    'comedy': {
      key: 'Mr.Bean'
    },
    
    'drama': {
      key: 'Penhouse'
    },
    'sport': {
      key: 'Premier League'
    },
    'comedy-tv': {
      key: 'Running Man'
    },
    
    'spicy': {
      key: 'Tokbokki, noddle, peppers with pizza, chicken fire,...'
    },
    'traditional': {
      key: 'Rice, noddle, pasta,...'
    },

    'rap': {
      key: 'Post Malone, Kendrick Lamar, Travis Scott,...'
    },
    'rnb': {
      key: 'Justin Bieber, Justin Timberlake, Chris Brown,...'
    },
    
    'romantic-cine': {
      key: 'How I Met Your Mother'
    },
    'scary-cine': {
      key: 'Covering our faces'
    },
    
    'beer': {
      key: 'Pisswasser'
    },
    'whiskey': {
      key: 'Black Bush'
    },
    
    'italian': {
      key: 'Spag bol'
    },
    'bbq': {
      key: 'Meat in a bap'
    }
  };

  // Selecting elements
  const question = document.getElementById('quizz');
  let answer = document.getElementById('choices');
  let btnBack = document.getElementById('back');

  let tree, currId;

  const toggleBackBtn = () => {
    if (!currId || currId == 'root') {
      btnBack.classList.add('hidden');
    } else {
      btnBack.classList.remove('hidden');
    }
  };

  const renderQuestion = (nodes) => {
    let quizz = tree.getParent(nodes[0].parent).key;
    question.textContent = quizz;

    // Remove the previous answer.
    answer.innerHTML = '';
    toggleBackBtn();
    nodes.forEach(node => {
      answer.innerHTML += `<tr><td><li><p choice="${node.id}" class="answer">${node.key}</p></li</td></tr>`;
    });
  };

  function start() {
    tree = new DecisionTree(questions);
    let rootQuestion = tree.init();
    currId = null;

    tree.setParents();
    renderQuestion(rootQuestion);
  };
  start();

  document.addEventListener('click', (e) => {
    let answer = e.target;

    if (answer.classList == 'answer') {
      let child = tree.getChildNode(answer.getAttribute('choice'));

      if (child) {
        currId = answer.getAttribute('choice');
        renderQuestion(child);
      }
    }
  });

  // Back to the previos question
  btnBack.addEventListener('click', () => {
    if (!currId) return false;

    let pr = tree.getParent(currId);
    if (currId !== 'root') {
      currId = pr.parent;
      renderQuestion(tree.getChildNode(currId));
    }
  });
})();